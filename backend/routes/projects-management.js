// Projects Management Routes
// Comprehensive projects management with all CRUD operations and enhanced features

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// =============================================
// GET PROJECT STATISTICS
// =============================================
router.get('/stats', async (req, res) => {
  try {
    // Get comprehensive project statistics
    let totalProjects = 0, activeProjects = 0, completedProjects = 0;
    let pendingProjects = 0, inProgressProjects = 0, onHoldProjects = 0;
    let totalBudget = 0, spentBudget = 0, revenueGenerated = 0;
    let projectsThisMonth = 0, projectsThisQuarter = 0;
    
    try {
      const [stats] = await db.promise().query(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
          SUM(CASE WHEN status = 'on_hold' THEN 1 ELSE 0 END) as on_hold,
          SUM(COALESCE(budget, 0)) as total_budget,
          SUM(COALESCE(spent_amount, 0)) as spent_budget,
          SUM(COALESCE(revenue, 0)) as revenue_generated,
          COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN 1 END) as this_month,
          COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 3 MONTH) THEN 1 END) as this_quarter
        FROM projects WHERE deleted_at IS NULL`
      );
      
      totalProjects = stats[0]?.total || 0;
      activeProjects = stats[0]?.active || 0;
      completedProjects = stats[0]?.completed || 0;
      pendingProjects = stats[0]?.pending || 0;
      inProgressProjects = stats[0]?.in_progress || 0;
      onHoldProjects = stats[0]?.on_hold || 0;
      totalBudget = stats[0]?.total_budget || 0;
      spentBudget = stats[0]?.spent_budget || 0;
      revenueGenerated = stats[0]?.revenue_generated || 0;
      projectsThisMonth = stats[0]?.this_month || 0;
      projectsThisQuarter = stats[0]?.this_quarter || 0;
    } catch (err) {
      console.log('[PROJECTS STATS] Query failed, using defaults:', err.message);
    }
    
    res.json({
      success: true,
      stats: {
        totalProjects,
        activeProjects,
        completedProjects,
        pendingProjects,
        inProgressProjects,
        onHoldProjects,
        totalBudget,
        spentBudget,
        revenueGenerated,
        projectsThisMonth,
        projectsThisQuarter,
        budgetUtilization: totalBudget > 0 ? ((spentBudget / totalBudget) * 100).toFixed(1) : 0,
        completionRate: totalProjects > 0 ? ((completedProjects / totalProjects) * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    console.error('[PROJECTS STATS] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to fetch project statistics',
      stats: {
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        pendingProjects: 0,
        inProgressProjects: 0,
        onHoldProjects: 0,
        totalBudget: 0,
        spentBudget: 0,
        revenueGenerated: 0,
        projectsThisMonth: 0,
        projectsThisQuarter: 0,
        budgetUtilization: 0,
        completionRate: 0
      }
    });
  }
});

// =============================================
// GET ALL PROJECTS WITH FILTERS
// =============================================
router.get('/', async (req, res) => {
  try {
    const { status, client, priority, search, page = 1, limit = 10, sort = 'created_at', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT p.*, 
        c.name as client_name,
        (SELECT COUNT(*) FROM project_tasks WHERE project_id = p.id AND deleted_at IS NULL) as task_count,
        (SELECT COUNT(*) FROM project_team_members WHERE project_id = p.id AND deleted_at IS NULL) as team_count,
        (SELECT COUNT(*) FROM project_activities WHERE project_id = p.id AND deleted_at IS NULL) as activity_count
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      WHERE p.deleted_at IS NULL
    `;
    
    const params = [];
    
    // Add filters
    if (status) {
      query += ` AND p.status = ?`;
      params.push(status);
    }
    
    if (client) {
      query += ` AND p.client_id = ?`;
      params.push(client);
    }
    
    if (priority) {
      query += ` AND p.priority = ?`;
      params.push(priority);
    }
    
    if (search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }
    
    // Add sorting
    const allowedSorts = ['created_at', 'name', 'status', 'priority', 'budget', 'start_date', 'end_date'];
    const sortField = allowedSorts.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    query += ` ORDER BY p.${sortField} ${sortOrder}`;
    
    // Add pagination
    query += ` LIMIT ${parseInt(limit)} OFFSET ${offset}`;
    
    const [projects] = await db.promise().query(query, params);
    
    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM projects p LEFT JOIN clients c ON p.client_id = c.id WHERE p.deleted_at IS NULL`;
    const countParams = [];
    
    if (status) {
      countQuery += ` AND p.status = ?`;
      countParams.push(status);
    }
    
    if (client) {
      countQuery += ` AND p.client_id = ?`;
      countParams.push(client);
    }
    
    if (priority) {
      countQuery += ` AND p.priority = ?`;
      countParams.push(priority);
    }
    
    if (search) {
      countQuery += ` AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)`;
      const searchPattern = `%${search}%`;
      countParams.push(searchPattern, searchPattern, searchPattern);
    }
    
    const [count] = await db.promise().query(countQuery, countParams);
    const total = count[0]?.total || 0;
    
    res.json({
      success: true,
      projects,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('[PROJECTS GET] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to fetch projects',
      projects: [],
      pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
    });
  }
});

// =============================================
// GET SINGLE PROJECT BY ID
// =============================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [projects] = await db.promise().query(
      `SELECT p.*, 
        c.name as client_name,
        c.email as client_email,
        c.phone as client_phone,
        (SELECT COUNT(*) FROM project_tasks WHERE project_id = p.id AND deleted_at IS NULL) as task_count,
        (SELECT COUNT(*) FROM project_team_members WHERE project_id = p.id AND deleted_at IS NULL) as team_count,
        (SELECT COUNT(*) FROM project_activities WHERE project_id = p.id AND deleted_at IS NULL) as activity_count
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      WHERE p.id = ? AND p.deleted_at IS NULL`,
      [id]
    );
    
    if (projects.length === 0) {
      return res.json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Get project team members
    const [teamMembers] = await db.promise().query(
      `SELECT tm.*, 
        u.first_name, u.last_name, u.email, u.display_name,
        a.first_name as admin_first_name, a.last_name as admin_last_name, a.email as admin_email,
        d.first_name as dev_first_name, d.last_name as dev_last_name, d.email as dev_email
      FROM project_team_members tm
      LEFT JOIN users u ON tm.user_id = u.id
      LEFT JOIN admin_users a ON tm.admin_id = a.id
      LEFT JOIN developer_users d ON tm.developer_id = d.id
      WHERE tm.project_id = ? AND tm.deleted_at IS NULL`,
      [id]
    );
    
    // Get project milestones
    const [milestones] = await db.promise().query(
      `SELECT * FROM project_milestones WHERE project_id = ? AND deleted_at IS NULL ORDER BY due_date ASC`,
      [id]
    );
    
    // Get recent activities
    const [activities] = await db.promise().query(
      `SELECT * FROM project_activities WHERE project_id = ? AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 10`,
      [id]
    );
    
    res.json({
      success: true,
      project: projects[0],
      teamMembers,
      milestones,
      activities
    });
  } catch (error) {
    console.error('[PROJECTS GET ID] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to fetch project details',
      project: null
    });
  }
});

// =============================================
// CREATE NEW PROJECT
// =============================================
router.post('/', async (req, res) => {
  try {
    const {
      name, description, client_id, status = 'pending', priority = 'medium',
      budget, start_date, end_date, project_manager_id, notes
    } = req.body;
    
    if (!name) {
      return res.json({
        success: false,
        message: 'Project name is required'
      });
    }
    
    const [result] = await db.promise().query(
      `INSERT INTO projects (name, description, client_id, status, priority, budget, start_date, end_date, project_manager_id, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, description, client_id, status, priority, budget, start_date, end_date, project_manager_id, notes]
    );
    
    res.json({
      success: true,
      message: 'Project created successfully',
      projectId: result.insertId
    });
  } catch (error) {
    console.error('[PROJECTS POST] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to create project'
    });
  }
});

