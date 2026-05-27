const express = require('express');
const router = express.Router();
const db = require('../config/database');
const requireAdmin = require('../middleware/auth');

// ============================================
// QUICK LINKS
// ============================================

// Get all quick links (public)
router.get('/quick-links', (req, res) => {
  const query = `
    SELECT * FROM quick_links 
    WHERE is_active = true
    ORDER BY display_order ASC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching quick links:', err);
      return res.status(500).json({ error: 'Failed to fetch quick links' });
    }
    res.json(results);
  });
});

// Get all quick links including inactive (admin only)
router.get('/quick-links/all', requireAdmin, (req, res) => {
  const query = `
    SELECT * FROM quick_links 
    ORDER BY display_order ASC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching quick links:', err);
      return res.status(500).json({ error: 'Failed to fetch quick links' });
    }
    res.json(results);
  });
});

// Create quick link (admin only)
router.post('/quick-links', requireAdmin, (req, res) => {
  const { title, url, display_order, is_active } = req.body;
  
  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' });
  }
  
  const query = `
    INSERT INTO quick_links (title, url, display_order, is_active)
    VALUES (?, ?, ?, ?)
  `;
  
  db.query(query, [
    title, url, display_order || 0, is_active !== undefined ? is_active : true
  ], (err, result) => {
    if (err) {
      console.error('Error creating quick link:', err);
      return res.status(500).json({ error: 'Failed to create quick link' });
    }
    
    res.status(201).json({
      message: 'Quick link created successfully',
      id: result.insertId
    });
  });
});

// Update quick link (admin only)
router.put('/quick-links/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { title, url, display_order, is_active } = req.body;
  
  const query = `
    UPDATE quick_links SET
      title = ?, url = ?, display_order = ?, is_active = ?, updated_at = NOW()
    WHERE id = ?
  `;
  
  db.query(query, [
    title, url, display_order, is_active, id
  ], (err) => {
    if (err) {
      console.error('Error updating quick link:', err);
      return res.status(500).json({ error: 'Failed to update quick link' });
    }
    
    res.json({ message: 'Quick link updated successfully' });
  });
});

// Delete quick link (admin only)
router.delete('/quick-links/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM quick_links WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting quick link:', err);
      return res.status(500).json({ error: 'Failed to delete quick link' });
    }
    
    res.json({ message: 'Quick link deleted successfully' });
  });
});

// Reorder quick links (admin only)
router.put('/quick-links/reorder', requireAdmin, (req, res) => {
  const { links } = req.body;
  
  if (!Array.isArray(links)) {
    return res.status(400).json({ error: 'Links must be an array' });
  }
  
  const promises = links.map(link => {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE quick_links SET display_order = ? WHERE id = ?',
        [link.display_order, link.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  });
  
  Promise.all(promises)
    .then(() => {
      res.json({ message: 'Quick links reordered successfully' });
    })
    .catch((err) => {
      console.error('Error reordering quick links:', err);
      res.status(500).json({ error: 'Failed to reorder quick links' });
    });
});

module.exports = router;
