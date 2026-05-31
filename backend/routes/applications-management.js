// Applications Management Routes
// Comprehensive applications management with all CRUD operations and enhanced features

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// =============================================
// GET APPLICATION STATISTICS
// =============================================
router.get('/stats', async (req, res) => {
  try {
    // Get comprehensive application statistics
    let totalApplications = 0, pendingApplications = 0, approvedApplications = 0;
    let rejectedApplications = 0, inProgressApplications = 0, completedApplications = 0;
    let applicationsThisMonth = 0, applicationsThisQuarter = 0;
    let avgProcessingTime = 0, acceptanceRate = 0;
    
    try {
      const [stats] = await db.promise().query(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
          SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
          COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN 1 END) as this_month,
          COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 3 MONTH) THEN 1 END) as this_quarter,
          AVG(DATEDIFF(updated_at, created_at)) as avg_processing_days
        FROM change_requests WHERE deleted_at IS NULL`
      );
      
      totalApplications = stats[0]?.total || 0;
      pendingApplications = stats[0]?.pending || 0;
      approvedApplications = stats[0]?.approved || 0;
      rejectedApplications = stats[0]?.rejected || 0;
      inProgressApplications = stats[0]?.in_progress || 0;
      completedApplications = stats[0]?.completed || 0;
      applicationsThisMonth = stats[0]?.this_month || 0;
      applicationsThisQuarter = stats[0]?.this_quarter || 0;
      avgProcessingTime = stats[0]?.avg_processing_days || 0;
      acceptanceRate = totalApplications > 0 ? ((approvedApplications / totalApplications) * 100).toFixed(1) : 0;
    } catch (err) {
      console.log('[APPLICATIONS STATS] Query failed, using defaults:', err.message);
    }
    
    res.json({
      success: true,
      stats: {
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        inProgressApplications,
        completedApplications,
        applicationsThisMonth,
        applicationsThisQuarter,
        avgProcessingTime: avgProcessingTime.toFixed(1),
        acceptanceRate
      }
    });
  } catch (error) {
    console.error('[APPLICATIONS STATS] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to fetch application statistics',
      stats: {
        totalApplications: 0,
        pendingApplications: 0,
        approvedApplications: 0,
        rejectedApplications: 0,
        inProgressApplications: 0,
        completedApplications: 0,
        applicationsThisMonth: 0,
        applicationsThisQuarter: 0,
        avgProcessingTime: 0,
        acceptanceRate: 0
      }
    });
  }
});

// =============================================
// GET ALL APPLICATIONS WITH FILTERS
// =============================================
router.get('/', async (req, res) => {
  try {
    const { status, type, priority, search, page = 1, limit = 10, sort = 'created_at', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT cr.*, 
        u.first_name, u.last_name, u.email, u.display_name,
        p.name as project_name,
        c.name as client_name,
        (SELECT COUNT(*) FROM application_activities WHERE application_id = cr.id AND deleted_at IS NULL) as activity_count
      FROM change_requests cr
      LEFT JOIN users u ON cr.user_id = u.id
      LEFT JOIN projects p ON cr.project_id = p.id
      LEFT JOIN clients c ON p.client_id = c.id
      WHERE cr.deleted_at IS NULL
    `;
    
    const params = [];
    
    // Add filters
    if (status) {
      query += ` AND cr.status = ?`;
      params.push(status);
    }
    
    if (type) {
      query += ` AND cr.request_type = ?`;
      params.push(type);
    }
    
    if (priority) {
      query += ` AND cr.priority = ?`;
      params.push(priority);
    }
    
    if (search) {
      query += ` AND (cr.title LIKE ? OR cr.description LIKE ? OR u.display_name LIKE ?)`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }
    
    // Add sorting
    const allowedSorts = ['created_at', 'title', 'status', 'priority', 'updated_at'];
    const sortField = allowedSorts.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    query += ` ORDER BY cr.${sortField} ${sortOrder}`;
    
    // Add pagination
    query += ` LIMIT ${parseInt(limit)} OFFSET ${offset}`;
    
    const [applications] = await db.promise().query(query, params);
    
    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM change_requests cr LEFT JOIN users u ON cr.user_id = u.id LEFT JOIN projects p ON cr.project_id = p.id LEFT JOIN clients c ON p.client_id = c.id WHERE cr.deleted_at IS NULL`;
    const countParams = [];
    
    if (status) {
      countQuery += ` AND cr.status = ?`;
      countParams.push(status);
    }
    
    if (type) {
      countQuery += ` AND cr.request_type = ?`;
      countParams.push(type);
    }
    
    if (priority) {
      countQuery += ` AND cr.priority = ?`;
      countParams.push(priority);
    }
    
    if (search) {
      countQuery += ` AND (cr.title LIKE ? OR cr.description LIKE ? OR u.display_name LIKE ?)`;
      const searchPattern = `%${search}%`;
      countParams.push(searchPattern, searchPattern, searchPattern);
    }
    
    const [count] = await db.promise().query(countQuery, countParams);
    const total = count[0]?.total || 0;
    
    res.json({
      success: true,
      applications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('[APPLICATIONS GET] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to fetch applications',
      applications: [],
      pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
    });
  }
});

// =============================================
// GET SINGLE APPLICATION BY ID
// =============================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [applications] = await db.promise().query(
      `SELECT cr.*, 
        u.first_name, u.last_name, u.email, u.display_name, u.phone_number,
        p.name as project_name,
        c.name as client_name,
        c.email as client_email,
        (SELECT COUNT(*) FROM application_activities WHERE application_id = cr.id AND deleted_at IS NULL) as activity_count
      FROM change_requests cr
      LEFT JOIN users u ON cr.user_id = u.id
      LEFT JOIN projects p ON cr.project_id = p.id
      LEFT JOIN clients c ON p.client_id = c.id
      WHERE cr.id = ? AND cr.deleted_at IS NULL`,
      [id]
    );
    
    if (applications.length === 0) {
      return res.json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Get application activities
    const [activities] = await db.promise().query(
      `SELECT aa.*, 
        u.first_name, u.last_name, u.display_name
      FROM application_activities aa
      LEFT JOIN users u ON aa.user_id = u.id
      WHERE aa.application_id = ? AND aa.deleted_at IS NULL
      ORDER BY aa.created_at DESC LIMIT 20`,
      [id]
    );
    
    // Get application documents
    const [documents] = await db.promise().query(
      `SELECT * FROM client_documents WHERE change_request_id = ? AND deleted_at IS NULL`,
      [id]
    );
    
    res.json({
      success: true,
      application: applications[0],
      activities,
      documents
    });
  } catch (error) {
    console.error('[APPLICATIONS GET ID] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to fetch application details',
      application: null
    });
  }
});

// =============================================
// CREATE NEW APPLICATION
// =============================================
router.post('/', async (req, res) => {
  try {
    const {
      user_id, project_id, title, description, request_type,
      priority = 'medium', status = 'pending', due_date, notes
    } = req.body;
    
    if (!title) {
      return res.json({
        success: false,
        message: 'Application title is required'
      });
    }
    
    const [result] = await db.promise().query(
      `INSERT INTO change_requests (user_id, project_id, title, description, request_type, priority, status, due_date, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [user_id, project_id, title, description, request_type, priority, status, due_date, notes]
    );
    
    res.json({
      success: true,
      message: 'Application created successfully',
      applicationId: result.insertId
    });
  } catch (error) {
    console.error('[APPLICATIONS POST] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to create application'
    });
  }
});