// =============================================
// UPDATE PROJECT
// =============================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, description, client_id, status, priority,
      budget, start_date, end_date, project_manager_id, notes, spent_amount, revenue
    } = req.body;
    
    const [result] = await db.promise().query(
      `UPDATE projects SET 
        name = ?, description = ?, client_id = ?, status = ?, priority = ?,
        budget = ?, start_date = ?, end_date = ?, project_manager_id = ?, notes = ?,
        spent_amount = ?, revenue = ?, updated_at = NOW()
      WHERE id = ? AND deleted_at IS NULL`,
      [name, description, client_id, status, priority, budget, start_date, end_date, project_manager_id, notes, spent_amount, revenue, id]
    );
    
    if (result.affectedRows === 0) {
      return res.json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('[PROJECTS PUT] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to update project'
    });
  }
});

// =============================================
// DELETE PROJECT (SOFT DELETE)
// =============================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.promise().query(
      `UPDATE projects SET deleted_at = NOW() WHERE id = ?`,
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('[PROJECTS DELETE] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to delete project'
    });
  }
});

// =============================================
// BULK ACTIONS
// =============================================
router.post('/bulk', async (req, res) => {
  try {
    const { action, projectIds } = req.body;
    
    if (!action || !projectIds || !Array.isArray(projectIds)) {
      return res.json({
        success: false,
        message: 'Invalid bulk action request'
      });
    }
    
    let query = '';
    let params = [];
    
    switch (action) {
      case 'delete':
        query = `UPDATE projects SET deleted_at = NOW() WHERE id IN (${projectIds.map(() => '?').join(',')})`;
        params = projectIds;
        break;
      
      case 'activate':
        query = `UPDATE projects SET status = 'active', updated_at = NOW() WHERE id IN (${projectIds.map(() => '?').join(',')})`;
        params = projectIds;
        break;
      
      case 'complete':
        query = `UPDATE projects SET status = 'completed', updated_at = NOW() WHERE id IN (${projectIds.map(() => '?').join(',')})`;
        params = projectIds;
        break;
      
      case 'on_hold':
        query = `UPDATE projects SET status = 'on_hold', updated_at = NOW() WHERE id IN (${projectIds.map(() => '?').join(',')})`;
        params = projectIds;
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
    console.error('[PROJECTS BULK] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to perform bulk action'
    });
  }
});

