// Content Management Routes
// Comprehensive content management with all CRUD operations and enhanced features

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// =============================================
// GET CONTENT STATISTICS
// =============================================
router.get('/stats', async (req, res) => {
  try {
    // Get comprehensive content statistics
    let totalContent = 0, publishedContent = 0, draftContent = 0;
    let archivedContent = 0, featuredContent = 0, thisMonthContent = 0;
    let blogArticles = 0, caseStudies = 0, quickLinks = 0, teamMembers = 0;
    
    try {
      const [stats] = await db.promise().query(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
          SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
          SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived,
          SUM(CASE WHEN is_featured = 1 THEN 1 ELSE 0 END) as featured,
          COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN 1 END) as this_month
        FROM (
          SELECT status, is_featured, created_at FROM blog_articles WHERE deleted_at IS NULL
          UNION ALL
          SELECT status, is_featured, created_at FROM case_studies WHERE deleted_at IS NULL
          UNION ALL  
          SELECT status, is_featured, created_at FROM quick_links WHERE deleted_at IS NULL
        ) as combined_content`
      );
      
      totalContent = stats[0]?.total || 0;
      publishedContent = stats[0]?.published || 0;
      draftContent = stats[0]?.draft || 0;
      archivedContent = stats[0]?.archived || 0;
      featuredContent = stats[0]?.featured || 0;
      thisMonthContent = stats[0]?.this_month || 0;
    } catch (err) {
      console.log('[CONTENT STATS] Query failed, using defaults:', err.message);
    }
    
    try {
      const [blogStats] = await db.promise().query(
        'SELECT COUNT(*) as count FROM blog_articles WHERE deleted_at IS NULL'
      );
      blogArticles = blogStats[0]?.count || 0;
    } catch (err) {
      console.log('[CONTENT STATS] Blog articles query failed:', err.message);
    }
    
    try {
      const [caseStudyStats] = await db.promise().query(
        'SELECT COUNT(*) as count FROM case_studies WHERE deleted_at IS NULL'
      );
      caseStudies = caseStudyStats[0]?.count || 0;
    } catch (err) {
      console.log('[CONTENT STATS] Case studies query failed:', err.message);
    }
    
    try {
      const [quickLinkStats] = await db.promise().query(
        'SELECT COUNT(*) as count FROM quick_links WHERE deleted_at IS NULL'
      );
      quickLinks = quickLinkStats[0]?.count || 0;
    } catch (err) {
      console.log('[CONTENT STATS] Quick links query failed:', err.message);
    }
    
    try {
      const [teamStats] = await db.promise().query(
        'SELECT COUNT(*) as count FROM team_members WHERE deleted_at IS NULL'
      );
      teamMembers = teamStats[0]?.count || 0;
    } catch (err) {
      console.log('[CONTENT STATS] Team members query failed:', err.message);
    }
    
    res.json({
      success: true,
      stats: {
        totalContent,
        publishedContent,
        draftContent,
        archivedContent,
        featuredContent,
        thisMonthContent,
        blogArticles,
        caseStudies,
        quickLinks,
        teamMembers,
        publishRate: totalContent > 0 ? ((publishedContent / totalContent) * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    console.error('[CONTENT STATS] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to fetch content statistics',
      stats: {
        totalContent: 0,
        publishedContent: 0,
        draftContent: 0,
        archivedContent: 0,
        featuredContent: 0,
        thisMonthContent: 0,
        blogArticles: 0,
        caseStudies: 0,
        quickLinks: 0,
        teamMembers: 0,
        publishRate: 0
      }
    });
  }
});

// =============================================
// GET ALL CONTENT WITH FILTERS
// =============================================
router.get('/', async (req, res) => {
  try {
    const { type, status, search, page = 1, limit = 10, sort = 'created_at', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;
    
    let query = '';
    let params = [];
    
    // Build query based on content type
    if (type === 'blog') {
      query = `
        SELECT 
          ba.id, ba.title, ba.content as description, ba.status, ba.is_featured, 
          ba.created_at, ba.updated_at, ba.published_date,
          'blog' as content_type,
          CONCAT('/blog/', ba.id) as url,
          (SELECT COUNT(*) FROM user_feedback WHERE content_type = 'blog' AND content_id = ba.id AND deleted_at IS NULL) as feedback_count
        FROM blog_articles ba
        WHERE ba.deleted_at IS NULL
      `;
    } else if (type === 'case_study') {
      query = `
        SELECT 
          cs.id, cs.title, cs.description, cs.status, cs.is_featured,
          cs.created_at, cs.updated_at, cs.published_date,
          'case_study' as content_type,
          CONCAT('/case-studies/', cs.id) as url,
          (SELECT COUNT(*) FROM user_feedback WHERE content_type = 'case_study' AND content_id = cs.id AND deleted_at IS NULL) as feedback_count
        FROM case_studies cs
        WHERE cs.deleted_at IS NULL
      `;
    } else if (type === 'quick_link') {
      query = `
        SELECT 
          ql.id, ql.title, ql.url as description, ql.status, ql.is_featured,
          ql.created_at, ql.updated_at,
          'quick_link' as content_type,
          ql.url,
          0 as feedback_count
        FROM quick_links ql
        WHERE ql.deleted_at IS NULL
      `;
    } else {
      // All content types
      query = `
        SELECT 
          ba.id, ba.title, ba.content as description, ba.status, ba.is_featured,
          ba.created_at, ba.updated_at, ba.published_date,
          'blog' as content_type,
          CONCAT('/blog/', ba.id) as url,
          (SELECT COUNT(*) FROM user_feedback WHERE content_type = 'blog' AND content_id = ba.id AND deleted_at IS NULL) as feedback_count
        FROM blog_articles ba
        WHERE ba.deleted_at IS NULL
        
        UNION ALL
        
        SELECT 
          cs.id, cs.title, cs.description, cs.status, cs.is_featured,
          cs.created_at, cs.updated_at, cs.published_date,
          'case_study' as content_type,
          CONCAT('/case-studies/', cs.id) as url,
          (SELECT COUNT(*) FROM user_feedback WHERE content_type = 'case_study' AND content_id = cs.id AND deleted_at IS NULL) as feedback_count
        FROM case_studies cs
        WHERE cs.deleted_at IS NULL
        
        UNION ALL
        
        SELECT 
          ql.id, ql.title, ql.url as description, ql.status, ql.is_featured,
          ql.created_at, ql.updated_at, NULL as published_date,
          'quick_link' as content_type,
          ql.url,
          0 as feedback_count
        FROM quick_links ql
        WHERE ql.deleted_at IS NULL
      `;
    }
    
    // Add filters
    if (status) {
      if (type) {
        query += ` AND status = ?`;
        params.push(status);
      } else {
        // For combined query, apply status to each subquery
        query = query.replace(/WHERE ba\.deleted_at IS NULL/g, 'WHERE ba.deleted_at IS NULL AND ba.status = ?')
                 .replace(/WHERE cs\.deleted_at IS NULL/g, 'WHERE cs.deleted_at IS NULL AND cs.status = ?')
                 .replace(/WHERE ql\.deleted_at IS NULL/g, 'WHERE ql.deleted_at IS NULL AND ql.status = ?');
        params.push(status, status, status);
      }
    }
    
    if (search) {
      if (type) {
        query += ` AND (title LIKE ? OR content LIKE ? OR description LIKE ?)`;
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern);
      } else {
        query = query.replace(/WHERE ba\.deleted_at IS NULL/g, 'WHERE ba.deleted_at IS NULL AND (ba.title LIKE ? OR ba.content LIKE ?)')
                 .replace(/WHERE cs\.deleted_at IS NULL/g, 'WHERE cs.deleted_at IS NULL AND (cs.title LIKE ? OR cs.description LIKE ?)')
                 .replace(/WHERE ql\.deleted_at IS NULL/g, 'WHERE ql.deleted_at IS NULL AND (ql.title LIKE ?)');
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
      }
    }
    
    // Add sorting
    const allowedSorts = ['created_at', 'updated_at', 'title', 'status', 'published_date'];
    const sortField = allowedSorts.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortField} ${sortOrder}`;
    
    // Add pagination
    query += ` LIMIT ${parseInt(limit)} OFFSET ${offset}`;
    
    const [content] = await db.promise().query(query, params);
    
    res.json({
      success: true,
      content,
      pagination: {
        total: content.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(content.length / limit)
      }
    });
  } catch (error) {
    console.error('[CONTENT GET] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to fetch content',
      content: [],
      pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
    });
  }
});

