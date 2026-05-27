// Security & Compliance Routes
// Handles security monitoring, audit logs, and compliance tracking

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// =============================================
// GET SECURITY OVERVIEW
// =============================================
router.get('/overview', async (req, res) => {
  try {
    const [securityMetrics] = await db.promise().query(`
      SELECT
        (SELECT COUNT(*) FROM admin_users WHERE is_active = TRUE AND deleted_at IS NULL) as active_admins,
        (SELECT COUNT(*) FROM developer_users WHERE is_active = TRUE AND deleted_at IS NULL) as active_developers,
        (SELECT COUNT(*) FROM users WHERE is_active = TRUE AND deleted_at IS NULL) as active_users,
        (SELECT COUNT(*) FROM admin_users WHERE two_factor_enabled = TRUE AND deleted_at IS NULL) as two_factor_enabled,
        (SELECT COUNT(*) FROM audit_logs WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)) as recent_audit_logs,
        (SELECT COUNT(*) FROM admin_users WHERE failed_login_attempts >= 5 AND deleted_at IS NULL) as locked_accounts
    `);

    // Get recent security events
    const [recentEvents] = await db.promise().query(`
      SELECT
        al.*,
        u.display_name as user_name
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE al.action_type IN ('login', 'permission_change', 'data_export', 'account_change')
        AND al.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      ORDER BY al.created_at DESC
      LIMIT 20
    `);

    res.json({
      success: true,
      metrics: securityMetrics[0],
      recentEvents
    });
  } catch (error) {
    console.error('Error fetching security overview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch security overview',
      error: error.message
    });
  }
});

