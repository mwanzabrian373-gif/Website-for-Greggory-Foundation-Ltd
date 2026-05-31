// Communication Management Routes
// Comprehensive communication management with messaging and notification operations

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// =============================================
// GET COMMUNICATION STATISTICS
// =============================================
router.get('/stats', async (req, res) => {
  try {
    let totalMessages = 0, unreadMessages = 0, sentMessages = 0, receivedMessages = 0;
    let notifications = 0, notificationsToday = 0, responseRate = 0, avgResponseTime = 0;
    
    try {
      const [messageStats] = await db.promise().query(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) as unread,
          SUM(CASE WHEN direction = 'sent' THEN 1 ELSE 0 END) as sent,
          SUM(CASE WHEN direction = 'received' THEN 1 ELSE 0 END) as received,
          AVG(response_time_minutes) as avg_response
        FROM client_messages WHERE deleted_at IS NULL`
      );
      
      totalMessages = messageStats[0]?.total || 0;
      unreadMessages = messageStats[0]?.unread || 0;
      sentMessages = messageStats[0]?.sent || 0;
      receivedMessages = messageStats[0]?.received || 0;
      avgResponseTime = messageStats[0]?.avg_response || 0;
      responseRate = sentMessages > 0 ? ((receivedMessages / sentMessages) * 100).toFixed(1) : 0;
    } catch (err) {
      console.log('[COMMUNICATION STATS] Message stats failed:', err.message);
    }
    
    try {
      const [notificationStats] = await db.promise().query(
        `SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as today
        FROM notifications WHERE deleted_at IS NULL`
      );
      
      notifications = notificationStats[0]?.total || 0;
      notificationsToday = notificationStats[0]?.today || 0;
    } catch (err) {
      console.log('[COMMUNICATION STATS] Notification stats failed:', err.message);
    }
    
    res.json({
      success: true,
      stats: {
        totalMessages,
        unreadMessages,
        sentMessages,
        receivedMessages,
        notifications,
        notificationsToday,
        responseRate,
        avgResponseTime
      }
    });
  } catch (error) {
    console.error('[COMMUNICATION STATS] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to fetch communication statistics',
      stats: {
        totalMessages: 0,
        unreadMessages: 0,
        sentMessages: 0,
        receivedMessages: 0,
        notifications: 0,
        notificationsToday: 0,
        responseRate: 0,
        avgResponseTime: 0
      }
    });
  }
});

// =============================================
// GET ALL MESSAGES
// =============================================
router.get('/messages', async (req, res) => {
  try {
    const { folder = 'inbox', status, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        cm.id, cm.subject, cm.message, cm.direction, cm.is_read,
        cm.created_at, cm.response_time_minutes,
        c.name as client_name, c.email as client_email,
        a.first_name as admin_first_name, a.last_name as admin_last_name,
        p.name as project_name
      FROM client_messages cm
      LEFT JOIN clients c ON cm.client_id = c.id
      LEFT JOIN admin_users a ON cm.admin_id = a.id
      LEFT JOIN projects p ON cm.project_id = p.id
      WHERE cm.deleted_at IS NULL
    `;
    
    const params = [];
    
    if (folder === 'inbox') {
      query += ` AND cm.direction = 'received'`;
    } else if (folder === 'sent') {
      query += ` AND cm.direction = 'sent'`;
    } else if (folder === 'unread') {
      query += ` AND cm.direction = 'received' AND cm.is_read = 0`;
    }
    
    if (status === 'read') {
      query += ` AND cm.is_read = 1`;
    } else if (status === 'unread') {
      query += ` AND cm.is_read = 0`;
    }
    
    if (search) {
      query += ` AND (cm.subject LIKE ? OR cm.message LIKE ? OR c.name LIKE ?)`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }
    
    query += ` ORDER BY cm.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`;
    
    const [messages] = await db.promise().query(query, params);
    
    res.json({
      success: true,
      messages,
      pagination: {
        total: messages.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(messages.length / limit)
      }
    });
  } catch (error) {
    console.error('[COMMUNICATION MESSAGES] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to fetch messages',
      messages: [],
      pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
    });
  }
});

