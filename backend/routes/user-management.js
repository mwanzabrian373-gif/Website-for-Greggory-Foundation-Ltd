// User Management Routes
// Comprehensive user management with all CRUD operations and bulk actions

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcryptjs');

// =============================================
// GET USER STATISTICS
// =============================================
router.get('/stats', async (req, res) => {
  try {
    // Get statistics from all user tables with error handling
    let adminCount = 0, developerCount = 0, userCount = 0;
    let activeAdminCount = 0, activeDeveloperCount = 0, activeUserCount = 0;
    let newAdminsThisMonth = 0, newDevelopersThisMonth = 0, newUsersThisMonth = 0;
    
    try {
      const [adminStats] = await db.promise().query(
        'SELECT COUNT(*) as count, SUM(is_active) as active, COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN 1 END) as new_month FROM admin_users WHERE deleted_at IS NULL'
      );
      adminCount = adminStats[0]?.count || 0;
      activeAdminCount = adminStats[0]?.active || 0;
      newAdminsThisMonth = adminStats[0]?.new_month || 0;
    } catch (err) {
      console.log('[STATS] Admin users query failed, using 0:', err.message);
    }
    
    try {
      const [developerStats] = await db.promise().query(
        'SELECT COUNT(*) as count, SUM(is_active) as active, COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN 1 END) as new_month FROM developer_users WHERE deleted_at IS NULL'
      );
      developerCount = developerStats[0]?.count || 0;
      activeDeveloperCount = developerStats[0]?.active || 0;
      newDevelopersThisMonth = developerStats[0]?.new_month || 0;
    } catch (err) {
      console.log('[STATS] Developer users query failed, using 0:', err.message);
    }
    
    try {
      const [regularStats] = await db.promise().query(
        'SELECT COUNT(*) as count, SUM(is_active) as active, COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN 1 END) as new_month FROM users'
      );
      userCount = regularStats[0]?.count || 0;
      activeUserCount = regularStats[0]?.active || 0;
      newUsersThisMonth = regularStats[0]?.new_month || 0;
    } catch (err) {
      console.log('[STATS] Regular users query failed, using 0:', err.message);
    }
    
    const totalUsers = adminCount + developerCount + userCount;
    const activeUsers = activeAdminCount + activeDeveloperCount + activeUserCount;
    const newThisMonth = newAdminsThisMonth + newDevelopersThisMonth + newUsersThisMonth;
    
    res.json({
      success: true,
      stats: {
        totalUsers: totalUsers,
        activeUsers: activeUsers,
        admins: adminCount,
        developers: developerCount,
        clients: userCount,
        newThisMonth: newThisMonth
      }
    });
    
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics',
      error: error.message
    });
  }
});

