// Communication Hub Routes
// Handles internal messaging, announcements, and team communication

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// =============================================
// GET ALL MESSAGES
// =============================================
router.get('/messages', async (req, res) => {
  try {
    const { channel, sender_id, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT
        cm.*,
        u.display_name as sender_name,
        u.profile_photo_blob as sender_photo
      FROM communication_messages cm
      LEFT JOIN users u ON cm.sender_id = u.id
      WHERE cm.deleted_at IS NULL
    `;

    const params = [];

    if (channel) {
      query += ' AND cm.channel = ?';
      params.push(channel);
    }

    if (sender_id) {
      query += ' AND cm.sender_id = ?';
      params.push(sender_id);
    }

    query += ' ORDER BY cm.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [messages] = await db.promise().query(query, params);

    res.json({
      success: true,
      messages,
      count: messages.length
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
});

// =============================================
// SEND MESSAGE
// =============================================
router.post('/messages', async (req, res) => {
  try {
    const { sender_id, channel, message, message_type = 'text', attachments = [] } = req.body;

    if (!sender_id || !channel || !message) {
      return res.status(400).json({
        success: false,
        message: 'Sender ID, channel, and message are required'
      });
    }

    const [result] = await db.promise().query(`
      INSERT INTO communication_messages (sender_id, channel, message, message_type, attachments, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [sender_id, channel, message, message_type, JSON.stringify(attachments)]);

    // Create notification for mentioned users
    const mentionedUsers = message.match(/@(\w+)/g);
    if (mentionedUsers) {
      for (const mention of mentionedUsers) {
        const username = mention.substring(1);
        const [users] = await db.promise().query(
          'SELECT id FROM users WHERE display_name LIKE ?',
          [`%${username}%`]
        );

        for (const user of users) {
          await db.promise().query(`
            INSERT INTO notifications (user_id, notification_type, title, message, related_id, created_at)
            VALUES (?, 'mention', 'New Mention', ?, ?, NOW())
          `, [user.id, `You were mentioned in ${channel}`, result.insertId]);
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      messageId: result.insertId
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

// =============================================
// GET ANNOUNCEMENTS
// =============================================
router.get('/announcements', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const [announcements] = await db.promise().query(`
      SELECT
        aa.*,
        u.display_name as created_by_name,
        u.profile_photo_blob as creator_photo
      FROM admin_announcements aa
      LEFT JOIN users u ON aa.created_by = u.id
      WHERE aa.deleted_at IS NULL
        AND aa.status = 'published'
        AND (aa.expires_at IS NULL OR aa.expires_at > NOW())
      ORDER BY aa.created_at DESC
      LIMIT ? OFFSET ?
    `, [parseInt(limit), parseInt(offset)]);

    res.json({
      success: true,
      announcements,
      count: announcements.length
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements',
      error: error.message
    });
  }
});

// =============================================
// CREATE ANNOUNCEMENT
// =============================================
router.post('/announcements', async (req, res) => {
  try {
    const {
      title,
      content,
      priority = 'normal',
      target_audience = 'all',
      expires_at,
      created_by
    } = req.body;

    if (!title || !content || !created_by) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, and created_by are required'
      });
    }

    const [result] = await db.promise().query(`
      INSERT INTO admin_announcements (
        title, content, priority, target_audience, expires_at,
        status, created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 'published', ?, NOW(), NOW())
    `, [title, content, priority, target_audience, expires_at, created_by]);

    // Create notifications for all users if target_audience is 'all'
    if (target_audience === 'all') {
      await db.promise().query(`
        INSERT INTO notifications (user_id, notification_type, title, message, related_id, created_at)
        SELECT id, 'announcement', ?, ?, ?, NOW()
        FROM users
        WHERE is_active = TRUE AND deleted_at IS NULL
      `, [title, content.substring(0, 100) + '...', result.insertId]);
    }

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      announcementId: result.insertId
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create announcement',
      error: error.message
    });
  }
});

// =============================================
// GET USER NOTIFICATIONS
// =============================================
router.get('/notifications/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { limit = 50, offset = 0, unread_only = false } = req.query;

    let query = `
      SELECT
        n.*,
        u.display_name as sender_name
      FROM notifications n
      LEFT JOIN users u ON n.sender_id = u.id
      WHERE n.user_id = ?
    `;

    const params = [user_id];

    if (unread_only === 'true') {
      query += ' AND n.is_read = FALSE';
    }

    query += ' ORDER BY n.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [notifications] = await db.promise().query(query, params);

    res.json({
      success: true,
      notifications,
      count: notifications.length
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
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
      'UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
});

// =============================================
// MARK ALL NOTIFICATIONS AS READ
// =============================================
router.put('/notifications/user/:user_id/read-all', async (req, res) => {
  try {
    const { user_id } = req.params;

    const [result] = await db.promise().query(
      'UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE user_id = ? AND is_read = FALSE',
      [user_id]
    );

    res.json({
      success: true,
      message: 'All notifications marked as read',
      affected: result.affectedRows
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message
    });
  }
});

// =============================================
// GET COMMUNICATION CHANNELS
// =============================================
router.get('/channels', async (req, res) => {
  try {
    // This would typically come from a channels table
    // For now, return default channels
    const channels = [
      { id: 'general', name: 'General', description: 'General team discussions', type: 'public' },
      { id: 'projects', name: 'Projects', description: 'Project-related discussions', type: 'public' },
      { id: 'random', name: 'Random', description: 'Casual conversations', type: 'public' },
      { id: 'announcements', name: 'Announcements', description: 'Official announcements only', type: 'readonly' }
    ];

    res.json({
      success: true,
      channels
    });
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch channels',
      error: error.message
    });
  }
});

// =============================================
// DELETE MESSAGE
// =============================================
router.delete('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.promise().query(
      'UPDATE communication_messages SET deleted_at = NOW() WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message',
      error: error.message
    });
  }
});

module.exports = router;