// =============================================
// UPDATE APPLICATION
// =============================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, request_type, priority, status, due_date, notes, assigned_to, completion_date
    } = req.body;
    
    const [result] = await db.promise().query(
      `UPDATE change_requests SET 
        title = ?, description = ?, request_type = ?, priority = ?,
        status = ?, due_date = ?, notes = ?, assigned_to = ?, completion_date = ?, updated_at = NOW()
      WHERE id = ? AND deleted_at IS NULL`,
      [title, description, request_type, priority, status, due_date, notes, assigned_to, completion_date, id]
    );
    
    if (result.affectedRows === 0) {
      return res.json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Application updated successfully'
    });
  } catch (error) {
    console.error('[APPLICATIONS PUT] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to update application'
    });
  }
});

// =============================================
// DELETE APPLICATION (SOFT DELETE)
// =============================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.promise().query(
      `UPDATE change_requests SET deleted_at = NOW() WHERE id = ?`,
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('[APPLICATIONS DELETE] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to delete application'
    });
  }
});

// =============================================
// BULK ACTIONS
// =============================================
router.post('/bulk', async (req, res) => {
  try {
    const { action, applicationIds } = req.body;
    
    if (!action || !applicationIds || !Array.isArray(applicationIds)) {
      return res.json({
        success: false,
        message: 'Invalid bulk action request'
      });
    }
    
    let query = '';
    let params = [];
    
    switch (action) {
      case 'delete':
        query = `UPDATE change_requests SET deleted_at = NOW() WHERE id IN (${applicationIds.map(() => '?').join(',')})`;
        params = applicationIds;
        break;
      
      case 'approve':
        query = `UPDATE change_requests SET status = 'approved', updated_at = NOW() WHERE id IN (${applicationIds.map(() => '?').join(',')})`;
        params = applicationIds;
        break;
      
      case 'reject':
        query = `UPDATE change_requests SET status = 'rejected', updated_at = NOW() WHERE id IN (${applicationIds.map(() => '?').join(',')})`;
        params = applicationIds;
        break;
      
      case 'assign':
        const { assigned_to } = req.body;
        query = `UPDATE change_requests SET assigned_to = ?, status = 'in_progress', updated_at = NOW() WHERE id IN (${applicationIds.map(() => '?').join(',')})`;
        params = [assigned_to, ...applicationIds];
        break;
      
      default:
        return res.json({
          success: false,
          message: 'Invalid action'
        });
    }
    
    const [result] = await db.promise().query(query, params);
    
    res.json({
      success: true,
      message: `Bulk ${action} completed successfully`,
      affectedRows: result.affectedRows
    });
  } catch (error) {
    console.error('[APPLICATIONS BULK] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to perform bulk action'
    });
  }
});

// =============================================
// APPLICATION ACTIVITIES
// =============================================
router.get('/:id/activities', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [activities] = await db.promise().query(
      `SELECT aa.*, 
        u.first_name, u.last_name, u.display_name
      FROM application_activities aa
      LEFT JOIN users u ON aa.user_id = u.id
      WHERE aa.application_id = ? AND aa.deleted_at IS NULL
      ORDER BY aa.created_at DESC LIMIT 50`,
      [id]
    );
    
    res.json({
      success: true,
      activities
    });
  } catch (error) {
    console.error('[APPLICATIONS ACTIVITIES] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to fetch activities',
      activities: []
    });
  }
});

router.post('/:id/activities', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, action, description } = req.body;
    
    const [result] = await db.promise().query(
      `INSERT INTO application_activities (application_id, user_id, action, description, created_at)
      VALUES (?, ?, ?, ?, NOW())`,
      [id, user_id, action, description]
    );
    
    res.json({
      success: true,
      message: 'Activity logged successfully',
      activityId: result.insertId
    });
  } catch (error) {
    console.error('[APPLICATIONS ACTIVITIES POST] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to log activity'
    });
  }
});

module.exports = router;