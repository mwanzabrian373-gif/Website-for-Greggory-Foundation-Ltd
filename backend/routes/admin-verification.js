/**
 * AUTH PROTOCOL - ADMIN ONLY
 * This file MUST ONLY reference the `admin_users` table.
 * NEVER query users or developer_users tables from this file.
 * See AUTH_PROTOCOL.md for full specification.
 */
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcryptjs');
const { authEndpointValidator } = require('../middleware/authEndpointValidator');

// Apply endpoint validation middleware to admin routes
router.use(authEndpointValidator('admin', 'admin_users'));

// Admin Authentication - LOGIN
router.post('/authenticate-enhanced', (req, res) => {
  console.log('[AUTH] Login attempt:', req.body.email);
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password required'
    });
  }
  
  db.query(
    `SELECT au.*, i.data as profile_photo_blob, i.content_type as profile_photo_type 
     FROM admin_users au 
     LEFT JOIN images i ON i.id = au.profile_image_id
     WHERE au.email = ? AND au.is_active = true AND au.deleted_at IS NULL`,
    [email],
    (err, results) => {
      if (err) {
        console.error('[AUTH] DB Error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message
        });
      }
      
      if (results.length === 0) {
        console.log('[AUTH] User not found:', email);
        return res.status(401).json({
          success: false,
          message: 'Admin user not found',
          step: 'user_not_found'
        });
      }
      
      const user = results[0];
      console.log('[AUTH] User found, checking password...');
      
      bcrypt.compare(password, user.password_hash, (err, isValid) => {
        if (err) {
          console.error('[AUTH] Password compare error:', err);
          return res.status(500).json({
            success: false,
            message: 'Password verification failed'
          });
        }
        
        if (!isValid) {
          console.log('[AUTH] Invalid password for:', email);
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials',
            step: 'password_invalid'
          });
        }
        
        db.query(
          'UPDATE admin_users SET last_login_at = NOW(), last_login_ip = ? WHERE id = ?',
          [req.ip || 'unknown', user.id]
        );
        
        console.log('[AUTH] SUCCESS:', email);
        
        // Convert blob to base64 data URI
        let profilePhotoData = null;
        if (user.profile_photo_blob) {
          const base64 = Buffer.from(user.profile_photo_blob).toString('base64');
          const mimeType = user.profile_photo_type || 'image/jpeg';
          profilePhotoData = `data:${mimeType};base64,${base64}`;
        }
        
        res.json({
          success: true,
          message: 'Admin authentication successful',
          user: {
            id: user.id,
            email: user.email,
            name: user.display_name || `${user.first_name} ${user.last_name}`,
            admin_level: user.admin_level,
            role_type: 'admin',
            profilePhotoData: profilePhotoData,
            profile_image_id: user.profile_image_id
          },
          token: `admin-session-${Date.now()}-${user.id}`
        });
      });
    }
  );
});

// Get admin profile
router.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  
  db.query(
    'SELECT id, email, first_name, last_name, display_name, admin_level, department, profile_image_id, created_at FROM admin_users WHERE id = ?',
    [id],
    (err, results) => {
      if (err) {
        console.error('[PROFILE] Error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'Admin not found' });
      }
      
      res.json({ success: true, user: results[0] });
    }
  );
});

// Update admin profile
router.put('/profile/:id', (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, display_name, department, profile_image_id } = req.body;
  
  const updates = [];
  const values = [];
  
  if (first_name !== undefined) { updates.push('first_name = ?'); values.push(first_name); }
  if (last_name !== undefined) { updates.push('last_name = ?'); values.push(last_name); }
  if (display_name !== undefined) { updates.push('display_name = ?'); values.push(display_name); }
  if (department !== undefined) { updates.push('department = ?'); values.push(department); }
  if (profile_image_id !== undefined) { updates.push('profile_image_id = ?'); values.push(profile_image_id); }
  
  if (updates.length === 0) {
    return res.status(400).json({ success: false, message: 'No fields to update' });
  }
  
  values.push(id);
  
  const query = `UPDATE admin_users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`;
  
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('[PROFILE UPDATE] Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    
    res.json({ success: true, message: 'Profile updated successfully' });
  });
});