// =============================================
// PROJECT TEAM MEMBERS
// =============================================
router.get('/:id/team', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [teamMembers] = await db.promise().query(
      `SELECT tm.*, 
        u.first_name, u.last_name, u.email, u.display_name,
        a.first_name as admin_first_name, a.last_name as admin_last_name, a.email as admin_email,
        d.first_name as dev_first_name, d.last_name as dev_last_name, d.email as dev_email
      FROM project_team_members tm
      LEFT JOIN users u ON tm.user_id = u.id
      LEFT JOIN admin_users a ON tm.admin_id = a.id
      LEFT JOIN developer_users d ON tm.developer_id = d.id
      WHERE tm.project_id = ? AND tm.deleted_at IS NULL`,
      [id]
    );
    
    res.json({
      success: true,
      teamMembers
    });
  } catch (error) {
    console.error('[PROJECTS TEAM] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to fetch team members',
      teamMembers: []
    });
  }
});

router.post('/:id/team', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, admin_id, developer_id, role } = req.body;
    
    const [result] = await db.promise().query(
      `INSERT INTO project_team_members (project_id, user_id, admin_id, developer_id, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [id, user_id, admin_id, developer_id, role]
    );
    
    res.json({
      success: true,
      message: 'Team member added successfully',
      teamMemberId: result.insertId
    });
  } catch (error) {
    console.error('[PROJECTS TEAM POST] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to add team member'
    });
  }
});

// =============================================
// PROJECT ACTIVITIES
// =============================================
router.get('/:id/activities', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [activities] = await db.promise().query(
      `SELECT * FROM project_activities WHERE project_id = ? AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 50`,
      [id]
    );
    
    res.json({
      success: true,
      activities
    });
  } catch (error) {
    console.error('[PROJECTS ACTIVITIES] Error:', error.message);
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
      `INSERT INTO project_activities (project_id, user_id, action, description, created_at)
      VALUES (?, ?, ?, ?, NOW())`,
      [id, user_id, action, description]
    );
    
    res.json({
      success: true,
      message: 'Activity logged successfully',
      activityId: result.insertId
    });
  } catch (error) {
    console.error('[PROJECTS ACTIVITIES POST] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to log activity'
    });
  }
});

module.exports = router;