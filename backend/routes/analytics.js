// Analytics Routes
// Handles system-wide analytics, reporting, and data visualization

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// =============================================
// GET OVERVIEW ANALYTICS
// =============================================
router.get('/overview', async (req, res) => {
  try {
    const { period = '30' } = req.query; // period in days

    const dateFilter = `DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL ${period} DAY)`;

    // User analytics
    const [userAnalytics] = await db.promise().query(`
      SELECT
        COUNT(*) as total_users,
        SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active_users,
        SUM(CASE WHEN ${dateFilter} THEN 1 ELSE 0 END) as new_users,
        SUM(CASE WHEN last_login_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as recent_active_users
      FROM users
      WHERE deleted_at IS NULL
    `);

    // Project analytics
    const [projectAnalytics] = await db.promise().query(`
      SELECT
        COUNT(*) as total_projects,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as active_projects,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_projects,
        SUM(CASE WHEN ${dateFilter} THEN 1 ELSE 0 END) as new_projects,
        AVG(progress_percentage) as avg_progress
      FROM projects
      WHERE deleted_at IS NULL
    `);

    // Financial analytics
    const [financialAnalytics] = await db.promise().query(`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expenses,
        COALESCE(SUM(CASE WHEN type = 'income' AND ${dateFilter} THEN amount ELSE 0 END), 0) as recent_income,
        COALESCE(SUM(CASE WHEN type = 'expense' AND ${dateFilter} THEN amount ELSE 0 END), 0) as recent_expenses
      FROM accounting_entries
      WHERE deleted_at IS NULL
    `);

    // Task analytics
    const [taskAnalytics] = await db.promise().query(`
      SELECT
        COUNT(*) as total_tasks,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks,
        SUM(CASE WHEN due_date < CURDATE() AND status != 'completed' THEN 1 ELSE 0 END) as overdue_tasks
      FROM project_tasks
      WHERE deleted_at IS NULL
    `);

    res.json({
      success: true,
      analytics: {
        users: userAnalytics[0],
        projects: projectAnalytics[0],
        financial: financialAnalytics[0],
        tasks: taskAnalytics[0]
      }
    });
  } catch (error) {
    console.error('Error fetching overview analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overview analytics',
      error: error.message
    });
  }
});

// =============================================
// GET USER ACTIVITY ANALYTICS
// =============================================
router.get('/user-activity', async (req, res) => {
  try {
    const { period = '30' } = req.query;

    const [activityData] = await db.promise().query(`
      SELECT
        DATE_FORMAT(created_at, '%Y-%m-%d') as date,
        COUNT(*) as actions
      FROM admin_activity_logs
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
      ORDER BY date ASC
    `, [parseInt(period)]);

    // Activity by type
    const [activityByType] = await db.promise().query(`
      SELECT
        action_type,
        COUNT(*) as count
      FROM admin_activity_logs
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY action_type
      ORDER BY count DESC
    `, [parseInt(period)]);

    res.json({
      success: true,
      timeline: activityData,
      byType: activityByType
    });
  } catch (error) {
    console.error('Error fetching user activity analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user activity analytics',
      error: error.message
    });
  }
});

// =============================================
// GET PROJECT PERFORMANCE ANALYTICS
// =============================================
router.get('/project-performance', async (req, res) => {
  try {
    const [performanceData] = await db.promise().query(`
      SELECT
        p.project_name,
        p.status,
        p.progress_percentage,
        p.start_date,
        p.end_date,
        COUNT(DISTINCT pt.id) as total_tasks,
        COUNT(DISTINCT CASE WHEN pt.status = 'completed' THEN pt.id END) as completed_tasks,
        COALESCE(SUM(pe.amount), 0) as total_expenses,
        COALESCE(SUM(pi.amount), 0) as total_invoices
      FROM projects p
      LEFT JOIN project_tasks pt ON p.id = pt.project_id AND pt.deleted_at IS NULL
      LEFT JOIN project_expenses pe ON p.id = pe.project_id AND pe.deleted_at IS NULL
      LEFT JOIN project_invoices pi ON p.id = pi.project_id AND pi.deleted_at IS NULL
      WHERE p.deleted_at IS NULL
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT 50
    `);

    // Project status distribution
    const [statusDistribution] = await db.promise().query(`
      SELECT
        status,
        COUNT(*) as count
      FROM projects
      WHERE deleted_at IS NULL
      GROUP BY status
    `);

    res.json({
      success: true,
      projects: performanceData,
      statusDistribution
    });
  } catch (error) {
    console.error('Error fetching project performance analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project performance analytics',
      error: error.message
    });
  }
});