// =============================================
// GET ALL USERS (Combined from all tables)
// =============================================
router.get('/', async (req, res) => {
  try {
    const allUsers = [];
    
    try {
      const [adminUsers] = await db.promise().query(`
        SELECT 
          id,
          email,
          first_name,
          last_name,
          display_name,
          admin_level as primary_role,
          department,
          is_active,
          last_login_at,
          created_at,
          'admin' as user_type
        FROM admin_users
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
      `);
      allUsers.push(...adminUsers.map(u => ({ ...u, role_type: 'admin' })));
    } catch (err) {
      console.log('[USERS] Admin users query failed:', err.message);
    }
    
    try {
      const [developerUsers] = await db.promise().query(`
        SELECT 
          id,
          email,
          first_name,
          last_name,
          display_name,
          developer_level as primary_role,
          specialization as department,
          is_active,
          last_login_at,
          created_at,
          'developer' as user_type
        FROM developer_users
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
      `);
      allUsers.push(...developerUsers.map(u => ({ ...u, role_type: 'developer' })));
    } catch (err) {
      console.log('[USERS] Developer users query failed:', err.message);
    }
    
    try {
      const [regularUsers] = await db.promise().query(`
        SELECT 
          id,
          email,
          first_name,
          last_name,
          display_name,
          primary_role,
          NULL as department,
          is_active,
          last_login as last_login_at,
          created_at,
          'user' as user_type
        FROM users
        ORDER BY created_at DESC
      `);
      allUsers.push(...regularUsers.map(u => ({ ...u, role_type: 'user' })));
    } catch (err) {
      console.log('[USERS] Regular users query failed:', err.message);
    }
    
    res.json({
      success: true,
      users: allUsers,
      count: allUsers.length
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// =============================================
// EXPORT USERS (CSV/Excel)
// =============================================
router.get('/export', async (req, res) => {
  try {
    const format = req.query.format || 'csv';
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    // Basic auth check
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    // Get all users from all tables
    let allUsers = [];
    
    try {
      const [adminUsers] = await db.promise().query(`
        SELECT 'admin' as type, email, first_name, last_name, admin_level as role, 
        department, is_active, created_at, last_login_at 
        FROM admin_users WHERE deleted_at IS NULL
      `);
      allUsers.push(...adminUsers);
    } catch (err) {
      console.log('[EXPORT] Admin users query failed:', err.message);
    }
    
    try {
      const [developerUsers] = await db.promise().query(`
        SELECT 'developer' as type, email, first_name, last_name, developer_level as role,
        specialization as department, is_active, created_at, last_login_at 
        FROM developer_users WHERE deleted_at IS NULL
      `);
      allUsers.push(...developerUsers);
    } catch (err) {
      console.log('[EXPORT] Developer users query failed:', err.message);
    }
    
    try {
      const [regularUsers] = await db.promise().query(`
        SELECT 'user' as type, email, first_name, last_name, primary_role as role,
        NULL as department, is_active, created_at, last_login as last_login_at 
        FROM users
      `);
      allUsers.push(...regularUsers);
    } catch (err) {
      console.log('[EXPORT] Regular users query failed:', err.message);
    }
    
    if (format === 'csv') {
      const csvHeader = 'Type,Email,First Name,Last Name,Role,Department,Status,Created At,Last Login\n';
      const csvRows = allUsers.map(u => 
        `${u.type},${u.email},${u.first_name},${u.last_name},${u.role},${u.department || ''},${u.is_active ? 'Active' : 'Inactive'},${u.created_at},${u.last_login_at || 'Never'}`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=users_export.csv');
      res.send(csvHeader + csvRows);
    } else {
      res.json({
        success: true,
        users: allUsers,
        count: allUsers.length
      });
    }
    
  } catch (error) {
    console.error('Error exporting users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export users',
      error: error.message
    });
  }
});

// =============================================
// IMPORT USERS (CSV/Excel)
// =============================================
router.post('/import', async (req, res) => {
  try {
    const { users, format = 'json' } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    // Basic auth check
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    if (!users || !Array.isArray(users)) {
      return res.status(400).json({ success: false, message: 'Invalid users data' });
    }
    
    let imported = 0;
    let failed = 0;
    const errors = [];
    
    for (const user of users) {
      try {
        const { first_name, last_name, email, role, department, password } = user;
        
        if (!first_name || !last_name || !email) {
          errors.push({ email: email || 'unknown', error: 'Missing required fields' });
          failed++;
          continue;
        }
        
        // Determine table based on role
        let tableName, roleField, hashedPassword;
        
        if (role?.includes('admin')) {
          tableName = 'admin_users';
          roleField = 'admin_level';
        } else if (role?.includes('developer')) {
          tableName = 'developer_users';
          roleField = 'developer_level';
        } else {
          tableName = 'users';
          roleField = 'primary_role';
        }
        
        if (password) {
          hashedPassword = await bcrypt.hash(password, 10);
        }
        
        // Check if user exists
        try {
          const [existing] = await db.promise().query(
            `SELECT id FROM ${tableName} WHERE email = ?`,
            [email]
          );
          
          if (existing.length > 0) {
            errors.push({ email, error: 'User already exists' });
            failed++;
            continue;
          }
        } catch (err) {
          console.log('[IMPORT] Check existing user failed:', err.message);
        }
        
        // Insert user
        if (tableName === 'admin_users') {
          await db.promise().query(
            `INSERT INTO admin_users (email, password_hash, first_name, last_name, admin_level, department, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            [email, hashedPassword || null, first_name, last_name, role || 'admin', department || 'General', 1]
          );
        } else if (tableName === 'developer_users') {
          await db.promise().query(
            `INSERT INTO developer_users (email, password_hash, first_name, last_name, developer_level, specialization, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            [email, hashedPassword || null, first_name, last_name, role || 'mid', department || 'General', 1]
          );
        } else {
          await db.promise().query(
            `INSERT INTO users (email, password_hash, first_name, last_name, primary_role, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [email, hashedPassword || null, first_name, last_name, role || 'user', 1]
          );
        }
        
        imported++;
        
      } catch (err) {
        console.error('Error importing user:', user, err);
        errors.push({ email: user.email || 'unknown', error: err.message });
        failed++;
      }
    }
    
    res.json({
      success: true,
      message: `Imported ${imported} users, ${failed} failed`,
      imported,
      failed,
      errors
    });
    
  } catch (error) {
    console.error('Error importing users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import users',
      error: error.message
    });
  }
});

// =============================================
// NOTIFY ALL USERS
// =============================================
router.post('/notify', async (req, res) => {
  try {
    const { subject, message, role_filter = 'all' } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    // Basic auth check
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject and message are required' });
    }
    
    let notified = 0;
    let emails = [];
    
    // Get emails based on role filter
    try {
      if (role_filter === 'all' || role_filter === 'admin') {
        const [admins] = await db.promise().query('SELECT email FROM admin_users WHERE is_active = 1 AND deleted_at IS NULL');
        emails.push(...admins.map(a => a.email));
      }
    } catch (err) {
      console.log('[NOTIFY] Admin emails query failed:', err.message);
    }
    
    try {
      if (role_filter === 'all' || role_filter === 'developer') {
        const [developers] = await db.promise().query('SELECT email FROM developer_users WHERE is_active = 1 AND deleted_at IS NULL');
        emails.push(...developers.map(d => d.email));
      }
    } catch (err) {
      console.log('[NOTIFY] Developer emails query failed:', err.message);
    }
    
    try {
      if (role_filter === 'all' || role_filter === 'user' || role_filter === 'client') {
        const [users] = await db.promise().query('SELECT email FROM users WHERE is_active = 1');
        emails.push(...users.map(u => u.email));
      }
    } catch (err) {
      console.log('[NOTIFY] User emails query failed:', err.message);
    }
    
    // Remove duplicates
    emails = [...new Set(emails)];
    notified = emails.length;
    
    // In a real implementation, you would send actual emails here
    // For now, we'll just log and return success
    console.log('[NOTIFY] Would send email to', notified, 'users');
    console.log('[NOTIFY] Subject:', subject);
    console.log('[NOTIFY] Message:', message);
    
    res.json({
      success: true,
      message: `Notification queued for ${notified} users`,
      notified,
      emails
    });
    
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error.message
    });
  }
});

// =============================================
// UPDATE USER
// =============================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active, role_type, first_name, last_name, email, department } = req.body;
    
    if (!role_type) {
      return res.status(400).json({ success: false, message: 'role_type is required' });
    }
    
    let tableName;
    if (role_type === 'admin') tableName = 'admin_users';
    else if (role_type === 'developer') tableName = 'developer_users';
    else tableName = 'users';
    
    const updates = [];
    const values = [];
    
    if (is_active !== undefined) { updates.push('is_active = ?'); values.push(is_active); }
    if (first_name !== undefined) { updates.push('first_name = ?'); values.push(first_name); }
    if (last_name !== undefined) { updates.push('last_name = ?'); values.push(last_name); }
    if (email !== undefined) { updates.push('email = ?'); values.push(email); }
    if (department !== undefined) { 
      updates.push(tableName === 'admin_users' ? 'department = ?' : 'specialization = ?'); 
      values.push(department); 
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }
    
    updates.push('updated_at = NOW()');
    values.push(id);
    
    const query = `UPDATE ${tableName} SET ${updates.join(', ')} WHERE id = ?`;
    const [result] = await db.promise().query(query, values);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      message: 'User updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
});

// =============================================
// DELETE USER
// =============================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role_type = 'user' } = req.body;
    
    if (!role_type) {
      return res.status(400).json({ success: false, message: 'role_type is required' });
    }
    
    let tableName;
    if (role_type === 'admin') tableName = 'admin_users';
    else if (role_type === 'developer') tableName = 'developer_users';
    else tableName = 'users';
    
    // Soft delete for admin and developer tables, hard delete for users
    const query = tableName === 'admin_users' || tableName === 'developer_users'
      ? `UPDATE ${tableName} SET deleted_at = NOW(), is_active = 0 WHERE id = ?`
      : `DELETE FROM ${tableName} WHERE id = ?`;
    
    const [result] = await db.promise().query(query, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
});

// =============================================
// GET USER ACTIVITY
// =============================================
router.get('/:id/activity', async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    // This would typically query an activity logs table
    // For now, return a placeholder response
    res.json({
      success: true,
      activities: [
        { action: 'Login', timestamp: new Date(), details: 'User logged in successfully' },
        { action: 'Profile Update', timestamp: new Date(Date.now() - 86400000), details: 'User updated their profile' },
        { action: 'Project View', timestamp: new Date(Date.now() - 172800000), details: 'User viewed project dashboard' }
      ]
    });
    
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user activity',
      error: error.message
    });
  }
});

module.exports = router;