// =============================================
// GET SINGLE CONTENT BY ID
// =============================================
router.get('/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    
    let query = '';
    let params = [id];
    
    switch (type) {
      case 'blog':
        query = `
          SELECT 
            ba.*, 'blog' as content_type,
            CONCAT('/blog/', ba.id) as url,
            (SELECT COUNT(*) FROM user_feedback WHERE content_type = 'blog' AND content_id = ba.id AND deleted_at IS NULL) as feedback_count
          FROM blog_articles ba
          WHERE ba.id = ? AND ba.deleted_at IS NULL
        `;
        break;
      
      case 'case_study':
        query = `
          SELECT 
            cs.*, 'case_study' as content_type,
            CONCAT('/case-studies/', cs.id) as url,
            (SELECT COUNT(*) FROM user_feedback WHERE content_type = 'case_study' AND content_id = cs.id AND deleted_at IS NULL) as feedback_count
          FROM case_studies cs
          WHERE cs.id = ? AND cs.deleted_at IS NULL
        `;
        break;
      
      case 'quick_link':
        query = `
          SELECT 
            ql.*, 'quick_link' as content_type,
            ql.url,
            0 as feedback_count
          FROM quick_links ql
          WHERE ql.id = ? AND ql.deleted_at IS NULL
        `;
        break;
      
      case 'team_member':
        query = `
          SELECT 
            tm.*, 'team_member' as content_type,
            CONCAT('/team/', tm.id) as url,
            0 as feedback_count
          FROM team_members tm
          WHERE tm.id = ? AND tm.deleted_at IS NULL
        `;
        break;
      
      default:
        return res.json({
          success: false,
          message: 'Invalid content type'
        });
    }
    
    const [content] = await db.promise().query(query, params);
    
    if (content.length === 0) {
      return res.json({
        success: false,
        message: 'Content not found'
      });
    }
    
    // Get content feedback
    if (type !== 'quick_link') {
      const [feedback] = await db.promise().query(
        `SELECT uf.*, u.display_name, u.email
         FROM user_feedback uf
         LEFT JOIN users u ON uf.user_id = u.id
         WHERE uf.content_type = ? AND uf.content_id = ? AND uf.deleted_at IS NULL
         ORDER BY uf.created_at DESC LIMIT 20`,
        [type, id]
      );
      
      res.json({
        success: true,
        content: content[0],
        feedback
      });
    } else {
      res.json({
        success: true,
        content: content[0],
        feedback: []
      });
    }
  } catch (error) {
    console.error('[CONTENT GET ID] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to fetch content details',
      content: null
    });
  }
});