// =============================================
// SEND MESSAGE
// =============================================
router.post('/messages', async (req, res) => {
  try {
    const { client_id, admin_id, project_id, subject, message, direction = 'sent', priority = 'normal' } = req.body;
    
    if (!subject || !message) {
      return res.json({
        success: false,
        message: 'Subject and message are required'
      });
    }
    
    const [result] = await db.promise().query(
      `INSERT INTO client_messages (client_id, admin_id, project_id, subject, message, direction, priority, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [client_id, admin_id, project_id, subject, message, direction, priority]
    );
    
    // Create notification for recipient
    if (direction === 'sent' && client_id) {
      await db.promise().query(
        `INSERT INTO notifications (user_id, type, title, message, status, created_at)
        VALUES (?, 'message', ?, ?, 'unread', NOW())`,
        [client_id, subject, `New message: ${message.substring(0, 100)}...`]
      );
    }
    
    res.json({
      success: true,
      message: 'Message sent successfully',
      messageId: result.insertId
    });
  } catch (error) {
    console.error('[COMMUNICATION SEND] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

// =============================================
// GET ALL NOTIFICATIONS
// =============================================
router.get('/notifications', async (req, res) => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        n.id, n.type, n.title, n.message, n.status, n.created_at,
        u.first_name, u.last_name, u.email
      FROM notifications n
      LEFT JOIN users u ON n.user_id = u.id
      WHERE n.deleted_at IS NULL
    `;
    
    const params = [];
    
    if (type) {
      query += ` AND n.type = ?`;
      params.push(type);
    }
    
    if (status === 'read') {
      query += ` AND n.status = 'read'`;
    } else if (status === 'unread') {
      query += ` AND n.status = 'unread'`;
    }
    
    query += ` ORDER BY n.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`;
    
    const [notifications] = await db.promise().query(query, params);
    
    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('[COMMUNICATION NOTIFICATIONS] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to fetch notifications',
      notifications: []
    });
  }
});

// =============================================
// MARK NOTIFICATION AS READ
// =============================================
router.put('/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.promise().query(
      `UPDATE notifications SET status = 'read', read_at = NOW() WHERE id = ?`,
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('[COMMUNICATION NOTIFICATION READ] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
});

// =============================================
// SEND BULK NOTIFICATION
// =============================================
router.post('/notifications/bulk', async (req, res) => {
  try {
    const { recipient_type, recipient_ids, title, message, type = 'general' } = req.body;
    
    if (!title || !message) {
      return res.json({
        success: false,
        message: 'Title and message are required'
      });
    }
    
    let recipients = [];
    
    if (recipient_type === 'all') {
      const [allUsers] = await db.promise().query(
        `SELECT id FROM users WHERE deleted_at IS NULL`
      );
      recipients = allUsers.map(u => u.id);
    } else if (recipient_type === 'active') {
      const [activeUsers] = await db.promise().query(
        `SELECT id FROM users WHERE is_active = 1 AND deleted_at IS NULL`
      );
      recipients = activeUsers.map(u => u.id);
    } else if (recipient_ids && Array.isArray(recipient_ids)) {
      recipients = recipient_ids;
    }
    
    let successCount = 0;
    
    for (const userId of recipients) {
      await db.promise().query(
        `INSERT INTO notifications (user_id, type, title, message, status, created_at)
        VALUES (?, ?, ?, ?, 'unread', NOW())`,
        [userId, type, title, message]
      );
      successCount++;
    }
    
    res.json({
      success: true,
      message: `Bulk notification sent to ${successCount} recipients`,
      successCount
    });
  } catch (error) {
    console.error('[COMMUNICATION BULK NOTIFICATION] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to send bulk notification'
    });
  }
});

module.exports = router;