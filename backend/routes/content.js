const express = require('express');
const router = express.Router();
const db = require('../config/database');
const requireAdmin = require('../middleware/auth');

// ============================================
// BLOG ARTICLES
// ============================================

// Get all blog articles
router.get('/blog', (req, res) => {
  const { published_only } = req.query;
  let query = `
    SELECT * FROM blog_articles
    ORDER BY created_at DESC
  `;
  
  if (published_only === 'true') {
    query = `
      SELECT * FROM blog_articles 
      WHERE is_published = true
      ORDER BY published_date DESC, created_at DESC
    `;
  }
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching blog articles:', err);
      return res.status(500).json({ error: 'Failed to fetch blog articles' });
    }
    res.json(results);
  });
});

// Get single blog article
router.get('/blog/:id', (req, res) => {
  const { id } = req.params;
  
  db.query('SELECT * FROM blog_articles WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error fetching blog article:', err);
      return res.status(500).json({ error: 'Failed to fetch blog article' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Blog article not found' });
    }
    
    res.json(results[0]);
  });
});

// Create blog article (admin only)
router.post('/blog', requireAdmin, (req, res) => {
  const { title, excerpt, content, author, read_time, category, image_url, image_id, icon_class, is_published } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  
  const query = `
    INSERT INTO blog_articles 
    (title, excerpt, content, author, read_time, category, image_url, image_id, icon_class, is_published, published_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const publishedDate = is_published ? new Date() : null;
  
  db.query(query, [
    title, excerpt, content, author, read_time, category, image_url, image_id, icon_class, 
    is_published || false, publishedDate
  ], (err, result) => {
    if (err) {
      console.error('Error creating blog article:', err);
      return res.status(500).json({ error: 'Failed to create blog article' });
    }
    
    res.status(201).json({
      message: 'Blog article created successfully',
      id: result.insertId
    });
  });
});

// Update blog article (admin only)
router.put('/blog/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { title, excerpt, content, author, read_time, category, image_url, image_id, icon_class, is_published } = req.body;
  
  // Check if article exists
  db.query('SELECT is_published, published_date FROM blog_articles WHERE id = ?', [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: 'Blog article not found' });
    }
    
    const currentArticle = results[0];
    const publishedDate = (is_published && !currentArticle.published_date) ? new Date() : currentArticle.published_date;
    
    const query = `
      UPDATE blog_articles SET
        title = ?, excerpt = ?, content = ?, author = ?, read_time = ?, 
        category = ?, image_url = ?, image_id = ?, icon_class = ?, 
        is_published = ?, published_date = ?, updated_at = NOW()
      WHERE id = ?
    `;
    
    db.query(query, [
      title, excerpt, content, author, read_time, category, image_url, image_id, 
      icon_class, is_published, publishedDate, id
    ], (err) => {
      if (err) {
        console.error('Error updating blog article:', err);
        return res.status(500).json({ error: 'Failed to update blog article' });
      }
      
      res.json({ message: 'Blog article updated successfully' });
    });
  });
});

// Delete blog article (admin only)
router.delete('/blog/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM blog_articles WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting blog article:', err);
      return res.status(500).json({ error: 'Failed to delete blog article' });
    }
    
    res.json({ message: 'Blog article deleted successfully' });
  });
});

// ============================================
// CASE STUDIES
// ============================================

// Get all case studies
router.get('/case-studies', (req, res) => {
  db.query('SELECT * FROM case_studies ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Error fetching case studies:', err);
      return res.status(500).json({ error: 'Failed to fetch case studies' });
    }
    res.json(results);
  });
});

// Get single case study
router.get('/case-studies/:id', (req, res) => {
  const { id } = req.params;
  
  db.query('SELECT * FROM case_studies WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error fetching case study:', err);
      return res.status(500).json({ error: 'Failed to fetch case study' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Case study not found' });
    }
    
    res.json(results[0]);
  });
});

// Create case study (admin only)
router.post('/case-studies', requireAdmin, (req, res) => {
  const { title, client, industry, challenge, solution, results, duration, image_urls, is_featured } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const imageUrlsJson = image_urls ? JSON.stringify(image_urls) : null;
  
  const query = `
    INSERT INTO case_studies 
    (title, client, industry, challenge, solution, results, duration, image_urls, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.query(query, [
    title, client, industry, challenge, solution, results, duration, imageUrlsJson, is_featured || false
  ], (err, result) => {
    if (err) {
      console.error('Error creating case study:', err);
      return res.status(500).json({ error: 'Failed to create case study' });
    }
    
    res.status(201).json({
      message: 'Case study created successfully',
      id: result.insertId
    });
  });
});

// Update case study (admin only)
router.put('/case-studies/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { title, client, industry, challenge, solution, results, duration, image_urls, is_featured } = req.body;
  
  const imageUrlsJson = image_urls ? JSON.stringify(image_urls) : null;
  
  const query = `
    UPDATE case_studies SET
      title = ?, client = ?, industry = ?, challenge = ?, solution = ?, 
      results = ?, duration = ?, image_urls = ?, is_featured = ?, updated_at = NOW()
    WHERE id = ?
  `;
  
  db.query(query, [
    title, client, industry, challenge, solution, results, duration, imageUrlsJson, is_featured, id
  ], (err) => {
    if (err) {
      console.error('Error updating case study:', err);
      return res.status(500).json({ error: 'Failed to update case study' });
    }
    
    res.json({ message: 'Case study updated successfully' });
  });
});