// =============================================
// GET AUDIT LOGS
// =============================================
router.get('/audit-logs', async (req, res) => {
  try {
    const { user_id, action_type, entity_type, start_date, end_date, limit = 100, offset = 0 } = req.query;

    let query = `
      SELECT
        al.*,
        u.display_name as user_name,
        u.email as user_email
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE al.deleted_at IS NULL
    `;

    const params = [];

    if (user_id) {
      query += ' AND al.user_id = ?';
      params.push(user_id);
    }

    if (action_type) {
      query += ' AND al.action_type = ?';
      params.push(action_type);
    }

    if (entity_type) {
      query += ' AND al.entity_type = ?';
      params.push(entity_type);
    }

    if (start_date && end_date) {
      query += ' AND al.created_at >= ? AND al.created_at <= ?';
      params.push(start_date, end_date);
    }

    query += ' ORDER BY al.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [logs] = await db.promise().query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM audit_logs al WHERE al.deleted_at IS NULL';
    const countParams = [];

    if (user_id) {
      countQuery += ' AND al.user_id = ?';
      countParams.push(user_id);
    }

    if (action_type) {
      countQuery += ' AND al.action_type = ?';
      countParams.push(action_type);
    }

    if (entity_type) {
      countQuery += ' AND al.entity_type = ?';
      countParams.push(entity_type);
    }

    if (start_date && end_date) {
      countQuery += ' AND al.created_at >= ? AND al.created_at <= ?';
      countParams.push(start_date, end_date);
    }

    const [countResult] = await db.promise().query(countQuery, countParams);

    res.json({
      success: true,
      logs,
      pagination: {
        total: countResult[0].total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs',
      error: error.message
    });
  }
});

// =============================================
// CREATE AUDIT LOG ENTRY
// =============================================
router.post('/audit-logs', async (req, res) => {
  try {
    const {
      user_id,
      action_type,
      entity_type,
      entity_id,
      description,
      ip_address,
      user_agent,
      metadata
    } = req.body;

    if (!user_id || !action_type) {
      return res.status(400).json({
        success: false,
        message: 'User ID and action type are required'
      });
    }

    const [result] = await db.promise().query(`
      INSERT INTO audit_logs (
        user_id, action_type, entity_type, entity_id, description,
        ip_address, user_agent, metadata, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      user_id, action_type, entity_type, entity_id, description,
      ip_address, user_agent, JSON.stringify(metadata)
    ]);

    res.status(201).json({
      success: true,
      message: 'Audit log created successfully',
      logId: result.insertId
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create audit log',
      error: error.message
    });
  }
});

// =============================================
// GET USER SECURITY STATUS
// =============================================
router.get('/users/:user_id/security-status', async (req, res) => {
  try {
    const { user_id } = req.params;

    // Get user login history
    const [loginHistory] = await db.promise().query(`
      SELECT
        id,
        last_login_at,
        last_login_ip,
        failed_login_attempts,
        account_locked_until,
        two_factor_enabled,
        created_at
      FROM users
      WHERE id = ?
    `, [user_id]);

    if (loginHistory.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get recent audit logs for this user
    const [recentActivity] = await db.promise().query(`
      SELECT
        action_type,
        entity_type,
        description,
        created_at
      FROM audit_logs
      WHERE user_id = ? AND deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT 20
    `, [user_id]);

    res.json({
      success: true,
      securityStatus: loginHistory[0],
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching user security status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user security status',
      error: error.message
    });
  }
});

// =============================================
// ENABLE TWO FACTOR AUTHENTICATION
// =============================================
router.post('/users/:user_id/enable-2fa', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { two_factor_secret } = req.body;

    if (!two_factor_secret) {
      return res.status(400).json({
        success: false,
        message: 'Two factor secret is required'
      });
    }

    // Update user (works for admin_users, developer_users, or users)
    const tables = ['admin_users', 'developer_users', 'users'];

    for (const table of tables) {
      const [result] = await db.promise().query(
        `UPDATE ${table} SET two_factor_enabled = TRUE, two_factor_secret = ?, updated_at = NOW() WHERE id = ?`,
        [two_factor_secret, user_id]
      );

      if (result.affectedRows > 0) {
        // Create audit log
        await db.promise().query(`
          INSERT INTO audit_logs (user_id, action_type, entity_type, entity_id, description, created_at)
          VALUES (?, 'security_change', 'user', ?, 'Two-factor authentication enabled', NOW())
        `, [user_id, user_id]);

        return res.json({
          success: true,
          message: 'Two-factor authentication enabled successfully'
        });
      }
    }

    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  } catch (error) {
    console.error('Error enabling two-factor authentication:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enable two-factor authentication',
      error: error.message
    });
  }
});

// =============================================
// DISABLE TWO FACTOR AUTHENTICATION
// =============================================
router.post('/users/:user_id/disable-2fa', async (req, res) => {
  try {
    const { user_id } = req.params;

    const tables = ['admin_users', 'developer_users', 'users'];

    for (const table of tables) {
      const [result] = await db.promise().query(
        `UPDATE ${table} SET two_factor_enabled = FALSE, two_factor_secret = NULL, updated_at = NOW() WHERE id = ?`,
        [user_id]
      );

      if (result.affectedRows > 0) {
        // Create audit log
        await db.promise().query(`
          INSERT INTO audit_logs (user_id, action_type, entity_type, entity_id, description, created_at)
          VALUES (?, 'security_change', 'user', ?, 'Two-factor authentication disabled', NOW())
        `, [user_id, user_id]);

        return res.json({
          success: true,
          message: 'Two-factor authentication disabled successfully'
        });
      }
    }

    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  } catch (error) {
    console.error('Error disabling two-factor authentication:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disable two-factor authentication',
      error: error.message
    });
  }
});

// =============================================
// RESET FAILED LOGIN ATTEMPTS
// =============================================
router.post('/users/:user_id/reset-login-attempts', async (req, res) => {
  try {
    const { user_id } = req.params;

    const tables = ['admin_users', 'developer_users', 'users'];

    for (const table of tables) {
      const [result] = await db.promise().query(
        `UPDATE ${table} SET failed_login_attempts = 0, account_locked_until = NULL, updated_at = NOW() WHERE id = ?`,
        [user_id]
      );

      if (result.affectedRows > 0) {
        // Create audit log
        await db.promise().query(`
          INSERT INTO audit_logs (user_id, action_type, entity_type, entity_id, description, created_at)
          VALUES (?, 'security_change', 'user', ?, 'Failed login attempts reset', NOW())
        `, [user_id, user_id]);

        return res.json({
          success: true,
          message: 'Failed login attempts reset successfully'
        });
      }
    }

    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  } catch (error) {
    console.error('Error resetting failed login attempts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset failed login attempts',
      error: error.message
    });
  }
});

// =============================================
// GET SECURITY COMPLIANCE REPORT
// =============================================
router.get('/compliance-report', async (req, res) => {
  try {
    const [complianceData] = await db.promise().query(`
      SELECT
        (SELECT COUNT(*) FROM admin_users WHERE is_active = TRUE AND deleted_at IS NULL) as total_admins,
        (SELECT COUNT(*) FROM admin_users WHERE two_factor_enabled = TRUE AND deleted_at IS NULL) as admins_with_2fa,
        (SELECT COUNT(*) FROM users WHERE is_active = TRUE AND deleted_at IS NULL AND email_verified = TRUE) as verified_users,
        (SELECT COUNT(*) FROM audit_logs WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as audit_logs_30_days,
        (SELECT COUNT(*) FROM users WHERE failed_login_attempts >= 3 AND deleted_at IS NULL) as users_with_failed_logins,
        (SELECT COUNT(*) FROM users WHERE account_locked_until IS NOT NULL AND deleted_at IS NULL) as locked_accounts
    `);

    const complianceScore = {
      two_factor_adoption: complianceData[0].total_admins > 0
        ? (complianceData[0].admins_with_2fa / complianceData[0].total_admins) * 100
        : 0,
      email_verification: complianceData[0].verified_users > 0
        ? (complianceData[0].verified_users / complianceData[0].total_admins) * 100
        : 0,
      audit_logging: complianceData[0].audit_logs_30_days > 0 ? 100 : 0,
      account_security: complianceData[0].locked_accounts === 0 ? 100 : 50
    };

    const overallScore = Object.values(complianceScore).reduce((a, b) => a + b, 0) / 4;

    res.json({
      success: true,
      complianceData: complianceData[0],
      complianceScore,
      overallScore: Math.round(overallScore)
    });
  } catch (error) {
    console.error('Error generating compliance report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate compliance report',
      error: error.message
    });
  }
});

module.exports = router;