// =============================================
// GET FINANCIAL ANALYTICS
// =============================================
router.get('/financial', async (req, res) => {
  try {
    const { period = '30' } = req.query;

    const dateFilter = `DATE(entry_date) >= DATE_SUB(CURDATE(), INTERVAL ${period} DAY)`;

    // Income vs expense trends
    const [trends] = await db.promise().query(`
      SELECT
        DATE_FORMAT(entry_date, '%Y-%m') as month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
      FROM accounting_entries
      WHERE entry_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH) AND deleted_at IS NULL
      GROUP BY DATE_FORMAT(entry_date, '%Y-%m')
      ORDER BY month ASC
    `);

    // Category breakdown
    const [categoryBreakdown] = await db.promise().query(`
      SELECT
        ac.name as category,
        SUM(ae.amount) as total,
        COUNT(*) as transaction_count
      FROM accounting_entries ae
      LEFT JOIN accounting_categories ac ON ae.category_id = ac.id
      WHERE ae.deleted_at IS NULL
      GROUP BY ae.category_id
      ORDER BY total DESC
    `);

    // Budget vs actual
    const [budgetAnalysis] = await db.promise().query(`
      SELECT
        pb.project_id,
        p.project_name,
        pb.amount as budgeted,
        COALESCE(SUM(CASE WHEN pe.type = 'expense' THEN pe.amount ELSE 0 END), 0) as actual_spent,
        (pb.amount - COALESCE(SUM(CASE WHEN pe.type = 'expense' THEN pe.amount ELSE 0 END), 0)) as remaining
      FROM project_budgets pb
      LEFT JOIN projects p ON pb.project_id = p.id
      LEFT JOIN project_expenses pe ON pb.project_id = pe.project_id AND pe.deleted_at IS NULL
      WHERE pb.deleted_at IS NULL
      GROUP BY pb.id
    `);

    res.json({
      success: true,
      trends,
      categoryBreakdown,
      budgetAnalysis
    });
  } catch (error) {
    console.error('Error fetching financial analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch financial analytics',
      error: error.message
    });
  }
});

// =============================================
// GET TASK ANALYTICS
// =============================================
router.get('/tasks', async (req, res) => {
  try {
    const { period = '30' } = req.query;

    // Task completion trends
    const [completionTrends] = await db.promise().query(`
      SELECT
        DATE_FORMAT(completed_at, '%Y-%m-%d') as date,
        COUNT(*) as completed_tasks
      FROM project_tasks
      WHERE completed_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        AND status = 'completed'
        AND deleted_at IS NULL
      GROUP BY DATE_FORMAT(completed_at, '%Y-%m-%d')
      ORDER BY date ASC
    `, [parseInt(period)]);

    // Task status distribution
    const [statusDistribution] = await db.promise().query(`
      SELECT
        status,
        COUNT(*) as count
      FROM project_tasks
      WHERE deleted_at IS NULL
      GROUP BY status
    `);

    // Task priority distribution
    const [priorityDistribution] = await db.promise().query(`
      SELECT
        priority,
        COUNT(*) as count
      FROM project_tasks
      WHERE deleted_at IS NULL
      GROUP BY priority
    `);

    // Top performers
    const [topPerformers] = await db.promise().query(`
      SELECT
        u.display_name,
        COUNT(CASE WHEN pt.status = 'completed' THEN pt.id END) as completed_tasks,
        AVG(CASE WHEN pt.estimated_hours > 0 THEN pt.actual_hours / pt.estimated_hours ELSE NULL END) as efficiency_ratio
      FROM users u
      LEFT JOIN project_tasks pt ON u.id = pt.assigned_to AND pt.deleted_at IS NULL
      WHERE u.deleted_at IS NULL
      GROUP BY u.id
      HAVING completed_tasks > 0
      ORDER BY completed_tasks DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      completionTrends,
      statusDistribution,
      priorityDistribution,
      topPerformers
    });
  } catch (error) {
    console.error('Error fetching task analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task analytics',
      error: error.message
    });
  }
});

// =============================================
// GET SYSTEM HEALTH ANALYTICS
// =============================================
router.get('/system-health', async (req, res) => {
  try {
    const [healthMetrics] = await db.promise().query(`
      SELECT
        (SELECT COUNT(*) FROM admin_activity_logs WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)) as recent_activity_count,
        (SELECT COUNT(*) FROM users WHERE is_active = TRUE AND deleted_at IS NULL) as active_users_count,
        (SELECT COUNT(*) FROM projects WHERE status = 'in_progress' AND deleted_at IS NULL) as active_projects_count,
        (SELECT COUNT(*) FROM project_tasks WHERE status != 'completed' AND due_date < CURDATE() AND deleted_at IS NULL) as overdue_tasks_count,
        (SELECT COUNT(*) FROM notifications WHERE is_read = FALSE AND created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)) as unread_notifications_count
    `);

    // Storage usage (simplified)
    const [storageMetrics] = await db.promise().query(`
      SELECT
        COUNT(*) as total_images,
        SUM(file_size) as total_storage_used
      FROM images
      WHERE deleted_at IS NULL
    `);

    res.json({
      success: true,
      health: healthMetrics[0],
      storage: storageMetrics[0]
    });
  } catch (error) {
    console.error('Error fetching system health analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system health analytics',
      error: error.message
    });
  }
});

module.exports = router;