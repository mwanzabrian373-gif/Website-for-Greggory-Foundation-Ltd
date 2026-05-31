-- =============================================
-- DATABASE TABLES UPDATE FOR ENHANCED USER MANAGEMENT
-- Project Management Consultancy Website
-- =============================================

USE greggory_foundation_db_main;

-- =============================================
-- UPDATE ADMIN_USERS TABLE
-- =============================================

-- Add missing columns if they don't exist
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS display_name VARCHAR(255) DEFAULT NULL AFTER last_name,
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20) DEFAULT NULL AFTER email,
ADD COLUMN IF NOT EXISTS department VARCHAR(100) DEFAULT 'General' AFTER admin_level,
ADD COLUMN IF NOT EXISTS access_level VARCHAR(50) DEFAULT 'full' AFTER department,
ADD COLUMN IF NOT EXISTS profile_image_id INT DEFAULT NULL AFTER department,
ADD COLUMN IF NOT EXISTS last_login_ip VARCHAR(45) DEFAULT NULL AFTER last_login_at,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL AFTER updated_at,
ADD INDEX IF NOT EXISTS idx_admin_email (email),
ADD INDEX IF NOT EXISTS idx_admin_deleted (deleted_at);

-- Add foreign key constraint for profile images
ALTER TABLE admin_users 
ADD CONSTRAINT fk_admin_profile_image 
FOREIGN KEY (profile_image_id) REFERENCES images(id) ON DELETE SET NULL;

-- =============================================
-- UPDATE DEVELOPER_USERS TABLE
-- =============================================

-- Add missing columns if they don't exist
ALTER TABLE developer_users 
ADD COLUMN IF NOT EXISTS display_name VARCHAR(255) DEFAULT NULL AFTER last_name,
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20) DEFAULT NULL AFTER email,
ADD COLUMN IF NOT EXISTS github_username VARCHAR(100) DEFAULT NULL AFTER specialization,
ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(255) DEFAULT NULL AFTER github_username,
ADD COLUMN IF NOT EXISTS profile_image_id INT DEFAULT NULL AFTER team_id,
ADD COLUMN IF NOT EXISTS access_level VARCHAR(50) DEFAULT 'limited' AFTER tech_stack,
ADD COLUMN IF NOT EXISTS last_login_ip VARCHAR(45) DEFAULT NULL AFTER last_login_at,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL AFTER updated_at,
ADD INDEX IF NOT EXISTS idx_developer_email (email),
ADD INDEX IF NOT EXISTS idx_developer_deleted (deleted_at);

-- Add foreign key constraint for profile images
ALTER TABLE developer_users 
ADD CONSTRAINT fk_developer_profile_image 
FOREIGN KEY (profile_image_id) REFERENCES images(id) ON DELETE SET NULL;

-- =============================================
-- UPDATE USERS TABLE (Regular Users)
-- =============================================

-- Add missing columns if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS display_name VARCHAR(255) DEFAULT NULL AFTER last_name,
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20) DEFAULT NULL AFTER email,
ADD COLUMN IF NOT EXISTS primary_role VARCHAR(50) DEFAULT 'user' AFTER email,
ADD COLUMN IF NOT EXISTS department VARCHAR(100) DEFAULT NULL AFTER primary_role,
ADD COLUMN IF NOT EXISTS job_id INT DEFAULT NULL AFTER department,
ADD COLUMN IF NOT EXISTS profile_image_id INT DEFAULT NULL AFTER job_id,
ADD COLUMN IF NOT EXISTS last_login_ip VARCHAR(45) DEFAULT NULL AFTER last_login,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL AFTER updated_at,
ADD INDEX IF NOT EXISTS idx_users_email (email),
ADD INDEX IF NOT EXISTS idx_users_deleted (deleted_at),
ADD INDEX IF NOT EXISTS idx_users_role (primary_role);

-- Add foreign key constraint for profile images
ALTER TABLE users 
ADD CONSTRAINT fk_user_profile_image 
FOREIGN KEY (profile_image_id) REFERENCES images(id) ON DELETE SET NULL;

-- Add foreign key constraint for team members
ALTER TABLE users 
ADD CONSTRAINT fk_user_job 
FOREIGN KEY (job_id) REFERENCES team_members(id) ON DELETE SET NULL;