// =============================================
// CREATE NEW CONTENT
// =============================================
router.post('/', async (req, res) => {
  try {
    const { type, title, description, content, status = 'draft', is_featured = 0, url, published_date, category, author_id, role, department, image_id } = req.body;
    
    if (!title) {
      return res.json({
        success: false,
        message: 'Title is required'
      });
    }
    
    let query = '';
    let params = [];
    let result;
    
    switch (type) {
      case 'blog':
        query = `
          INSERT INTO blog_articles (title, content, status, is_featured, published_date, category, author_id, image_id, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;
        params = [title, content, status, is_featured, published_date, category, author_id, image_id];
        break;
      
      case 'case_study':
        query = `
          INSERT INTO case_studies (title, description, status, is_featured, published_date, category, image_id, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;
        params = [title, description, status, is_featured, published_date, category, image_id];
        break;
      
      case 'quick_link':
        query = `
          INSERT INTO quick_links (title, url, status, is_featured, created_at, updated_at)
          VALUES (?, ?, ?, ?, NOW(), NOW())
        `;
        params = [title, url, status, is_featured];
        break;
      
      case 'team_member':
        query = `
          INSERT INTO team_members (name, role, department, description, is_active, created_at, updated_at)
          VALUES (?, ?, ?, ?, 1, NOW(), NOW())
        `;
        params = [title, role, department, description];
        break;
      
      default:
        return res.json({
          success: false,
          message: 'Invalid content type'
        });
    }
    
    [result] = await db.promise().query(query, params);
    
    res.json({
      success: true,
      message: `${type} created successfully`,
      contentId: result.insertId
    });
  } catch (error) {
    console.error('[CONTENT POST] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to create content'
    });
  }
});