// Delete case study (admin only)
router.delete('/case-studies/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM case_studies WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting case study:', err);
      return res.status(500).json({ error: 'Failed to delete case study' });
    }
    
    res.json({ message: 'Case study deleted successfully' });
  });
});

// ============================================
// CONTACT FORMS
// ============================================

// Get all contact form submissions (admin only)
router.get('/contact-forms', requireAdmin, (req, res) => {
  db.query('SELECT * FROM contact_forms ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Error fetching contact forms:', err);
      return res.status(500).json({ error: 'Failed to fetch contact forms' });
    }
    res.json(results);
  });
});

// Get single contact form (admin only)
router.get('/contact-forms/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  
  db.query('SELECT * FROM contact_forms WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error fetching contact form:', err);
      return res.status(500).json({ error: 'Failed to fetch contact form' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Contact form not found' });
    }
    
    res.json(results[0]);
  });
});

// Delete contact form (admin only)
router.delete('/contact-forms/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM contact_forms WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting contact form:', err);
      return res.status(500).json({ error: 'Failed to delete contact form' });
    }
    
    res.json({ message: 'Contact form deleted successfully' });
  });
});

// ============================================
// NAVBAR ITEMS (User Navigation)
// ============================================

// Get all navbar navigation items (public)
router.get('/navbar', (req, res) => {
  const query = `
    SELECT * FROM quick_links 
    WHERE link_type = 'navbar' AND is_active = true
    ORDER BY display_order ASC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching navbar items:', err);
      return res.status(500).json({ error: 'Failed to fetch navbar items' });
    }
    res.json(results);
  });
});

// Get all navbar items including inactive (admin only)
router.get('/navbar/all', requireAdmin, (req, res) => {
  const query = `
    SELECT * FROM quick_links 
    WHERE link_type = 'navbar'
    ORDER BY display_order ASC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching navbar items:', err);
      return res.status(500).json({ error: 'Failed to fetch navbar items' });
    }
    res.json(results);
  });
});

// Create navbar item (admin only)
router.post('/navbar', requireAdmin, (req, res) => {
  const { title, url, icon_name, route_path, display_order, is_active } = req.body;
  
  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' });
  }
  
  const query = `
    INSERT INTO quick_links (title, url, icon_name, route_path, display_order, is_active, link_type)
    VALUES (?, ?, ?, ?, ?, ?, 'navbar')
  `;
  
  db.query(query, [
    title, url, icon_name || null, route_path || null, display_order || 0, is_active !== undefined ? is_active : true
  ], (err, result) => {
    if (err) {
      console.error('Error creating navbar item:', err);
      return res.status(500).json({ error: 'Failed to create navbar item' });
    }
    
    res.status(201).json({
      message: 'Navbar item created successfully',
      id: result.insertId
    });
  });
});

// Update navbar item (admin only)
router.put('/navbar/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { title, url, icon_name, route_path, display_order, is_active } = req.body;
  
  const query = `
    UPDATE quick_links SET
      title = ?, url = ?, icon_name = ?, route_path = ?, display_order = ?, is_active = ?, updated_at = NOW()
    WHERE id = ? AND link_type = 'navbar'
  `;
  
  db.query(query, [
    title, url, icon_name, route_path, display_order, is_active, id
  ], (err) => {
    if (err) {
      console.error('Error updating navbar item:', err);
      return res.status(500).json({ error: 'Failed to update navbar item' });
    }
    
    res.json({ message: 'Navbar item updated successfully' });
  });
});

// Delete navbar item (admin only)
router.delete('/navbar/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM quick_links WHERE id = ? AND link_type = "navbar"', [id], (err) => {
    if (err) {
      console.error('Error deleting navbar item:', err);
      return res.status(500).json({ error: 'Failed to delete navbar item' });
    }
    
    res.json({ message: 'Navbar item deleted successfully' });
  });
});

// Reorder navbar items (admin only)
router.put('/navbar/reorder', requireAdmin, (req, res) => {
  const { links } = req.body;
  
  if (!Array.isArray(links)) {
    return res.status(400).json({ error: 'Links must be an array' });
  }
  
  const promises = links.map(link => {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE quick_links SET display_order = ? WHERE id = ? AND link_type = "navbar"',
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
      res.json({ message: 'Navbar items reordered successfully' });
    })
    .catch((err) => {
      console.error('Error reordering navbar items:', err);
      res.status(500).json({ error: 'Failed to reorder navbar items' });
    });
});

// ============================================
// QUICK LINKS (Admin Panel Links)
// ============================================

// Get all quick links (public)
router.get('/quick-links', (req, res) => {
  const query = `
    SELECT * FROM quick_links WHERE link_type = 'admin' 
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
    SELECT * FROM quick_links WHERE link_type = 'admin' 
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
  const { title, url, icon_name, route_path, display_order, is_active } = req.body;
  
  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' });
  }
  
  const query = `
    INSERT INTO quick_links (title, url, icon_name, route_path, display_order, is_active, link_type)
    VALUES (?, ?, ?, ?, ?, ?, 'admin')
  `;
  
  db.query(query, [
    title, url, icon_name || null, route_path || null, display_order || 0, is_active !== undefined ? is_active : true
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
  const { title, url, icon_name, route_path, display_order, is_active } = req.body;
  
  const query = `
    UPDATE quick_links SET
      title = ?, url = ?, icon_name = ?, route_path = ?, display_order = ?, is_active = ?, updated_at = NOW()
    WHERE id = ?
  `;
  
  db.query(query, [
    title, url, icon_name, route_path, display_order, is_active, id
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