-- =============================================
-- CREATE ACTIVITY LOGS TABLE (if doesn't exist)
-- =============================================

CREATE TABLE IF NOT EXISTS user_activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  user_type ENUM('admin', 'developer', 'user') NOT NULL,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE,
  INDEX idx_activity_user (user_id),
  INDEX idx_activity_type (user_type),
  INDEX idx_activity_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- CREATE USER NOTIFICATIONS TABLE (if doesn't exist)
-- =============================================

CREATE TABLE IF NOT EXISTS user_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type ENUM('info', 'warning', 'success', 'error') DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE,
  INDEX idx_notification_user (user_id),
  INDEX idx_notification_read (is_read),
  INDEX idx_notification_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- CREATE PROJECT_ASSIGNMENTS TABLE (if doesn't exist)
-- =============================================

CREATE TABLE IF NOT EXISTS project_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  user_type ENUM('admin', 'developer', 'user') NOT NULL,
  project_role ENUM('Project Manager', 'Developer', 'Designer', 'QA', 'Client', 'Consultant') DEFAULT 'Consultant',
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by INT,
  status ENUM('active', 'completed', 'removed') DEFAULT 'active',
  FOREIGN KEY (assigned_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_assignment_project (project_id),
  INDEX idx_assignment_user (user_id),
  INDEX idx_assignment_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- CREATE USER_PERMISSIONS TABLE (if doesn't exist)
-- =============================================

CREATE TABLE IF NOT EXISTS user_permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  user_type ENUM('admin', 'developer', 'user') NOT NULL,
  permission_name VARCHAR(255) NOT NULL,
  permission_value ENUM('read', 'write', 'admin', 'none') DEFAULT 'none',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_permission (user_id, user_type, permission_name),
  FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE,
  INDEX idx_permission_user (user_id),
  INDEX idx_permission_type (user_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- INSERT DEFAULT PERMISSIONS
-- =============================================

-- Insert default permissions for admins
INSERT INTO user_permissions (user_id, user_type, permission_name, permission_value)
SELECT id, 'admin', 'users.manage', 'admin' FROM admin_users WHERE deleted_at IS NULL AND admin_level = 'super_admin'
ON DUPLICATE KEY UPDATE permission_value = 'admin';

INSERT INTO user_permissions (user_id, user_type, permission_name, permission_value)
SELECT id, 'admin', 'projects.manage', 'admin' FROM admin_users WHERE deleted_at IS NULL AND admin_level = 'super_admin'
ON DUPLICATE KEY UPDATE permission_value = 'admin';

INSERT INTO user_permissions (user_id, user_type, permission_name, permission_value)
SELECT id, 'admin', 'content.manage', 'admin' FROM admin_users WHERE deleted_at IS NULL AND admin_level = 'super_admin'
ON DUPLICATE KEY UPDATE permission_value = 'admin';

-- Insert default permissions for regular admins
INSERT INTO user_permissions (user_id, user_type, permission_name, permission_value)
SELECT id, 'admin', 'users.view', 'read' FROM admin_users WHERE deleted_at IS NULL AND admin_level = 'admin'
ON DUPLICATE KEY UPDATE permission_value = 'read';

INSERT INTO user_permissions (user_id, user_type, permission_name, permission_value)
SELECT id, 'admin', 'projects.view', 'read' FROM admin_users WHERE deleted_at IS NULL AND admin_level = 'admin'
ON DUPLICATE KEY UPDATE permission_value = 'read';

-- =============================================
-- CREATE TRIGGERS FOR ACTIVITY LOGGING
-- =============================================

DELIMITER $$

-- Trigger for admin_users activity logging
DROP TRIGGER IF EXISTS tr_admin_users_insert$$
CREATE TRIGGER tr_admin_users_insert
AFTER INSERT ON admin_users
FOR EACH ROW
BEGIN
    INSERT INTO user_activity_logs (user_id, user_type, action, details, ip_address)
    VALUES (NEW.id, 'admin', 'User Created', CONCAT('New admin user created: ', NEW.email, ' (', NEW.first_name, ' ', NEW.last_name, ')'), NULL);
END$$

DROP TRIGGER IF EXISTS tr_admin_users_update$$
CREATE TRIGGER tr_admin_users_update
AFTER UPDATE ON admin_users
FOR EACH ROW
BEGIN
    INSERT INTO user_activity_logs (user_id, user_type, action, details, ip_address)
    VALUES (NEW.id, 'admin', 'User Updated', CONCAT('Admin user updated: ', NEW.email), NULL);
END$$

-- Trigger for developer_users activity logging
DROP TRIGGER IF EXISTS tr_developer_users_insert$$
CREATE TRIGGER tr_developer_users_insert
AFTER INSERT ON developer_users
FOR EACH ROW
BEGIN
    INSERT INTO user_activity_logs (user_id, user_type, action, details, ip_address)
    VALUES (NEW.id, 'developer', 'User Created', CONCAT('New developer user created: ', NEW.email, ' (', NEW.first_name, ' ', NEW.last_name, ')'), NULL);
END$$

DELIMITER ;

-- =============================================
-- CREATE STORED PROCEDURES FOR USER MANAGEMENT
-- =============================================

DELIMITER $$

-- Procedure to get all users with statistics
DROP PROCEDURE IF EXISTS sp_get_all_users_with_stats$$
CREATE PROCEDURE sp_get_all_users_with_stats()
BEGIN
    SELECT 
        'admin' as user_type,
        COUNT(*) as total,
        SUM(is_active) as active,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN 1 END) as new_this_month
    FROM admin_users
    WHERE deleted_at IS NULL
    
    UNION ALL
    
    SELECT 
        'developer' as user_type,
        COUNT(*) as total,
        SUM(is_active) as active,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN 1 END) as new_this_month
    FROM developer_users
    WHERE deleted_at IS NULL
    
    UNION ALL
    
    SELECT 
        'user' as user_type,
        COUNT(*) as total,
        SUM(is_active) as active,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN 1 END) as new_this_month
    FROM users;
END$$

-- Procedure to update user status
DROP PROCEDURE IF EXISTS sp_update_user_status$$
CREATE PROCEDURE sp_update_user_status(
    IN p_user_id INT,
    IN p_user_type VARCHAR(50),
    IN p_is_active BOOLEAN
)
BEGIN
    IF p_user_type = 'admin' THEN
        UPDATE admin_users SET is_active = p_is_active, updated_at = NOW() WHERE id = p_user_id;
    ELSEIF p_user_type = 'developer' THEN
        UPDATE developer_users SET is_active = p_is_active, updated_at = NOW() WHERE id = p_user_id;
    ELSE
        UPDATE users SET is_active = p_is_active, updated_at = NOW() WHERE id = p_user_id;
    END IF;
END$$

-- Procedure to soft delete user
DROP PROCEDURE IF EXISTS sp_soft_delete_user$$
CREATE PROCEDURE sp_soft_delete_user(
    IN p_user_id INT,
    IN p_user_type VARCHAR(50)
)
BEGIN
    IF p_user_type = 'admin' THEN
        UPDATE admin_users SET deleted_at = NOW(), is_active = 0 WHERE id = p_user_id;
    ELSEIF p_user_type = 'developer' THEN
        UPDATE developer_users SET deleted_at = NOW(), is_active = 0 WHERE id = p_user_id;
    ELSE
        DELETE FROM users WHERE id = p_user_id;
    END IF;
END$$

DELIMITER ;

-- =============================================
-- CREATE VIEWS FOR Easier DATA Access
-- =============================================

-- View for all users (combined)
CREATE OR REPLACE VIEW v_all_users AS
SELECT 
    id,
    email,
    first_name,
    last_name,
    display_name,
    'admin' as user_type,
    admin_level as primary_role,
    department,
    is_active,
    last_login_at,
    last_login_ip,
    created_at,
    updated_at
FROM admin_users
WHERE deleted_at IS NULL

UNION ALL

SELECT 
    id,
    email,
    first_name,
    last_name,
    display_name,
    'developer' as user_type,
    developer_level as primary_role,
    specialization as department,
    is_active,
    last_login_at,
    last_login_ip,
    created_at,
    updated_at
FROM developer_users
WHERE deleted_at IS NULL

UNION ALL

SELECT 
    id,
    email,
    first_name,
    last_name,
    display_name,
    'user' as user_type,
    primary_role,
    department,
    is_active,
    last_login as last_login_at,
    last_login_ip,
    created_at,
    updated_at
FROM users
WHERE deleted_at IS NULL;

-- View for user statistics
CREATE OR REPLACE VIEW v_user_statistics AS
SELECT 
    'total_users' as stat_name,
    (SELECT COUNT(*) FROM admin_users WHERE deleted_at IS NULL) + 
    (SELECT COUNT(*) FROM developer_users WHERE deleted_at IS NULL) + 
    (SELECT COUNT(*) FROM users) as stat_value
    
UNION ALL

SELECT 
    'active_users' as stat_name,
    (SELECT SUM(is_active) FROM admin_users WHERE deleted_at IS NULL) + 
    (SELECT SUM(is_active) FROM developer_users WHERE deleted_at IS NULL) + 
    (SELECT SUM(is_active) FROM users) as stat_value
    
UNION ALL

SELECT 
    'admins' as stat_name,
    (SELECT COUNT(*) FROM admin_users WHERE deleted_at IS NULL) as stat_value
    
UNION ALL

SELECT 
    'developers' as stat_name,
    (SELECT COUNT(*) FROM developer_users WHERE deleted_at IS NULL) as stat_value
    
UNION ALL

SELECT 
    'clients' as stat_name,
    (SELECT COUNT(*) FROM users) as stat_value;

-- =============================================
-- FINAL VERIFICATION
-- =============================================

-- Display table information
SELECT 
    'Table Updates Completed' as status,
    TABLE_NAME,
    TABLE_ROWS,
    CREATE_TIME,
    UPDATE_TIME
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'greggory_foundation_db_main'
AND TABLE_NAME IN ('admin_users', 'developer_users', 'users', 'user_activity_logs', 'user_notifications', 'project_assignments', 'user_permissions')
ORDER BY TABLE_NAME;

SELECT '✅ Database tables updated successfully for enhanced user management!' as message;