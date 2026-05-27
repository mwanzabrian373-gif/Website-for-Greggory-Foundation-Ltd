// Reports Routes
// Handles report generation, templates, and export functionality

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// =============================================
// GET ALL REPORTS
// =============================================
router.get('/', async (req, res) => {
  try {
    const { type, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT
        fr.*,
        u.display_name as created_by_name
      FROM financial_reports fr
      LEFT JOIN users u ON fr.created_by = u.id
      WHERE fr.deleted_at IS NULL
    `;

    const params = [];

    if (type) {
      query += ' AND fr.report_type = ?';
      params.push(type);
    }

    query += ' ORDER BY fr.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [reports] = await db.promise().query(query, params);

    res.json({
      success: true,
      reports,
      count: reports.length
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: error.message
    });
  }
});

// =============================================
// GET REPORT BY ID
// =============================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [reports] = await db.promise().query(`
      SELECT
        fr.*,
        u.display_name as created_by_name
      FROM financial_reports fr
      LEFT JOIN users u ON fr.created_by = u.id
      WHERE fr.id = ? AND fr.deleted_at IS NULL
    `, [id]);

    if (reports.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      report: reports[0]
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report',
      error: error.message
    });
  }
});

// =============================================
// CREATE REPORT
// =============================================
router.post('/', async (req, res) => {
  try {
    const {
      report_name,
      report_type,
      description,
      parameters,
      created_by
    } = req.body;

    if (!report_name || !report_type) {
      return res.status(400).json({
        success: false,
        message: 'Report name and type are required'
      });
    }

    const [result] = await db.promise().query(`
      INSERT INTO financial_reports (
        report_name, report_type, description, parameters,
        created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      report_name, report_type, description,
      JSON.stringify(parameters), created_by
    ]);

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      reportId: result.insertId
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create report',
      error: error.message
    });
  }
});

// =============================================
// GENERATE PROJECT SUMMARY REPORT
// =============================================
router.get('/generate/project-summary', async (req, res) => {
  try {
    const { project_id, start_date, end_date } = req.query;

    let projectFilter = '';
    const params = [];

    if (project_id) {
      projectFilter = 'AND p.id = ?';
      params.push(project_id);
    }

    let dateFilter = '';
    if (start_date && end_date) {
      dateFilter = 'AND p.start_date >= ? AND p.end_date <= ?';
      params.push(start_date, end_date);
    }

    const [summary] = await db.promise().query(`
      SELECT
        p.id,
        p.project_name,
        p.status,
        p.progress_percentage,
        p.start_date,
        p.end_date,
        p.estimated_budget,
        COUNT(DISTINCT pt.id) as total_tasks,
        COUNT(DISTINCT CASE WHEN pt.status = 'completed' THEN pt.id END) as completed_tasks,
        COALESCE(SUM(pe.amount), 0) as total_expenses,
        COALESCE(SUM(pi.amount), 0) as total_invoices,
        COUNT(DISTINCT ptm.user_id) as team_size
      FROM projects p
      LEFT JOIN project_tasks pt ON p.id = pt.project_id AND pt.deleted_at IS NULL
      LEFT JOIN project_expenses pe ON p.id = pe.project_id AND pe.deleted_at IS NULL
      LEFT JOIN project_invoices pi ON p.id = pi.project_id AND pi.deleted_at IS NULL
      LEFT JOIN project_team_members ptm ON p.id = ptm.project_id AND ptm.deleted_at IS NULL
      WHERE p.deleted_at IS NULL ${projectFilter} ${dateFilter}
      GROUP BY p.id
    `, params);

    res.json({
      success: true,
      report_type: 'project-summary',
      data: summary,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating project summary report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate project summary report',
      error: error.message
    });
  }
});

// =============================================
// GENERATE FINANCIAL SUMMARY REPORT
// =============================================
router.get('/generate/financial-summary', async (req, res) => {
  try {
    const { start_date, end_date, category_id } = req.query;

    let dateFilter = '';
    const params = [];

    if (start_date && end_date) {
      dateFilter = 'AND entry_date >= ? AND entry_date <= ?';
      params.push(start_date, end_date);
    }

    let categoryFilter = '';
    if (category_id) {
      categoryFilter = 'AND category_id = ?';
      params.push(category_id);
    }

    const [summary] = await db.promise().query(`
      SELECT
        type,
        SUM(amount) as total,
        COUNT(*) as transaction_count,
        AVG(amount) as average_transaction
      FROM accounting_entries
      WHERE deleted_at IS NULL ${dateFilter} ${categoryFilter}
      GROUP BY type
    `, params);

    const [breakdown] = await db.promise().query(`
      SELECT
        ac.name as category,
        ae.type,
        SUM(ae.amount) as total,
        COUNT(*) as count
      FROM accounting_entries ae
      LEFT JOIN accounting_categories ac ON ae.category_id = ac.id
      WHERE ae.deleted_at IS NULL ${dateFilter} ${categoryFilter}
      GROUP BY ae.category_id, ae.type
      ORDER BY total DESC
    `, params);

    res.json({
      success: true,
      report_type: 'financial-summary',
      summary: summary,
      breakdown: breakdown,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating financial summary report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate financial summary report',
      error: error.message
    });
  }
});

