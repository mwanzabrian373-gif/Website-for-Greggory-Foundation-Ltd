// Task Management Routes
// Handles task CRUD operations, assignments, and tracking

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// =============================================
// GET ALL TASKS
// =============================================
router.get('/', async (req, res) => {
  try {
    const { project_id, status, priority, assigned_to, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT
        t.*,
        p.project_name,
        u.display_name as assigned_to_name,
        creator.display_name as created_by_name
      FROM project_tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN users creator ON t.created_by = creator.id
      WHERE t.deleted_at IS NULL
    `;

    const params = [];

    if (project_id) {
      query += ' AND t.project_id = ?';
      params.push(project_id);
    }

    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }

    if (priority) {
      query += ' AND t.priority = ?';
      params.push(priority);
    }

    if (assigned_to) {
      query += ' AND t.assigned_to = ?';
      params.push(assigned_to);
    }

    query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [tasks] = await db.promise().query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM project_tasks t WHERE t.deleted_at IS NULL';
    const countParams = [];

    if (project_id) {
      countQuery += ' AND t.project_id = ?';
      countParams.push(project_id);
    }

    if (status) {
      countQuery += ' AND t.status = ?';
      countParams.push(status);
    }

    if (priority) {
      countQuery += ' AND t.priority = ?';
      countParams.push(priority);
    }

    if (assigned_to) {
      countQuery += ' AND t.assigned_to = ?';
      countParams.push(assigned_to);
    }

    const [countResult] = await db.promise().query(countQuery, countParams);

    res.json({
      success: true,
      tasks,
      pagination: {
        total: countResult[0].total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
      error: error.message
    });
  }
});

// =============================================
// GET TASK BY ID
// =============================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [tasks] = await db.promise().query(`
      SELECT
        t.*,
        p.project_name,
        u.display_name as assigned_to_name,
        creator.display_name as created_by_name
      FROM project_tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN users creator ON t.created_by = creator.id
      WHERE t.id = ? AND t.deleted_at IS NULL
    `, [id]);

    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Get task comments
    const [comments] = await db.promise().query(`
      SELECT
        tc.*,
        u.display_name as author_name
      FROM task_comments tc
      LEFT JOIN users u ON tc.author_id = u.id
      WHERE tc.task_id = ?
      ORDER BY tc.created_at ASC
    `, [id]);

    res.json({
      success: true,
      task: tasks[0],
      comments
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task',
      error: error.message
    });
  }
});

// =============================================
// CREATE TASK
// =============================================
router.post('/', async (req, res) => {
  try {
    const {
      project_id,
      title,
      description,
      status = 'todo',
      priority = 'medium',
      assigned_to,
      due_date,
      estimated_hours,
      task_type = 'general',
      dependencies = [],
      tags = [],
      created_by
    } = req.body;

    if (!project_id || !title) {
      return res.status(400).json({
        success: false,
        message: 'Project ID and title are required'
      });
    }

    const [result] = await db.promise().query(`
      INSERT INTO project_tasks (
        project_id, title, description, status, priority, assigned_to,
        due_date, estimated_hours, task_type, dependencies, tags,
        created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      project_id, title, description, status, priority, assigned_to,
      due_date, estimated_hours, task_type,
      JSON.stringify(dependencies), JSON.stringify(tags), created_by
    ]);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      taskId: result.insertId
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: error.message
    });
  }
});

// =============================================
// UPDATE TASK
// =============================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status,
      priority,
      assigned_to,
      due_date,
      estimated_hours,
      actual_hours,
      progress_percentage,
      dependencies,
      tags,
      completed_at
    } = req.body;

    // Build dynamic update query
    const updates = [];
    const params = [];

    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }

    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }

    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }

    if (priority !== undefined) {
      updates.push('priority = ?');
      params.push(priority);
    }

    if (assigned_to !== undefined) {
      updates.push('assigned_to = ?');
      params.push(assigned_to);
    }

    if (due_date !== undefined) {
      updates.push('due_date = ?');
      params.push(due_date);
    }

    if (estimated_hours !== undefined) {
      updates.push('estimated_hours = ?');
      params.push(estimated_hours);
    }

    if (actual_hours !== undefined) {
      updates.push('actual_hours = ?');
      params.push(actual_hours);
    }

    if (progress_percentage !== undefined) {
      updates.push('progress_percentage = ?');
      params.push(progress_percentage);
    }

    if (dependencies !== undefined) {
      updates.push('dependencies = ?');
      params.push(JSON.stringify(dependencies));
    }

    if (tags !== undefined) {
      updates.push('tags = ?');
      params.push(JSON.stringify(tags));
    }

    if (completed_at !== undefined) {
      updates.push('completed_at = ?');
      params.push(completed_at);
    }

    updates.push('updated_at = NOW()');
    params.push(id);

    const [result] = await db.promise().query(
      `UPDATE project_tasks SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully'
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task',
      error: error.message
    });
  }
});

// =============================================
// DELETE TASK
// =============================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.promise().query(
      'UPDATE project_tasks SET deleted_at = NOW() WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: error.message
    });
  }
});

// =============================================
// ADD TASK COMMENT
// =============================================
router.post('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { author_id, comment, attachments = [] } = req.body;

    if (!author_id || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Author ID and comment are required'
      });
    }

    const [result] = await db.promise().query(`
      INSERT INTO task_comments (task_id, author_id, comment, attachments, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `, [id, author_id, comment, JSON.stringify(attachments)]);

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      commentId: result.insertId
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message
    });
  }
});

// =============================================
// GET TASK STATISTICS
// =============================================
router.get('/stats/overview', async (req, res) => {
  try {
    const { project_id } = req.query;

    let projectFilter = '';
    const params = [];

    if (project_id) {
      projectFilter = 'AND project_id = ?';
      params.push(project_id);
    }

    const [stats] = await db.promise().query(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) as todo,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'review' THEN 1 ELSE 0 END) as review,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_priority,
        SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) as urgent,
        SUM(CASE WHEN due_date < CURDATE() AND status != 'completed' THEN 1 ELSE 0 END) as overdue
      FROM project_tasks
      WHERE deleted_at IS NULL ${projectFilter}
    `, params);

    res.json({
      success: true,
      stats: stats[0]
    });
  } catch (error) {
    console.error('Error fetching task statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task statistics',
      error: error.message
    });
  }
});

module.exports = router;