// =============================================
// UPDATE CONTENT
// =============================================
router.put('/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const { title, description, content, status, is_featured, url, published_date, category, author_id, image_id, role, department, is_active } = req.body;
    
    let query = '';
    let params = [];
    
    switch (type) {
      case 'blog':
        query = `
          UPDATE blog_articles SET 
            title = ?, content = ?, status = ?, is_featured = ?, 
            published_date = ?, category = ?, author_id = ?, image_id = ?, updated_at = NOW()
          WHERE id = ? AND deleted_at IS NULL
        `;
        params = [title, content, status, is_featured, published_date, category, author_id, image_id, id];
        break;
      
      case 'case_study':
        query = `
          UPDATE case_studies SET 
            title = ?, description = ?, status = ?, is_featured = ?, 
            published_date = ?, category = ?, image_id = ?, updated_at = NOW()
          WHERE id = ? AND deleted_at IS NULL
        `;
        params = [title, description, status, is_featured, published_date, category, image_id, id];
        break;
      
      case 'quick_link':
        query = `
          UPDATE quick_links SET 
            title = ?, url = ?, status = ?, is_featured = ?, updated_at = NOW()
          WHERE id = ? AND deleted_at IS NULL
        `;
        params = [title, url, status, is_featured, id];
        break;
      
      case 'team_member':
        query = `
          UPDATE team_members SET 
            name = ?, role = ?, department = ?, description = ?, is_active = ?, updated_at = NOW()
          WHERE id = ? AND deleted_at IS NULL
        `;
        params = [title, role, department, description, is_active, id];
        break;
      
      default:
        return res.json({
          success: false,
          message: 'Invalid content type'
        });
    }
    
    const [result] = await db.promise().query(query, params);
    
    if (result.affectedRows === 0) {
      return res.json({
        success: false,
        message: 'Content not found'
      });
    }
    
    res.json({
      success: true,
      message: `${type} updated successfully`
    });
  } catch (error) {
    console.error('[CONTENT PUT] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to update content'
    });
  }
});

// =============================================
// DELETE CONTENT (SOFT DELETE)
// =============================================
router.delete('/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    
    let query = '';
    
    switch (type) {
      case 'blog':
        query = `UPDATE blog_articles SET deleted_at = NOW() WHERE id = ?`;
        break;
      
      case 'case_study':
        query = `UPDATE case_studies SET deleted_at = NOW() WHERE id = ?`;
        break;
      
      case 'quick_link':
        query = `UPDATE quick_links SET deleted_at = NOW() WHERE id = ?`;
        break;
      
      case 'team_member':
        query = `UPDATE team_members SET deleted_at = NOW() WHERE id = ?`;
        break;
      
      default:
        return res.json({
          success: false,
          message: 'Invalid content type'
        });
    }
    
    const [result] = await db.promise().query(query, [id]);
    
    if (result.affectedRows === 0) {
      return res.json({
        success: false,
        message: 'Content not found'
      });
    }
    
    res.json({
      success: true,
      message: `${type} deleted successfully`
    });
  } catch (error) {
    console.error('[CONTENT DELETE] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to delete content'
    });
  }
});

// =============================================
// BULK ACTIONS
// =============================================
router.post('/bulk', async (req, res) => {
  try {
    const { action, type, contentIds } = req.body;
    
    if (!action || !type || !contentIds || !Array.isArray(contentIds)) {
      return res.json({
        success: false,
        message: 'Invalid bulk action request'
      });
    }
    
    let table = '';
    switch (type) {
      case 'blog':
        table = 'blog_articles';
        break;
      case 'case_study':
        table = 'case_studies';
        break;
      case 'quick_link':
        table = 'quick_links';
        break;
      case 'team_member':
        table = 'team_members';
        break;
      default:
        return res.json({
          success: false,
          message: 'Invalid content type'
        });
    }
    
    let query = '';
    let params = contentIds;
    
    switch (action) {
      case 'delete':
        query = `UPDATE ${table} SET deleted_at = NOW() WHERE id IN (${contentIds.map(() => '?').join(',')})`;
        break;
      
      case 'publish':
        query = `UPDATE ${table} SET status = 'published', updated_at = NOW() WHERE id IN (${contentIds.map(() => '?').join(',')})`;
        break;
      
      case 'archive':
        query = `UPDATE ${table} SET status = 'archived', updated_at = NOW() WHERE id IN (${contentIds.map(() => '?').join(',')})`;
        break;
      
      case 'feature':
        query = `UPDATE ${table} SET is_featured = 1, updated_at = NOW() WHERE id IN (${contentIds.map(() => '?').join(',')})`;
        break;
      
      case 'unfeature':
        query = `UPDATE ${table} SET is_featured = 0, updated_at = NOW() WHERE id IN (${contentIds.map(() => '?').join(',')})`;
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
    console.error('[CONTENT BULK] Error:', error.message);
    res.json({
      success: false,
      message: 'Failed to perform bulk action'
    });
  }
});

module.exports = router;