// =============================================
// GENERATE USER ACTIVITY REPORT
// =============================================
router.get('/generate/user-activity', async (req, res) => {
  try {
    const { user_id, start_date, end_date, action_type } = req.query;

    let userFilter = '';
    const params = [];

    if (user_id) {
      userFilter = 'AND user_id = ?';
      params.push(user_id);
    }

    let dateFilter = '';
    if (start_date && end_date) {
      dateFilter = 'AND created_at >= ? AND created_at <= ?';
      params.push(start_date, end_date);
    }

    let actionFilter = '';
    if (action_type) {
      actionFilter = 'AND action_type = ?';
      params.push(action_type);
    }

    const [activity] = await db.promise().query(`
      SELECT
        aal.*,
        u.display_name as user_name
      FROM admin_activity_logs aal
      LEFT JOIN users u ON aal.user_id = u.id
      WHERE aal.deleted_at IS NULL ${userFilter} ${dateFilter} ${actionFilter}
      ORDER BY aal.created_at DESC
      LIMIT 1000
    `, params);

    // Activity summary
    const [summary] = await db.promise().query(`
      SELECT
        action_type,
        COUNT(*) as count,
        COUNT(DISTINCT user_id) as unique_users
      FROM admin_activity_logs
      WHERE deleted_at IS NULL ${userFilter} ${dateFilter} ${actionFilter}
      GROUP BY action_type
      ORDER BY count DESC
    `, params);

    res.json({
      success: true,
      report_type: 'user-activity',
      activity,
      summary,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating user activity report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate user activity report',
      error: error.message
    });
  }
});

// =============================================
// GENERATE TASK PRODUCTIVITY REPORT
// =============================================
router.get('/generate/task-productivity', async (req, res) => {
  try {
    const { project_id, start_date, end_date } = req.query;

    let projectFilter = '';
    const params = [];

    if (project_id) {
      projectFilter = 'AND pt.project_id = ?';
      params.push(project_id);
    }

    let dateFilter = '';
    if (start_date && end_date) {
      dateFilter = 'AND pt.created_at >= ? AND pt.created_at <= ?';
      params.push(start_date, end_date);
    }

    const [productivity] = await db.promise().query(`
      SELECT
        u.display_name as user_name,
        COUNT(pt.id) as total_tasks,
        COUNT(CASE WHEN pt.status = 'completed' THEN pt.id END) as completed_tasks,
        COUNT(CASE WHEN pt.status = 'in_progress' THEN pt.id END) as in_progress_tasks,
        COUNT(CASE WHEN pt.due_date < CURDATE() AND pt.status != 'completed' THEN pt.id END) as overdue_tasks,
        AVG(CASE WHEN pt.estimated_hours > 0 THEN pt.actual_hours / pt.estimated_hours ELSE NULL END) as efficiency_ratio
      FROM users u
      LEFT JOIN project_tasks pt ON u.id = pt.assigned_to AND pt.deleted_at IS NULL
      WHERE u.deleted_at IS NULL ${projectFilter} ${dateFilter}
      GROUP BY u.id
      HAVING total_tasks > 0
      ORDER BY completed_tasks DESC
    `, params);

    // Task completion trends
    const [trends] = await db.promise().query(`
      SELECT
        DATE_FORMAT(completed_at, '%Y-%m-%d') as date,
        COUNT(*) as completed_count
      FROM project_tasks
      WHERE completed_at IS NOT NULL ${projectFilter}
        AND deleted_at IS NULL
      GROUP BY DATE_FORMAT(completed_at, '%Y-%m-%d')
      ORDER BY date ASC
      LIMIT 30
    `, params);

    res.json({
      success: true,
      report_type: 'task-productivity',
      productivity,
      trends,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating task productivity report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate task productivity report',
      error: error.message
    });
  }
});

// =============================================
// DELETE REPORT
// =============================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.promise().query(
      'UPDATE financial_reports SET deleted_at = NOW() WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete report',
      error: error.message
    });
  }
});

module.exports = router;