// Get admin profile photo  
router.get('/profile/:id/photo', (req, res) => {
  const { id } = req.params;
  
  db.query(
    `SELECT i.data as profile_photo_blob, i.content_type as profile_photo_type 
     FROM admin_users au 
     LEFT JOIN images i ON i.id = au.profile_image_id 
     WHERE au.id = ?`,
    [id],
    (err, results) => {
      if (err) {
        console.error('[PROFILE PHOTO] Error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'Admin not found' });
      }
      
      const user = results[0];
      
      // Convert blob to base64 data URI
      let profilePhotoData = null;
      if (user.profile_photo_blob) {
        const base64 = Buffer.from(user.profile_photo_blob).toString('base64');
        const mimeType = user.profile_photo_type || 'image/jpeg';
        profilePhotoData = `data:${mimeType};base64,${base64}`;
      }
      
      res.json({ 
        success: true, 
        profile_photo: profilePhotoData 
      });
    }
  );
});

// Upload admin profile photo
router.post('/profile/:id/photo', (req, res) => {
  const { id } = req.params;
  const { dataBase64, contentType, fileName } = req.body;
  
  if (!dataBase64) {
    return res.status(400).json({ success: false, message: 'Missing image data' });
  }
  
  let buffer;
  try {
    buffer = Buffer.from(dataBase64, 'base64');
  } catch (e) {
    return res.status(400).json({ success: false, message: 'Invalid base64 image data' });
  }
  
  // Insert image into images table
  const imageQuery = `
    INSERT INTO images (owner_table, owner_id, purpose, filename, content_type, data)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.query(imageQuery, ['admin_users', id, 'profile_photo', fileName || 'profile.jpg', contentType || 'image/jpeg', buffer], (err, imageResult) => {
    if (err) {
      console.error('[PHOTO UPLOAD] Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to save photo' });
    }
    
    const imageId = imageResult.insertId;
    
    // Update admin profile with new image id
    db.query('UPDATE admin_users SET profile_image_id = ? WHERE id = ?', [imageId, id], (err) => {
      if (err) {
        console.error('[PHOTO UPDATE] Error:', err);
        return res.status(500).json({ success: false, message: 'Failed to update profile with photo' });
      }
      
      res.json({
        success: true,
        message: 'Profile photo updated successfully',
        image_id: imageId
      });
    });
  });
});

// Admin Search Endpoint
router.get('/search', (req, res) => {
  const { q } = req.query;
  
  if (!q || q.trim().length < 2) {
    return res.json({ success: true, results: [] });
  }
  
  const searchTerm = `%${q.trim()}%`;
  
  // Search admin users
  db.query(
    `SELECT 
      'user' as type,
      CONCAT(first_name, ' ', last_name) as title,
      email as description,
      id,
      'admin' as category
     FROM admin_users
     WHERE (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)
     LIMIT 10`,
    [searchTerm, searchTerm, searchTerm],
    (err, results) => {
      if (err) {
        console.error('[SEARCH] Error:', err);
        return res.json({ success: true, results: [] });
      }
      
      const formattedResults = (results || []).map(row => ({
        type: 'user',
        title: row.title,
        description: row.description,
        id: row.id,
        category: row.category
      }));
      
      res.json({ success: true, results: formattedResults, count: formattedResults.length });
    }
  );
});

// AUTH PROTOCOL: Admin/Developer registration
// Admins go to admin_users table, Developers go to developer_users table
router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, role, admin_level, developer_level, profile_image_id } = req.body;
    
    const userRole = role || 'admin';
    const tableName = userRole === 'developer' ? 'developer_users' : 'admin_users';
    
    console.log('[REGISTER] =========================================');
    console.log('[REGISTER] ROLE:', userRole);
    console.log('[REGISTER] TABLE:', tableName);
    console.log('[REGISTER] Data:', { email, first_name, last_name, profile_image_id });
    
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, password, first name and last name are required' 
      });
    }
    
    // Check if email exists in appropriate table
    const checkQuery = userRole === 'developer' 
      ? 'SELECT id FROM developer_users WHERE email = ? AND deleted_at IS NULL'
      : 'SELECT id FROM admin_users WHERE email = ? AND deleted_at IS NULL';
    
    db.query(checkQuery, [email], (err, results) => {
      if (err) {
        console.error('[REGISTER] Email check error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error during email check',
          error: err.message
        });
      }
      
      if (results.length > 0) {
        return res.status(400).json({
          success: false,
          message: `${userRole === 'admin' ? 'Admin' : 'Developer'} user with this email already exists`
        });
      }
      
      // Hash password
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.error('[REGISTER] Password hash error:', err);
          return res.status(500).json({
            success: false,
            message: 'Failed to hash password'
          });
        }
        
        const insertQuery = userRole === 'developer'
          ? `INSERT INTO developer_users (email, password_hash, first_name, last_name, developer_level, access_level, tech_stack, specialization, team_id, github_username, linkedin_url, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`
          : `INSERT INTO admin_users (email, password_hash, first_name, last_name, admin_level, access_level, department, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
        
        const insertValues = userRole === 'developer'
          ? [email, hash, first_name, last_name, developer_level || 'mid', 'limited', JSON.stringify([]), 'General', null, '', '', 1]
          : [email, hash, first_name, last_name, admin_level || 'admin', 'full', 'General', 1];
        
        db.query(insertQuery, insertValues, (err, result) => {
          if (err) {
            console.error('[REGISTER] Insert error:', err);
            return res.status(500).json({
              success: false,
              message: 'Failed to create user',
              error: err.message
            });
          }
          
          console.log('[REGISTER] User created successfully with ID:', result.insertId);
          
          res.status(201).json({
            success: true,
            message: `${userRole === 'admin' ? 'Admin' : 'Developer'} user created successfully`,
            userId: result.insertId,
            userRole: userRole
          });
        });
      });
    });
  } catch (error) {
    console.error('[REGISTER] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

module.exports = router;