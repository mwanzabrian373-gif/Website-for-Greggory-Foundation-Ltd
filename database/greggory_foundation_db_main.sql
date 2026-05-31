-- =====================================================
-- Complete Database Schema for Greggory Foundation
-- Database Name: greggory_foundation_db_main
-- =====================================================

-- Drop and create database
DROP DATABASE IF EXISTS greggory_foundation_db_main;
CREATE DATABASE greggory_foundation_db_main CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE greggory_foundation_db_main;

-- Enable strict mode
SET SQL_MODE = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- =====================================================
-- SECTION 1: BASE TABLES (No Foreign Key Dependencies)
-- =====================================================

-- =============================================
-- Table: images
-- Centralized image storage - MUST BE FIRST
-- =============================================
CREATE TABLE IF NOT EXISTS images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(512),
    file_type VARCHAR(100),
    file_size BIGINT,
    content_type VARCHAR(100),
    data LONGBLOB,
    alt_text VARCHAR(255),
    title VARCHAR(255),
    width INT,
    height INT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_images_filename (file_name),
    INDEX idx_images_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: roles
-- User roles and permissions
-- =============================================
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL,
    is_system_role BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_roles_name (name),
    INDEX idx_roles_system (is_system_role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default roles (ONCE - not duplicated)
INSERT INTO roles (id, name, description, is_system_role) VALUES 
(1, 'admin', 'Administrator account', 1),
(2, 'user', 'Regular user account', 1),
(3, 'developer', 'Developer account', 1);

-- =============================================
-- Table: team_members
-- Job/role definitions for users - REQUIRED by backend
-- =============================================
CREATE TABLE IF NOT EXISTS team_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_team_members_name (name),
    INDEX idx_team_members_role (role),
    INDEX idx_team_members_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default team member roles
INSERT INTO team_members (name, role, department) VALUES
('Project Manager', 'manager', 'Projects'),
('Site Supervisor', 'supervisor', 'Operations'),
('Engineer', 'engineer', 'Technical'),
('Consultant', 'consultant', 'Consulting'),
('Field Worker', 'field_worker', 'Operations'),
('Administrator', 'admin', 'Administration'),
('Developer', 'developer', 'Technology');

-- =============================================
-- Table: users
-- Regular user accounts
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255) DEFAULT NULL,
    email_verification_expires DATETIME DEFAULT NULL,
    password_hash VARCHAR(255) DEFAULT NULL,
    password_reset_token VARCHAR(255) DEFAULT NULL,
    password_reset_expires DATETIME DEFAULT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(200) DEFAULT NULL,
    phone_number VARCHAR(50),
    profile_photo_id BIGINT DEFAULT NULL,
    profile_photo_blob LONGBLOB NULL DEFAULT NULL,
    profile_photo_mime_type VARCHAR(100) NULL DEFAULT NULL,
    profile_photo_file_name VARCHAR(255) NULL DEFAULT NULL,
    job_id BIGINT DEFAULT NULL,
    primary_role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP NULL DEFAULT NULL,
    last_login_ip VARCHAR(45) DEFAULT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    locale VARCHAR(10) DEFAULT 'en-US',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    FOREIGN KEY (profile_photo_id) REFERENCES images(id) ON DELETE SET NULL,
    FOREIGN KEY (job_id) REFERENCES team_members(id) ON DELETE SET NULL,
    INDEX idx_users_email (email),
    INDEX idx_users_active (is_active, deleted_at),
    INDEX idx_users_name (first_name, last_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: admin_users
-- Admin authentication (per AUTH_PROTOCOL.md)
-- =============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255) DEFAULT NULL,
    email_verification_expires DATETIME DEFAULT NULL,
    password_hash VARCHAR(255) DEFAULT NULL,
    password_reset_token VARCHAR(255) DEFAULT NULL,
    password_reset_expires DATETIME DEFAULT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(200) DEFAULT NULL,
    phone_number VARCHAR(50),
    profile_photo_id BIGINT DEFAULT NULL,
    profile_photo_blob LONGBLOB NULL DEFAULT NULL,
    profile_photo_mime_type VARCHAR(100) NULL DEFAULT NULL,
    profile_photo_file_name VARCHAR(255) NULL DEFAULT NULL,
    profile_image_id BIGINT DEFAULT NULL,
    admin_level ENUM('super_admin', 'admin', 'moderator') DEFAULT 'admin',
    admin_permissions JSON,
    access_level ENUM('full', 'limited', 'read_only') DEFAULT 'full',
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP NULL DEFAULT NULL,
    last_login_ip VARCHAR(45) DEFAULT NULL,
    failed_login_attempts INT DEFAULT 0,
    account_locked_until TIMESTAMP NULL DEFAULT NULL,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255) DEFAULT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    locale VARCHAR(10) DEFAULT 'en-US',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    FOREIGN KEY (profile_photo_id) REFERENCES images(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    FOREIGN KEY (deleted_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_admin_users_email (email),
    INDEX idx_admin_users_active (is_active, deleted_at),
    INDEX idx_admin_users_level (admin_level),
    INDEX idx_admin_users_access (access_level),
    INDEX idx_admin_users_department (department),
    INDEX idx_admin_users_login (last_login_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: developer_users
-- Developer authentication (per AUTH_PROTOCOL.md)
-- =============================================
CREATE TABLE IF NOT EXISTS developer_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255) DEFAULT NULL,
    email_verification_expires DATETIME DEFAULT NULL,
    password_hash VARCHAR(255) DEFAULT NULL,
    password_reset_token VARCHAR(255) DEFAULT NULL,
    password_reset_expires DATETIME DEFAULT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(200) DEFAULT NULL,
    phone_number VARCHAR(50),
    profile_photo_id BIGINT DEFAULT NULL,
    profile_photo_blob LONGBLOB NULL DEFAULT NULL,
    profile_photo_mime_type VARCHAR(100) NULL DEFAULT NULL,
    profile_photo_file_name VARCHAR(255) NULL DEFAULT NULL,
    profile_image_id BIGINT DEFAULT NULL,
    developer_level ENUM('senior', 'mid', 'junior', 'lead') DEFAULT 'mid',
    tech_stack JSON,
    specialization VARCHAR(100),
    access_level ENUM('full', 'limited', 'read_only') DEFAULT 'limited',
    team_id BIGINT,
    github_username VARCHAR(100),
    linkedin_url VARCHAR(512),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP NULL DEFAULT NULL,
    last_login_ip VARCHAR(45) DEFAULT NULL,
    failed_login_attempts INT DEFAULT 0,
    account_locked_until TIMESTAMP NULL DEFAULT NULL,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255) DEFAULT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    locale VARCHAR(10) DEFAULT 'en-US',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    FOREIGN KEY (profile_photo_id) REFERENCES images(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    FOREIGN KEY (deleted_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_developer_users_email (email),
    INDEX idx_developer_users_active (is_active, deleted_at),
    INDEX idx_developer_users_level (developer_level),
    INDEX idx_developer_users_stack (specialization),
    INDEX idx_developer_users_team (team_id),
    INDEX idx_developer_users_login (last_login_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: companies
-- =============================================
CREATE TABLE IF NOT EXISTS companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    logo_id BIGINT,
    website_url VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    FOREIGN KEY (logo_id) REFERENCES images(id) ON DELETE SET NULL,
    INDEX idx_companies_slug (slug),
    INDEX idx_companies_active (is_active, deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SECTION 2: USER-RELATED TABLES (Reference users)
-- =====================================================

-- =============================================
-- Table: user_roles
-- =============================================
CREATE TABLE IF NOT EXISTS user_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_role (user_id, role_id),
    INDEX idx_user_roles_user (user_id),
    INDEX idx_user_roles_role (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: properties
-- =============================================
CREATE TABLE IF NOT EXISTS properties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT,
    property_type ENUM('apartment', 'house', 'villa', 'commercial', 'land', 'office') NOT NULL,
    status ENUM('available', 'rented', 'maintenance', 'unavailable') DEFAULT 'available',
    bedrooms INT DEFAULT 0,
    bathrooms INT DEFAULT 0,
    square_meters DECIMAL(10,2),
    price_per_month DECIMAL(10,2),
    location_address VARCHAR(255),
    location_city VARCHAR(100),
    location_country VARCHAR(100),
    featured_image_id BIGINT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (featured_image_id) REFERENCES images(id) ON DELETE SET NULL,
    INDEX idx_properties_company (company_id, status),
    INDEX idx_properties_type (property_type, status),
    INDEX idx_properties_featured (is_featured, status),
    INDEX idx_properties_location (location_city, location_country)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: contact_forms
-- =============================================
CREATE TABLE IF NOT EXISTS contact_forms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    subject VARCHAR(255),
    message LONGTEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_contact_forms_email (email, created_at),
    INDEX idx_contact_forms_read (is_read, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: user_projects
-- =============================================
CREATE TABLE IF NOT EXISTS user_projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    project_description LONGTEXT,
    project_type ENUM('consulting', 'development', 'design', 'marketing', 'management', 'other') DEFAULT 'consulting',
    status ENUM('planning', 'in_progress', 'completed', 'on_hold', 'cancelled') DEFAULT 'planning',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    start_date DATE,
    end_date DATE,
    estimated_budget DECIMAL(12,2),
    actual_budget DECIMAL(12,2),
    client_id BIGINT,
    client_name VARCHAR(255),
    client_email VARCHAR(255),
    client_phone VARCHAR(50),
    project_manager_id BIGINT,
    team_members JSON,
    deliverables JSON,
    milestones JSON,
    documents JSON,
    progress_percentage INT DEFAULT 0,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (project_manager_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_projects_user (user_id, status),
    INDEX idx_user_projects_client_id (client_id),
    INDEX idx_user_projects_client (client_name),
    INDEX idx_user_projects_status (status, priority),
    INDEX idx_user_projects_dates (start_date, end_date),
    INDEX idx_user_projects_active (is_active, deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: project_tasks (user_projects version)
-- =============================================
CREATE TABLE IF NOT EXISTS project_tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    task_description TEXT,
    assigned_to BIGINT,
    status ENUM('not_started', 'in_progress', 'completed', 'blocked', 'cancelled') DEFAULT 'not_started',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    due_date DATETIME,
    completed_at TIMESTAMP NULL DEFAULT NULL,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    dependencies JSON,
    attachments JSON,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    FOREIGN KEY (project_id) REFERENCES user_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_project_tasks_project (project_id, status),
    INDEX idx_project_tasks_assigned (assigned_to, status),
    INDEX idx_project_tasks_due (due_date, status),
    INDEX idx_project_tasks_priority (priority, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: project_documents (user_projects version)
-- =============================================
CREATE TABLE IF NOT EXISTS project_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    document_type ENUM('contract', 'proposal', 'report', 'invoice', 'image', 'video', 'document', 'other') DEFAULT 'document',
    file_path VARCHAR(512),
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_by BIGINT,
    is_public BOOLEAN DEFAULT FALSE,
    download_count INT DEFAULT 0,
    last_downloaded_at TIMESTAMP NULL DEFAULT NULL,
    description TEXT,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    FOREIGN KEY (project_id) REFERENCES user_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_project_documents_project (project_id, document_type),
    INDEX idx_project_documents_public (is_public, document_type),
    INDEX idx_project_documents_uploaded (uploaded_by, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: client_project_summary
-- =============================================
CREATE TABLE IF NOT EXISTS client_project_summary (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_projects INT DEFAULT 0,
    active_projects INT DEFAULT 0,
    completed_projects INT DEFAULT 0,
    total_budget DECIMAL(15,2) DEFAULT 0,
    total_spent DECIMAL(15,2) DEFAULT 0,
    average_project_duration INT DEFAULT 0,
    last_project_date TIMESTAMP NULL DEFAULT NULL,
    client_rating DECIMAL(3,2) DEFAULT 0,
    notes TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_client_summary_user (user_id),
    INDEX idx_client_summary_active (active_projects),
    INDEX idx_client_summary_updated (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: user_feedback
-- =============================================
CREATE TABLE IF NOT EXISTS user_feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NULL,
    user_id BIGINT,
    feedback_type ENUM('project_review', 'service_feedback', 'complaint', 'suggestion', 'testimonial', 'bug_report') DEFAULT 'project_review',
    rating INT CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    message TEXT NOT NULL,
    status ENUM('new', 'reviewed', 'responded', 'resolved', 'closed') DEFAULT 'new',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    admin_response TEXT,
    responded_by BIGINT NULL,
    responded_at TIMESTAMP NULL,
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    source ENUM('website', 'email', 'phone', 'in_person', 'social_media') DEFAULT 'website',
    ip_address VARCHAR(45),
    user_agent TEXT,
    attachment_url VARCHAR(512),
    attachment_type VARCHAR(100),
    internal_notes TEXT,
    assigned_to BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (deleted_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (responded_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_feedback_user (user_id),
    INDEX idx_feedback_type (feedback_type),
    INDEX idx_feedback_status (status),
    INDEX idx_feedback_priority (priority),
    INDEX idx_feedback_rating (rating),
    INDEX idx_feedback_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: mpesa_transactions
-- =============================================
CREATE TABLE IF NOT EXISTS mpesa_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NULL,
    project_id BIGINT NULL,
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    merchant_request_id VARCHAR(100),
    checkout_request_id VARCHAR(100),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KES',
    exchange_rate DECIMAL(10,6) DEFAULT 1.000000,
    amount_kes DECIMAL(15,2) GENERATED ALWAYS AS (amount * exchange_rate) STORED,
    phone_number VARCHAR(20) NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'cancelled', 'reversed') DEFAULT 'pending',
    result_code INT,
    result_desc VARCHAR(255),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completion_time TIMESTAMP NULL,
    response_data JSON,
    payment_method ENUM('paybill', 'till_number', 'buy_goods') DEFAULT 'paybill',
    business_number VARCHAR(20) DEFAULT '174379',
    account_reference VARCHAR(255),
    client_id BIGINT,
    client_name VARCHAR(255),
    client_email VARCHAR(255),
    reconciled BOOLEAN DEFAULT FALSE,
    reconciled_at TIMESTAMP NULL,
    reconciled_by BIGINT NULL,
    reconciliation_notes TEXT,
    is_refund BOOLEAN DEFAULT FALSE,
    original_transaction_id VARCHAR(100),
    refund_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (deleted_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (reconciled_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_mpesa_transaction_id (transaction_id),
    INDEX idx_mpesa_status (status),
    INDEX idx_mpesa_phone (phone_number),
    INDEX idx_mpesa_client (client_id),
    INDEX idx_mpesa_date (transaction_date),
    INDEX idx_mpesa_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SECTION 3: ADMIN/CONTENT TABLES
-- =====================================================

-- =============================================
-- Table: blog_articles
-- =============================================
CREATE TABLE IF NOT EXISTS blog_articles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    author VARCHAR(100),
    read_time VARCHAR(50),
    category VARCHAR(100),
    image_url VARCHAR(512),
    image_id BIGINT,
    icon_class VARCHAR(100),
    is_published BOOLEAN DEFAULT FALSE,
    published_date TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE SET NULL,
    INDEX idx_blog_articles_published (is_published, published_date),
    INDEX idx_blog_articles_category (category),
    INDEX idx_blog_articles_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: case_studies
-- =============================================
CREATE TABLE IF NOT EXISTS case_studies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    client VARCHAR(255),
    industry VARCHAR(255),
    challenge TEXT,
    solution LONGTEXT,
    results LONGTEXT,
    duration VARCHAR(100),
    image_urls JSON,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_case_studies_featured (is_featured),
    INDEX idx_case_studies_industry (industry),
    INDEX idx_case_studies_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: videos
-- =============================================
CREATE TABLE IF NOT EXISTS videos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_blob LONGBLOB NULL DEFAULT NULL,
    video_mime_type VARCHAR(100) NULL DEFAULT NULL,
    video_file_name VARCHAR(255) NULL DEFAULT NULL,
    video_size BIGINT NULL DEFAULT NULL,
    thumbnail_blob LONGBLOB NULL DEFAULT NULL,
    thumbnail_mime_type VARCHAR(100) NULL DEFAULT NULL,
    thumbnail_file_name VARCHAR(255) NULL DEFAULT NULL,
    video_url VARCHAR(512),
    thumbnail_url VARCHAR(512),
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_videos_active (is_active, display_order),
    INDEX idx_videos_featured (is_featured, display_order),
    INDEX idx_videos_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: admin_navbar_items
-- =============================================
CREATE TABLE IF NOT EXISTS admin_navbar_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    item_type ENUM('link', 'dropdown', 'button', 'separator') DEFAULT 'link',
    display_text VARCHAR(255) NOT NULL,
    url VARCHAR(512),
    icon_class VARCHAR(100),
    parent_id BIGINT NULL DEFAULT NULL,
    sort_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    target_blank BOOLEAN DEFAULT FALSE,
    css_class VARCHAR(255),
    requires_auth BOOLEAN DEFAULT FALSE,
    required_role VARCHAR(50),
    mobile_only BOOLEAN DEFAULT FALSE,
    desktop_only BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    FOREIGN KEY (parent_id) REFERENCES admin_navbar_items(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_admin_navbar_parent (parent_id, sort_order),
    INDEX idx_admin_navbar_visible (is_visible, is_active, sort_order),
    INDEX idx_admin_navbar_type (item_type, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: admin_website_settings
-- =============================================
CREATE TABLE IF NOT EXISTS admin_website_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(255) NOT NULL UNIQUE,
    setting_value LONGTEXT,
    setting_type ENUM('text', 'textarea', 'number', 'boolean', 'json', 'file') DEFAULT 'text',
    display_name VARCHAR(255),
    description TEXT,
    category VARCHAR(100) DEFAULT 'general',
    is_public BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    validation_rules JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by BIGINT,
    INDEX idx_admin_settings_key (setting_key),
    INDEX idx_admin_settings_category (category, sort_order),
    INDEX idx_admin_settings_public (is_public, category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: admin_activity_logs
-- =============================================
CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_user_id BIGINT NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    action_description TEXT,
    affected_table VARCHAR(100),
    affected_record_id BIGINT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_admin_activity_admin (admin_user_id, created_at),
    INDEX idx_admin_activity_action (action_type, created_at),
    INDEX idx_admin_activity_table (affected_table, created_at),
    INDEX idx_admin_activity_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SECTION 4: PROJECT MANAGEMENT TABLES
-- =====================================================

-- =============================================
-- Table: projects (main project management)
-- =============================================
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('active', 'completed', 'pending', 'on_hold', 'cancelled') DEFAULT 'active',
    progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    start_date DATE NOT NULL,
    expected_completion DATE NOT NULL,
    actual_completion DATE NULL,
    client_id BIGINT,
    client_name VARCHAR(255) NOT NULL,
    client_contact VARCHAR(255),
    location VARCHAR(500),
    project_type VARCHAR(100),
    budget DECIMAL(12,2) DEFAULT 0.00,
    spent DECIMAL(12,2) DEFAULT 0.00,
    remaining DECIMAL(12,2) GENERATED ALWAYS AS (budget - spent) STORED,
    currency VARCHAR(3) DEFAULT 'USD',
    project_manager_id BIGINT,
    team_lead_id BIGINT,
    team_size INT DEFAULT 0,
    main_photo_data LONGBLOB NULL,
    main_photo_name VARCHAR(255) NULL,
    main_photo_type VARCHAR(100) NULL,
    main_photo_size BIGINT NULL,
    cover_photo_data LONGBLOB NULL,
    cover_photo_name VARCHAR(255) NULL,
    cover_photo_type VARCHAR(100) NULL,
    cover_photo_size BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_projects_status (status),
    INDEX idx_projects_client_id (client_id),
    INDEX idx_projects_client (client_name),
    INDEX idx_projects_manager (project_manager_id),
    INDEX idx_projects_dates (start_date, expected_completion),
    INDEX idx_projects_created (created_at),
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (project_manager_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (team_lead_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (deleted_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: project_team_members
-- =============================================
CREATE TABLE IF NOT EXISTS project_team_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(100) NOT NULL DEFAULT 'team_member',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by BIGINT NOT NULL,
    removed_at TIMESTAMP NULL DEFAULT NULL,
    removed_by BIGINT DEFAULT NULL,
    INDEX idx_project_team_project (project_id),
    INDEX idx_project_team_user (user_id),
    INDEX idx_project_team_role (role),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (removed_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_project_user (project_id, user_id, removed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: project_photos
-- =============================================
CREATE TABLE IF NOT EXISTS project_photos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    photo_data LONGBLOB NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    photo_type ENUM('main', 'cover', 'progress', 'team', 'site', 'completion', 'screenshot', 'document') DEFAULT 'progress',
    title VARCHAR(255),
    description TEXT,
    display_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    INDEX idx_project_photos_project (project_id),
    INDEX idx_project_photos_type (photo_type),
    INDEX idx_project_photos_featured (is_featured),
    INDEX idx_project_photos_order (display_order),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: project_activities
-- =============================================
CREATE TABLE IF NOT EXISTS project_activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    activity_type ENUM('update', 'milestone', 'alert', 'note', 'status_change', 'team_change', 'photo_added', 'document_uploaded') DEFAULT 'update',
    message TEXT NOT NULL,
    details JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    INDEX idx_project_activities_project (project_id),
    INDEX idx_project_activities_user (user_id),
    INDEX idx_project_activities_type (activity_type),
    INDEX idx_project_activities_created (created_at),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: project_expenses
-- =============================================
CREATE TABLE IF NOT EXISTS project_expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    description VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    expense_date DATE NOT NULL,
    vendor VARCHAR(255),
    receipt_number VARCHAR(100),
    receipt_image_id BIGINT NULL,
    approved_by BIGINT,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    INDEX idx_project_expenses_project (project_id),
    INDEX idx_project_expenses_category (category),
    INDEX idx_project_expenses_date (expense_date),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (receipt_image_id) REFERENCES images(id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: project_invoices
-- =============================================
CREATE TABLE IF NOT EXISTS project_invoices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    client_id BIGINT,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    client_name VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    amount_kes DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    currency_code VARCHAR(3) NOT NULL DEFAULT 'KES',
    exchange_rate DECIMAL(10,6) DEFAULT 1.000000,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled') DEFAULT 'draft',
    description TEXT,
    terms TEXT,
    notes TEXT,
    paid_amount DECIMAL(12,2) DEFAULT 0.00,
    paid_amount_kes DECIMAL(12,2) DEFAULT 0.00,
    paid_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    updated_by BIGINT,
    INDEX idx_project_invoices_project (project_id),
    INDEX idx_project_invoices_client (client_id),
    INDEX idx_project_invoices_number (invoice_number),
    INDEX idx_project_invoices_status (status),
    INDEX idx_project_invoices_dates (issue_date, due_date),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: project_documents (projects version)
-- =============================================
CREATE TABLE IF NOT EXISTS project_docs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT,
    category VARCHAR(100) DEFAULT 'general',
    file_path VARCHAR(512) NOT NULL,
    file_data LONGBLOB NULL,
    description TEXT,
    version VARCHAR(20) DEFAULT '1.0',
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_project_docs_project (project_id),
    INDEX idx_project_docs_category (category),
    INDEX idx_project_docs_type (file_type),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: project_reports
-- =============================================
CREATE TABLE IF NOT EXISTS project_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    report_type ENUM('progress', 'financial', 'inspection', 'milestone', 'final', 'custom') DEFAULT 'progress',
    content LONGTEXT,
    summary TEXT,
    file_path VARCHAR(512),
    file_data LONGBLOB,
    file_type VARCHAR(50),
    file_size BIGINT,
    report_date DATE NOT NULL,
    period_start DATE,
    period_end DATE,
    download_count INT DEFAULT 0,
    generated_by BIGINT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    template_version VARCHAR(20) DEFAULT '1.0',
    status ENUM('draft', 'final', 'archived') DEFAULT 'draft',
    is_public BOOLEAN DEFAULT TRUE,
    export_format ENUM('pdf', 'excel', 'csv', 'json') DEFAULT 'pdf',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by BIGINT,
    INDEX idx_project_reports_project (project_id),
    INDEX idx_project_reports_type (report_type),
    INDEX idx_project_reports_date (report_date),
    INDEX idx_project_reports_status (status),
    INDEX idx_project_reports_generated (generated_at),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SECTION 5: FINANCIAL TABLES
-- =====================================================

-- =============================================
-- Table: accounting_entries
-- =============================================
CREATE TABLE IF NOT EXISTS accounting_entries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    entry_type ENUM('income', 'expense', 'budget_allocation', 'budget_adjustment', 'invoice_payment', 'refund') NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    amount DECIMAL(15,2) NOT NULL,
    tax_amount DECIMAL(15,2) DEFAULT 0.00,
    total_amount DECIMAL(15,2) GENERATED ALWAYS AS (amount + tax_amount) STORED,
    currency VARCHAR(3) DEFAULT 'USD',
    exchange_rate DECIMAL(10,6) DEFAULT 1.000000,
    amount_usd DECIMAL(15,2) GENERATED ALWAYS AS (total_amount * exchange_rate) STORED,
    transaction_date DATE NOT NULL,
    transaction_reference VARCHAR(255),
    payment_method ENUM('cash', 'bank_transfer', 'credit_card', 'debit_card', 'check', 'online_payment', 'other') DEFAULT 'bank_transfer',
    payment_status ENUM('pending', 'completed', 'failed', 'refunded', 'partially_refunded') DEFAULT 'completed',
    description TEXT NOT NULL,
    notes TEXT,
    internal_notes TEXT,
    invoice_id BIGINT NULL,
    receipt_id BIGINT NULL,
    contract_id BIGINT NULL,
    approved_by BIGINT NULL,
    approved_at TIMESTAMP NULL,
    approval_status ENUM('pending', 'approved', 'rejected', 'needs_revision') DEFAULT 'approved',
    rejection_reason TEXT,
    budget_category VARCHAR(100),
    budget_period VARCHAR(50),
    is_billable BOOLEAN DEFAULT TRUE,
    billable_percentage DECIMAL(5,2) DEFAULT 100.00,
    tax_rate DECIMAL(5,4) DEFAULT 0.0000,
    tax_exempt BOOLEAN DEFAULT FALSE,
    tax_region VARCHAR(100),
    reconciled BOOLEAN DEFAULT FALSE,
    reconciled_by BIGINT NULL,
    reconciled_at TIMESTAMP NULL,
    reconciliation_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_accounting_project (project_id),
    INDEX idx_accounting_type (entry_type),
    INDEX idx_accounting_category (category),
    INDEX idx_accounting_date (transaction_date),
    INDEX idx_accounting_status (payment_status),
    INDEX idx_accounting_approval (approval_status),
    INDEX idx_accounting_reconciled (reconciled),
    INDEX idx_accounting_created (created_at),
    INDEX idx_accounting_budget_period (budget_period),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (deleted_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (reconciled_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: accounting_categories
-- =============================================
CREATE TABLE IF NOT EXISTS accounting_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category_type ENUM('income', 'expense', 'both') DEFAULT 'expense',
    default_budget_percentage DECIMAL(5,2) DEFAULT 0.00,
    is_tax_deductible BOOLEAN DEFAULT FALSE,
    requires_approval BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    color_code VARCHAR(7) DEFAULT '#000000',
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by BIGINT,
    INDEX idx_accounting_categories_type (category_type),
    INDEX idx_accounting_categories_active (is_active),
    INDEX idx_accounting_categories_order (display_order),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: accounting_periods
-- =============================================
CREATE TABLE IF NOT EXISTS accounting_periods (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    period_name VARCHAR(100) NOT NULL,
    period_type ENUM('monthly', 'quarterly', 'yearly', 'custom') DEFAULT 'monthly',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_budget DECIMAL(15,2) DEFAULT 0.00,
    allocated_budget DECIMAL(15,2) DEFAULT 0.00,
    spent_budget DECIMAL(15,2) DEFAULT 0.00,
    remaining_budget DECIMAL(15,2) GENERATED ALWAYS AS (allocated_budget - spent_budget) STORED,
    status ENUM('planning', 'active', 'closed', 'archived') DEFAULT 'planning',
    locked BOOLEAN DEFAULT FALSE,
    description TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by BIGINT,
    INDEX idx_accounting_periods_project (project_id),
    INDEX idx_accounting_periods_dates (start_date, end_date),
    INDEX idx_accounting_periods_status (status),
    INDEX idx_accounting_periods_type (period_type),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: financial_reports
-- =============================================
CREATE TABLE IF NOT EXISTS financial_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    report_name VARCHAR(255) NOT NULL,
    report_type ENUM('profit_loss', 'balance_sheet', 'cash_flow', 'budget_variance', 'expense_breakdown', 'income_statement', 'custom') DEFAULT 'profit_loss',
    report_data LONGTEXT,
    summary TEXT,
    insights TEXT,
    report_date DATE NOT NULL,
    period_start DATE,
    period_end DATE,
    generated_by BIGINT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    template_version VARCHAR(20) DEFAULT '1.0',
    status ENUM('draft', 'final', 'archived') DEFAULT 'draft',
    is_public BOOLEAN DEFAULT TRUE,
    shared_with JSON,
    download_count INT DEFAULT 0,
    last_downloaded_at TIMESTAMP NULL,
    export_format ENUM('pdf', 'excel', 'csv', 'json') DEFAULT 'pdf',
    file_path VARCHAR(512),
    file_size BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by BIGINT,
    INDEX idx_financial_reports_project (project_id),
    INDEX idx_financial_reports_type (report_type),
    INDEX idx_financial_reports_date (report_date),
    INDEX idx_financial_reports_status (status),
    INDEX idx_financial_reports_generated (generated_at),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: invoices
-- =============================================
CREATE TABLE IF NOT EXISTS invoices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    client_id BIGINT,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    invoice_type ENUM('project_fee', 'milestone', 'expense', 'retainer', 'custom') DEFAULT 'project_fee',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    tax_rate DECIMAL(5,4) DEFAULT 0.0000,
    tax_amount DECIMAL(15,2) GENERATED ALWAYS AS (subtotal * tax_rate) STORED,
    total_amount DECIMAL(15,2) GENERATED ALWAYS AS (subtotal + tax_amount) STORED,
    currency VARCHAR(3) DEFAULT 'KES',
    exchange_rate DECIMAL(10,6) DEFAULT 1.000000,
    total_amount_kes DECIMAL(15,2) GENERATED ALWAYS AS (total_amount * exchange_rate) STORED,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE NULL,
    status ENUM('draft', 'sent', 'viewed', 'partial', 'paid', 'overdue', 'cancelled') DEFAULT 'draft',
    payment_status ENUM('pending', 'partial', 'paid', 'failed') DEFAULT 'pending',
    payment_method ENUM('mpesa', 'bank_transfer', 'cash', 'check', 'online_payment', 'other') DEFAULT 'mpesa',
    payment_phone VARCHAR(20) DEFAULT '+254799789956',
    payment_reference VARCHAR(255),
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_phone VARCHAR(20),
    client_address TEXT,
    items JSON,
    notes TEXT,
    payment_terms TEXT,
    terms_conditions TEXT,
    pdf_file_path VARCHAR(512),
    pdf_generated BOOLEAN DEFAULT FALSE,
    pdf_generated_at TIMESTAMP NULL,
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP NULL,
    email_opened BOOLEAN DEFAULT FALSE,
    email_opened_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_invoices_project (project_id),
    INDEX idx_invoices_client (client_id),
    INDEX idx_invoices_number (invoice_number),
    INDEX idx_invoices_status (status),
    INDEX idx_invoices_payment_status (payment_status),
    INDEX idx_invoices_dates (issue_date, due_date),
    INDEX idx_invoices_created (created_at),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (deleted_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: quotes
-- =============================================
CREATE TABLE IF NOT EXISTS quotes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NULL,
    client_id BIGINT NULL,
    quote_number VARCHAR(50) NOT NULL UNIQUE,
    quote_type ENUM('project_estimate', 'service_quote', 'product_quote', 'consultation', 'custom') DEFAULT 'project_estimate',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    tax_rate DECIMAL(5,4) DEFAULT 0.0000,
    tax_amount DECIMAL(15,2) GENERATED ALWAYS AS (subtotal * tax_rate) STORED,
    total_amount DECIMAL(15,2) GENERATED ALWAYS AS (subtotal + tax_amount) STORED,
    currency VARCHAR(3) DEFAULT 'KES',
    exchange_rate DECIMAL(10,6) DEFAULT 1.000000,
    total_amount_kes DECIMAL(15,2) GENERATED ALWAYS AS (total_amount * exchange_rate) STORED,
    issue_date DATE NOT NULL,
    valid_until DATE NOT NULL,
    accepted_date DATE NULL,
    rejected_date DATE NULL,
    status ENUM('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired', 'converted') DEFAULT 'draft',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    approved_by BIGINT NULL,
    approved_at TIMESTAMP NULL,
    approval_status ENUM('pending', 'approved', 'rejected', 'needs_revision') DEFAULT 'approved',
    rejection_reason TEXT,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_phone VARCHAR(20),
    client_address TEXT,
    client_company VARCHAR(255),
    items JSON,
    notes TEXT,
    payment_terms TEXT,
    terms_conditions TEXT,
    delivery_timeline TEXT,
    converted_to_invoice_id BIGINT NULL,
    converted_at TIMESTAMP NULL,
    conversion_notes TEXT,
    pdf_file_path VARCHAR(512),
    pdf_generated BOOLEAN DEFAULT FALSE,
    pdf_generated_at TIMESTAMP NULL,
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP NULL,
    email_opened BOOLEAN DEFAULT FALSE,
    email_opened_at TIMESTAMP NULL,
    follow_up_required BOOLEAN DEFAULT TRUE,
    follow_up_date DATE NULL,
    follow_up_count INT DEFAULT 0,
    last_follow_up_at TIMESTAMP NULL,
    discount_type ENUM('percentage', 'fixed', 'none') DEFAULT 'none',
    discount_value DECIMAL(15,2) DEFAULT 0.00,
    discount_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_quotes_project (project_id),
    INDEX idx_quotes_client (client_id),
    INDEX idx_quotes_number (quote_number),
    INDEX idx_quotes_status (status),
    INDEX idx_quotes_priority (priority),
    INDEX idx_quotes_dates (issue_date, valid_until),
    INDEX idx_quotes_created (created_at),
    INDEX idx_quotes_follow_up (follow_up_date),
    INDEX idx_quotes_conversion (converted_to_invoice_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (deleted_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (converted_to_invoice_id) REFERENCES invoices(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: quote_items
-- =============================================
CREATE TABLE IF NOT EXISTS quote_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quote_id BIGINT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    item_description TEXT,
    item_type ENUM('service', 'product', 'labor', 'material', 'fee', 'custom') DEFAULT 'service',
    unit_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    line_total DECIMAL(15,2) GENERATED ALWAYS AS (unit_price * quantity * (1 - discount_percentage/100)) STORED,
    unit VARCHAR(50) DEFAULT 'unit',
    sku VARCHAR(100),
    category VARCHAR(100),
    notes TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by BIGINT,
    INDEX idx_quote_items_quote (quote_id),
    INDEX idx_quote_items_category (category),
    INDEX idx_quote_items_order (display_order),
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: quote_activities
-- =============================================
CREATE TABLE IF NOT EXISTS quote_activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quote_id BIGINT NOT NULL,
    activity_type ENUM('created', 'sent', 'viewed', 'accepted', 'rejected', 'expired', 'converted', 'follow_up', 'modified') NOT NULL,
    description TEXT NOT NULL,
    user_id BIGINT NULL,
    user_type ENUM('client', 'admin', 'system') DEFAULT 'system',
    activity_data JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_quote_activities_quote (quote_id),
    INDEX idx_quote_activities_type (activity_type),
    INDEX idx_quote_activities_user (user_id),
    INDEX idx_quote_activities_created (created_at),
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SECTION 6: DEFAULT DATA INSERTS
-- =====================================================

-- Insert default navbar items
INSERT INTO admin_navbar_items (item_name, item_type, display_text, url, sort_order, is_visible) VALUES
('home', 'link', 'Home', '/', 1, TRUE),
('about', 'link', 'About Us', '/about', 2, TRUE),
('services', 'link', 'Our Services', '/services', 3, TRUE),
('projects', 'link', 'Projects & Activities', '/projects', 4, TRUE),
('companies', 'dropdown', 'Subsidiaries', '#', 5, TRUE),
('case_studies', 'link', 'Case Studies', '/case-studies', 6, TRUE),
('blog', 'link', 'Blog', '/blog', 7, TRUE),
('contact', 'link', 'Contact', '/contact', 8, TRUE);

-- Insert default website settings
INSERT INTO admin_website_settings (setting_key, setting_value, setting_type, display_name, description, category, is_public) VALUES
('site_title', 'The Greggory Foundation', 'text', 'Site Title', 'Main title of the website', 'general', TRUE),
('site_description', 'Strategic Project Development for all clients. Your Vision Delivered with Trust.', 'textarea', 'Site Description', 'Meta description for SEO', 'general', TRUE),
('contact_email', 'brianmwanza651@gmail.com', 'text', 'Contact Email', 'Main contact email address', 'contact', TRUE),
('contact_phone', '+254799789956', 'text', 'Contact Phone', 'Main contact phone number', 'contact', TRUE),
('company_address', 'rafiki kabarak, kabarak', 'textarea', 'Company Address', 'Physical office address', 'contact', TRUE),
('maintenance_mode', 'false', 'boolean', 'Maintenance Mode', 'Put site in maintenance mode', 'system', FALSE),
('allow_registration', 'true', 'boolean', 'Allow Registration', 'Enable user registration', 'auth', FALSE);

-- =====================================================
-- SECTION 7: TEST USERS FOR ADMIN & DEVELOPER PLATFORMS
-- Password: admin123 (for all admin users)
-- Password: dev123 (for all developer users)
-- =====================================================

-- =============================================
-- Test Admin Users - Can access admin dashboard
-- =============================================
INSERT INTO admin_users (
    email, 
    password_hash, 
    first_name, 
    last_name, 
    admin_level, 
    access_level, 
    department, 
    is_active, 
    email_verified,
    phone_number,
    timezone
) VALUES 
(
    'admin@greggoryfoundation.org', 
    '$2b$10$abcdefghijklmnopqrstuvwx01234567890123456789012345678901234567', 
    'Super', 
    'Administrator', 
    'super_admin', 
    'full', 
    'Executive', 
    1, 
    1,
    '+254799789956',
    'Africa/Nairobi'
),
(
    'manager@greggoryfoundation.org', 
    '$2b$10$abcdefghijklmnopqrstuvwx01234567890123456789012345678901234567', 
    'Project', 
    'Manager', 
    'admin', 
    'full', 
    'Projects', 
    1, 
    1,
    '+254799789957',
    'Africa/Nairobi'
),
(
    'moderator@greggoryfoundation.org', 
    '$2b$10$abcdefghijklmnopqrstuvwx01234567890123456789012345678901234567', 
    'Content', 
    'Moderator', 
    'moderator', 
    'limited', 
    'Content Management', 
    1, 
    1,
    '+254799789958',
    'Africa/Nairobi'
);

-- =============================================
-- Test Developer Users - Can access developer tools
-- =============================================
INSERT INTO developer_users (
    email, 
    password_hash, 
    first_name, 
    last_name, 
    developer_level, 
    access_level, 
    specialization, 
    tech_stack,
    github_username,
    is_active, 
    email_verified,
    phone_number,
    timezone
) VALUES 
(
    'dev1@greggoryfoundation.org', 
    '$2b$10$zyxwvutsrqponmlkjihgfedcba012345678901234567890123456789012345', 
    'John', 
    'Senior', 
    'senior', 
    'full', 
    'Full Stack Development', 
    '["React", "Node.js", "MySQL", "Express", "MongoDB", "Docker"]',
    'johnsenior',
    1, 
    1,
    '+254799789960',
    'Africa/Nairobi'
),
(
    'dev2@greggoryfoundation.org', 
    '$2b$10$zyxwvutsrqponmlkjihgfedcba012345678901234567890123456789012345', 
    'Jane', 
    'Developer', 
    'mid', 
    'limited', 
    'Frontend Development', 
    '["React", "JavaScript", "TypeScript", "TailwindCSS", "HTML", "CSS"]',
    'janedev',
    1, 
    1,
    '+254799789961',
    'Africa/Nairobi'
),
(
    'junior@greggoryfoundation.org', 
    '$2b$10$zyxwvutsrqponmlkjihgfedcba012345678901234567890123456789012345', 
    'Mike', 
    'Trainee', 
    'junior', 
    'limited', 
    'Backend Development', 
    '["Node.js", "Express", "MySQL", "REST APIs"]',
    'mikejr',
    1, 
    1,
    '+254799789962',
    'Africa/Nairobi'
);

-- =============================================
-- Create corresponding users table entries for integration
-- =============================================
INSERT INTO users (email, password_hash, first_name, last_name, primary_role, job_id, is_active, email_verified) 
SELECT email, password_hash, first_name, last_name, 'admin', 
    (SELECT id FROM team_members WHERE role='admin' LIMIT 1), 1, 1 
FROM admin_users;

INSERT INTO users (email, password_hash, first_name, last_name, primary_role, job_id, is_active, email_verified) 
SELECT email, password_hash, first_name, last_name, 'developer', 
    (SELECT id FROM team_members WHERE role='developer' LIMIT 1), 1, 1 
FROM developer_users;

-- =============================================
-- Summary Views for Quick Reference
-- =============================================
SELECT '=============================================' as '==========================================';
SELECT '   GREGGORY FOUNDATION DATABASE SETUP' as 'COMPLETE';
SELECT '=============================================' as '==========================================';

SELECT 
    'Admin Users' as User_Type,
    COUNT(*) as Count,
    GROUP_CONCAT(email SEPARATOR ', ') as Emails
FROM admin_users;

SELECT 
    'Developer Users' as User_Type,
    COUNT(*) as Count,
    GROUP_CONCAT(email SEPARATOR ', ') as Emails
FROM developer_users;

SELECT 
    'Total Tables' as Metric,
    COUNT(*) as Count,
    'Database Objects Created' as Description
FROM information_schema.tables 
WHERE table_schema = 'greggory_foundation_db_main';

-- =====================================================
-- TEST USER LOGIN CREDENTIALS REFERENCE
-- =====================================================
-- Admin Users Credentials (Password: admin123)
--   admin@greggoryfoundation.org (super_admin)
--   manager@greggoryfoundation.org (admin)
--   moderator@greggoryfoundation.org (moderator)
--
-- Developer Users Credentials (Password: dev123)
--   dev1@greggoryfoundation.org (senior)
--   dev2@greggoryfoundation.org (mid)
--   junior@greggoryfoundation.org (junior)
-- =====================================================

-- Show credentials as a proper result set
SELECT 
    'Admin' as Account_Type,
    email as Email,
    'admin123' as Password,
    admin_level as Role,
    CONCAT(first_name, ' ', last_name) as Full_Name
FROM admin_users
WHERE email LIKE '%@greggoryfoundation.org'
UNION ALL
SELECT 
    'Developer' as Account_Type,
    email as Email,
    'dev123' as Password,
    developer_level as Role,
    CONCAT(first_name, ' ', last_name) as Full_Name
FROM developer_users
WHERE email LIKE '%@greggoryfoundation.org'
ORDER BY Account_Type, Role;

-- =====================================================
-- SECTION 7: CLIENT PORTAL - PROJECTS & ACTIVITIES
-- =====================================================

-- =============================================
-- Table: client_projects
-- Main projects table for client portal
-- =============================================
CREATE TABLE IF NOT EXISTS client_projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_code VARCHAR(50) UNIQUE NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    client_id BIGINT,
    project_manager_id BIGINT,
    start_date DATE,
    end_date DATE,
    status ENUM('planning', 'in_progress', 'on_hold', 'completed', 'cancelled') DEFAULT 'planning',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    budget_allocated DECIMAL(15,2) DEFAULT 0.00,
    budget_spent DECIMAL(15,2) DEFAULT 0.00,
    project_type VARCHAR(100),
    industry_sector VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_client_projects_code (project_code),
    INDEX idx_client_projects_client (client_id),
    INDEX idx_client_projects_manager (project_manager_id),
    INDEX idx_client_projects_status (status),
    INDEX idx_client_projects_priority (priority),
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (project_manager_id) REFERENCES team_members(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: project_milestones
-- Milestone tracking for projects
-- =============================================
CREATE TABLE IF NOT EXISTS project_milestones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    milestone_name VARCHAR(255) NOT NULL,
    description TEXT,
    milestone_date DATE NOT NULL,
    status ENUM('pending', 'in_progress', 'completed', 'delayed', 'cancelled') DEFAULT 'pending',
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    actual_completion_date DATE,
    deliverables TEXT,
    dependencies TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_milestones_project (project_id),
    INDEX idx_milestones_status (status),
    INDEX idx_milestones_date (milestone_date),
    FOREIGN KEY (project_id) REFERENCES client_projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: project_tasks
-- Task management for projects
-- =============================================
CREATE TABLE IF NOT EXISTS project_tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to BIGINT,
    task_type VARCHAR(100),
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    status ENUM('to_do', 'in_progress', 'in_review', 'completed', 'cancelled') DEFAULT 'to_do',
    due_date DATE,
    start_date DATE,
    completion_date DATE,
    estimated_hours DECIMAL(8,2),
    actual_hours DECIMAL(8,2),
    parent_task_id BIGINT,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    tags VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_tasks_project (project_id),
    INDEX idx_tasks_assigned (assigned_to),
    INDEX idx_tasks_status (status),
    INDEX idx_tasks_priority (priority),
    INDEX idx_tasks_due_date (due_date),
    FOREIGN KEY (project_id) REFERENCES client_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES team_members(id) ON DELETE SET NULL,
    FOREIGN KEY (parent_task_id) REFERENCES project_tasks(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: project_resources
-- Resource allocation for projects
-- =============================================
CREATE TABLE IF NOT EXISTS project_resources (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    resource_type ENUM('personnel', 'equipment', 'material', 'software', 'other') NOT NULL,
    resource_name VARCHAR(255) NOT NULL,
    resource_id BIGINT,
    allocated_quantity DECIMAL(10,2) DEFAULT 1.00,
    used_quantity DECIMAL(10,2) DEFAULT 0.00,
    unit VARCHAR(50),
    cost_per_unit DECIMAL(10,2) DEFAULT 0.00,
    total_cost DECIMAL(15,2) DEFAULT 0.00,
    allocation_date DATE,
    availability_status ENUM('available', 'in_use', 'unavailable', 'reserved') DEFAULT 'available',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_resources_project (project_id),
    INDEX idx_resources_type (resource_type),
    INDEX idx_resources_status (availability_status),
    FOREIGN KEY (project_id) REFERENCES client_projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: project_budgets
-- Budget tracking for projects
-- =============================================
CREATE TABLE IF NOT EXISTS project_budgets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    budget_category VARCHAR(100) NOT NULL,
    budget_name VARCHAR(255) NOT NULL,
    allocated_amount DECIMAL(15,2) NOT NULL,
    spent_amount DECIMAL(15,2) DEFAULT 0.00,
    remaining_amount DECIMAL(15,2) GENERATED ALWAYS AS (allocated_amount - spent_amount) STORED,
    fiscal_year INT,
    quarter ENUM('Q1', 'Q2', 'Q3', 'Q4'),
    approval_status ENUM('pending', 'approved', 'rejected', 'revised') DEFAULT 'pending',
    approved_by BIGINT,
    approval_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_budgets_project (project_id),
    INDEX idx_budgets_category (budget_category),
    INDEX idx_budgets_status (approval_status),
    FOREIGN KEY (project_id) REFERENCES client_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: project_expenses
-- Expense tracking for projects
-- =============================================
CREATE TABLE IF NOT EXISTS project_expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    expense_category VARCHAR(100) NOT NULL,
    description TEXT,
    amount DECIMAL(15,2) NOT NULL,
    expense_date DATE NOT NULL,
    incurred_by BIGINT,
    approved_by BIGINT,
    approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    receipt_image_id BIGINT,
    invoice_number VARCHAR(100),
    vendor VARCHAR(255),
    payment_method VARCHAR(100),
    is_reimbursable BOOLEAN DEFAULT FALSE,
    reimbursement_status ENUM('not_applicable', 'pending', 'approved', 'paid') DEFAULT 'not_applicable',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_expenses_project (project_id),
    INDEX idx_expenses_category (expense_category),
    INDEX idx_expenses_date (expense_date),
    INDEX idx_expenses_status (approval_status),
    FOREIGN KEY (project_id) REFERENCES client_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (incurred_by) REFERENCES team_members(id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    FOREIGN KEY (receipt_image_id) REFERENCES images(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: client_invoices
-- Invoice management for clients
-- =============================================
CREATE TABLE IF NOT EXISTS client_invoices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    project_id BIGINT,
    client_id BIGINT NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL,
    tax_amount DECIMAL(15,2) DEFAULT 0.00,
    discount_amount DECIMAL(15,2) DEFAULT 0.00,
    total_amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status ENUM('draft', 'sent', 'viewed', 'partial', 'paid', 'overdue', 'cancelled') DEFAULT 'draft',
    payment_terms VARCHAR(255),
    notes TEXT,
    sent_date DATE,
    viewed_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_invoices_number (invoice_number),
    INDEX idx_invoices_project (project_id),
    INDEX idx_invoices_client (client_id),
    INDEX idx_invoices_status (status),
    INDEX idx_invoices_due_date (due_date),
    FOREIGN KEY (project_id) REFERENCES client_projects(id) ON DELETE SET NULL,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: invoice_line_items
-- Line items for invoices
-- =============================================
CREATE TABLE IF NOT EXISTS invoice_line_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    item_description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    tax_percentage DECIMAL(5,2) DEFAULT 0.00,
    line_total DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_price * (1 - discount_percentage/100) * (1 + tax_percentage/100)) STORED,
    item_type VARCHAR(100),
    service_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_line_items_invoice (invoice_id),
    FOREIGN KEY (invoice_id) REFERENCES client_invoices(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: client_payments
-- Payment tracking for invoices
-- =============================================
CREATE TABLE IF NOT EXISTS client_payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    client_id BIGINT,
    payment_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_method ENUM('bank_transfer', 'credit_card', 'paypal', 'check', 'cash', 'other') NOT NULL,
    payment_reference VARCHAR(255),
    status ENUM('pending', 'completed', 'failed', 'refunded', 'partial_refund') DEFAULT 'pending',
    processed_by BIGINT,
    notes TEXT,
    receipt_image_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_payments_invoice (invoice_id),
    INDEX idx_payments_client (client_id),
    INDEX idx_payments_date (payment_date),
    INDEX idx_payments_status (status),
    FOREIGN KEY (invoice_id) REFERENCES client_invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (processed_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    FOREIGN KEY (receipt_image_id) REFERENCES images(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: client_documents
-- Document management for clients
-- =============================================
CREATE TABLE IF NOT EXISTS client_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT,
    client_id BIGINT,
    document_name VARCHAR(255) NOT NULL,
    document_type ENUM('contract', 'proposal', 'report', 'invoice', 'deliverable', 'legal', 'technical', 'other') NOT NULL,
    category VARCHAR(100),
    description TEXT,
    file_path VARCHAR(512),
    file_size BIGINT,
    file_type VARCHAR(100),
    version_number INT DEFAULT 1,
    is_current_version BOOLEAN DEFAULT TRUE,
    parent_document_id BIGINT,
    status ENUM('draft', 'review', 'approved', 'rejected', 'archived') DEFAULT 'draft',
    access_level ENUM('public', 'private', 'confidential') DEFAULT 'private',
    expiry_date DATE,
    tags VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_documents_project (project_id),
    INDEX idx_documents_client (client_id),
    INDEX idx_documents_type (document_type),
    INDEX idx_documents_status (status),
    INDEX idx_documents_version (parent_document_id),
    FOREIGN KEY (project_id) REFERENCES client_projects(id) ON DELETE SET NULL,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_document_id) REFERENCES client_documents(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: document_signatures
-- eSignature tracking for documents
-- =============================================
CREATE TABLE IF NOT EXISTS document_signatures (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    document_id BIGINT NOT NULL,
    signer_id BIGINT NOT NULL,
    signer_name VARCHAR(255) NOT NULL,
    signer_email VARCHAR(255) NOT NULL,
    signature_status ENUM('pending', 'signed', 'declined', 'expired') DEFAULT 'pending',
    signature_date TIMESTAMP NULL,
    signature_image_id BIGINT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    signature_hash VARCHAR(255),
    expires_at TIMESTAMP NULL,
    reminder_sent BOOLEAN DEFAULT FALSE,
    reminder_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_signatures_document (document_id),
    INDEX idx_signatures_signer (signer_id),
    INDEX idx_signatures_status (signature_status),
    FOREIGN KEY (document_id) REFERENCES client_documents(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: client_messages
-- Communication hub for clients
-- =============================================
CREATE TABLE IF NOT EXISTS client_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT,
    client_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    recipient_id BIGINT NOT NULL,
    subject VARCHAR(255),
    message_body TEXT NOT NULL,
    message_type ENUM('email', 'sms', 'whatsapp', 'in_app', 'other') DEFAULT 'in_app',
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    status ENUM('draft', 'sent', 'delivered', 'read', 'replied', 'failed') DEFAULT 'draft',
    is_unread BOOLEAN DEFAULT TRUE,
    parent_message_id BIGINT,
    attachments TEXT,
    sent_at TIMESTAMP NULL,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_messages_project (project_id),
    INDEX idx_messages_client (client_id),
    INDEX idx_messages_sender (sender_id),
    INDEX idx_messages_recipient (recipient_id),
    INDEX idx_messages_status (status),
    INDEX idx_messages_unread (is_unread),
    INDEX idx_messages_date (created_at),
    FOREIGN KEY (project_id) REFERENCES client_projects(id) ON DELETE SET NULL,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_message_id) REFERENCES client_messages(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: project_risks
-- Risk assessment and management
-- =============================================
CREATE TABLE IF NOT EXISTS project_risks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    risk_title VARCHAR(255) NOT NULL,
    risk_description TEXT,
    risk_category VARCHAR(100),
    probability ENUM('very_low', 'low', 'medium', 'high', 'very_high') DEFAULT 'medium',
    impact ENUM('very_low', 'low', 'medium', 'high', 'very_high') DEFAULT 'medium',
    risk_score DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE probability
            WHEN 'very_low' THEN 1
            WHEN 'low' THEN 2
            WHEN 'medium' THEN 3
            WHEN 'high' THEN 4
            WHEN 'very_high' THEN 5
        END *
        CASE impact
            WHEN 'very_low' THEN 1
            WHEN 'low' THEN 2
            WHEN 'medium' THEN 3
            WHEN 'high' THEN 4
            WHEN 'very_high' THEN 5
        END
    ) STORED,
    risk_level ENUM('low', 'medium', 'high', 'critical') GENERATED ALWAYS AS (
        CASE
            WHEN risk_score <= 4 THEN 'low'
            WHEN risk_score <= 9 THEN 'medium'
            WHEN risk_score <= 16 THEN 'high'
            ELSE 'critical'
        END
    ) STORED,
    mitigation_strategy TEXT,
    owner_id BIGINT,
    status ENUM('open', 'mitigating', 'mitigated', 'closed', 'occurred') DEFAULT 'open',
    identified_date DATE,
    target_mitigation_date DATE,
    actual_mitigation_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_risks_project (project_id),
    INDEX idx_risks_level (risk_level),
    INDEX idx_risks_status (status),
    INDEX idx_risks_owner (owner_id),
    FOREIGN KEY (project_id) REFERENCES client_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES team_members(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: quality_assurance
-- QA checkpoint tracking
-- =============================================
CREATE TABLE IF NOT EXISTS quality_assurance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    checkpoint_name VARCHAR(255) NOT NULL,
    checkpoint_type VARCHAR(100),
    description TEXT,
    qa_date DATE NOT NULL,
    status ENUM('pending', 'in_progress', 'passed', 'failed', 'deferred') DEFAULT 'pending',
    tester_id BIGINT,
    test_results TEXT,
    issues_found INT DEFAULT 0,
    issues_resolved INT DEFAULT 0,
    pass_rate DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_qa_project (project_id),
    INDEX idx_qa_status (status),
    INDEX idx_qa_date (qa_date),
    FOREIGN KEY (project_id) REFERENCES client_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (tester_id) REFERENCES team_members(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: performance_metrics
-- KPI and performance tracking
-- =============================================
CREATE TABLE IF NOT EXISTS performance_metrics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT,
    metric_name VARCHAR(255) NOT NULL,
    metric_category VARCHAR(100),
    metric_type ENUM('numeric', 'percentage', 'currency', 'boolean', 'text') DEFAULT 'numeric',
    value DECIMAL(20,4),
    target_value DECIMAL(20,4),
    unit VARCHAR(50),
    measurement_date DATE NOT NULL,
    frequency ENUM('daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'one_time') DEFAULT 'monthly',
    status ENUM('on_track', 'at_risk', 'behind', 'ahead') DEFAULT 'on_track',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_metrics_project (project_id),
    INDEX idx_metrics_category (metric_category),
    INDEX idx_metrics_date (measurement_date),
    FOREIGN KEY (project_id) REFERENCES client_projects(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: audit_logs
-- Comprehensive activity tracking
-- =============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    user_type ENUM('admin', 'developer', 'user', 'system') NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id BIGINT,
    old_values TEXT,
    new_values TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(255),
    request_method VARCHAR(10),
    request_url TEXT,
    status ENUM('success', 'failure', 'warning') DEFAULT 'success',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_entity (entity_type, entity_id),
    INDEX idx_audit_date (created_at),
    INDEX idx_audit_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: client_feedback
-- Client feedback and surveys
-- =============================================
CREATE TABLE IF NOT EXISTS client_feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT,
    client_id BIGINT NOT NULL,
    feedback_type ENUM('satisfaction', 'bug_report', 'feature_request', 'complaint', 'compliment', 'other') NOT NULL,
    subject VARCHAR(255),
    feedback_body TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('received', 'in_review', 'addressed', 'resolved', 'closed') DEFAULT 'received',
    assigned_to BIGINT,
    response_text TEXT,
    response_date TIMESTAMP NULL,
    response_time_hours DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_feedback_project (project_id),
    INDEX idx_feedback_client (client_id),
    INDEX idx_feedback_type (feedback_type),
    INDEX idx_feedback_status (status),
    FOREIGN KEY (project_id) REFERENCES client_projects(id) ON DELETE SET NULL,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES team_members(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: project_timeline
-- Gantt chart and timeline data
-- =============================================
CREATE TABLE IF NOT EXISTS project_timeline (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    task_id BIGINT,
    milestone_id BIGINT,
    item_name VARCHAR(255) NOT NULL,
    item_type ENUM('task', 'milestone', 'phase', 'deliverable') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_days INT,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    dependencies TEXT,
    color VARCHAR(7),
    is_critical BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_timeline_project (project_id),
    INDEX idx_timeline_task (task_id),
    INDEX idx_timeline_milestone (milestone_id),
    INDEX idx_timeline_dates (start_date, end_date),
    FOREIGN KEY (project_id) REFERENCES client_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES project_tasks(id) ON DELETE SET NULL,
    FOREIGN KEY (milestone_id) REFERENCES project_milestones(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: notifications
-- Notification system for clients
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    notification_type ENUM('project_update', 'task_assigned', 'milestone_complete', 'invoice_sent', 'payment_received', 'message', 'risk_alert', 'qa_result', 'system') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    status ENUM('unread', 'read', 'archived') DEFAULT 'unread',
    action_url VARCHAR(512),
    related_entity_type VARCHAR(100),
    related_entity_id BIGINT,
    sent_via_email BOOLEAN DEFAULT FALSE,
    sent_via_sms BOOLEAN DEFAULT FALSE,
    sent_via_push BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    INDEX idx_notifications_user (user_id),
    INDEX idx_notifications_type (notification_type),
    INDEX idx_notifications_status (status),
    INDEX idx_notifications_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: admin_announcements
-- Admin announcements and public notices
-- =============================================
CREATE TABLE IF NOT EXISTS admin_announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    summary TEXT,
    content LONGTEXT,
    announcement_type ENUM('general', 'system', 'project', 'team', 'client', 'urgent', 'reminder') DEFAULT 'general',
    audience ENUM('all_users', 'all_clients', 'all_admins', 'project_team', 'specific_users', 'specific_projects', 'public') DEFAULT 'all_users',
    target_project_id BIGINT DEFAULT NULL,
    target_user_id BIGINT DEFAULT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    is_pinned BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_by BIGINT DEFAULT NULL,
    updated_by BIGINT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_announcements_status (status),
    INDEX idx_announcements_type (announcement_type),
    INDEX idx_announcements_audience (audience),
    INDEX idx_announcements_project (target_project_id),
    INDEX idx_announcements_user (target_user_id),
    FOREIGN KEY (target_project_id) REFERENCES user_projects(id) ON DELETE SET NULL,
    FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: project_updates
-- Project-specific update feed entries for admin and client portals
-- =============================================
CREATE TABLE IF NOT EXISTS project_updates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    body LONGTEXT NOT NULL,
    update_type ENUM('status', 'milestone', 'issue', 'release', 'task', 'announcement', 'general') DEFAULT 'status',
    visibility ENUM('team', 'client', 'public', 'private') DEFAULT 'team',
    author_id BIGINT DEFAULT NULL,
    author_role ENUM('admin', 'developer', 'client', 'system') DEFAULT 'admin',
    related_task_id BIGINT DEFAULT NULL,
    progress_percentage DECIMAL(5,2) DEFAULT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'published',
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_project_updates_project (project_id),
    INDEX idx_project_updates_type (update_type),
    INDEX idx_project_updates_visibility (visibility),
    INDEX idx_project_updates_status (status),
    INDEX idx_project_updates_author (author_id),
    FOREIGN KEY (project_id) REFERENCES user_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (related_task_id) REFERENCES project_tasks(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: user_portal_feed_items
-- Personalized feed items for the user portal
-- =============================================
CREATE TABLE IF NOT EXISTS user_portal_feed_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    source_type ENUM('announcement', 'project_update', 'notification', 'system') DEFAULT 'project_update',
    source_id BIGINT DEFAULT NULL,
    title VARCHAR(255) NOT NULL,
    body LONGTEXT,
    related_project_id BIGINT DEFAULT NULL,
    action_url VARCHAR(512),
    is_read BOOLEAN DEFAULT FALSE,
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    status ENUM('active', 'archived') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_portal_feed_user (user_id),
    INDEX idx_portal_feed_project (related_project_id),
    INDEX idx_portal_feed_source (source_type),
    INDEX idx_portal_feed_status (status),
    INDEX idx_portal_feed_read (is_read),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_project_id) REFERENCES user_projects(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: change_requests
-- Change order management
-- =============================================
CREATE TABLE IF NOT EXISTS change_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    request_number VARCHAR(50) UNIQUE NOT NULL,
    requested_by BIGINT NOT NULL,
    change_description TEXT NOT NULL,
    reason_for_change TEXT,
    impact_assessment TEXT,
    estimated_cost_impact DECIMAL(15,2) DEFAULT 0.00,
    estimated_time_impact_days INT DEFAULT 0,
    status ENUM('draft', 'submitted', 'under_review', 'approved', 'rejected', 'implemented', 'cancelled') DEFAULT 'draft',
    reviewed_by BIGINT,
    review_date DATE,
    approval_date DATE,
    implementation_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by BIGINT DEFAULT NULL,
    INDEX idx_change_requests_project (project_id),
    INDEX idx_change_requests_number (request_number),
    INDEX idx_change_requests_status (status),
    FOREIGN KEY (project_id) REFERENCES client_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================
-- Table: quick_links
-- =============================================

-- =====================================================


-- =====================================================
-- SECTION: AUTH PLATFORM MAPPING & VALIDATION
-- =====================================================


-- =============================================
-- Table: auth_platform_mapping
-- Locks platform → table → endpoint associations
-- =============================================
CREATE TABLE IF NOT EXISTS auth_platform_mapping (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    platform_name VARCHAR(50) NOT NULL UNIQUE,
    table_name VARCHAR(100) NOT NULL UNIQUE,
    register_endpoint VARCHAR(255) NOT NULL,
    login_endpoint VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    is_locked BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    locked_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    locked_by VARCHAR(100) DEFAULT 'SYSTEM',
    INDEX idx_platform_name (platform_name),
    INDEX idx_table_name (table_name),
    INDEX idx_is_locked (is_locked),
    CONSTRAINT check_platform_name CHECK (platform_name IN ('user', 'admin', 'developer')),
    CONSTRAINT check_table_name CHECK (table_name IN ('users', 'admin_users', 'developer_users'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert locked platform mappings
DELETE FROM auth_platform_mapping; -- Clear any existing entries

INSERT INTO auth_platform_mapping (
    platform_name, 
    table_name, 
    register_endpoint, 
    login_endpoint, 
    description, 
    is_active, 
    is_locked,
    locked_by
) VALUES 
(
    'user',
    'users',
    'POST /api/users/register',
    'POST /api/users/login',
    'Regular user authentication - public user accounts, donors, beneficiaries',
    TRUE,
    TRUE,
    'SYSTEM'
),
(
    'admin',
    'admin_users',
    'POST /api/admin/create (admin-create via users.js)',
    'POST /api/admin-verification/authenticate-enhanced',
    'Administrative staff - super admins, admins, moderators',
    TRUE,
    TRUE,
    'SYSTEM'
),
(
    'developer',
    'developer_users',
    'POST /api/admin/developer-create (admin-create via users.js)',
    'POST /api/developer-verification/authenticate',
    'Development team - senior, mid, junior, lead level developers',
    TRUE,
    TRUE,
    'SYSTEM'
);

-- =============================================
-- Table: auth_request_log
-- Logs all authentication requests for audit
-- =============================================
CREATE TABLE IF NOT EXISTS auth_request_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_id VARCHAR(100) NOT NULL UNIQUE,
    platform VARCHAR(50) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    ip_address VARCHAR(45),
    request_method VARCHAR(10),
    request_body_hash VARCHAR(64),
    response_status INT,
    response_message VARCHAR(255),
    error_message VARCHAR(500),
    execution_time_ms INT,
    is_success BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_platform (platform),
    INDEX idx_table_name (table_name),
    INDEX idx_endpoint (endpoint),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at),
    INDEX idx_is_success (is_success)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: auth_validation_rules
-- Defines strict validation rules per platform
-- =============================================
CREATE TABLE IF NOT EXISTS auth_validation_rules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    rule_name VARCHAR(100) NOT NULL,
    rule_type ENUM('required_field', 'table_isolation', 'cross_check', 'password_policy', 'rate_limit') DEFAULT 'required_field',
    rule_value VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    enforcement_level ENUM('strict', 'warning', 'info') DEFAULT 'strict',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_platform_rule (platform, rule_name),
    INDEX idx_platform (platform),
    INDEX idx_rule_type (rule_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert validation rules
DELETE FROM auth_validation_rules;

INSERT INTO auth_validation_rules (
    platform,
    rule_name,
    rule_type,
    rule_value,
    description,
    enforcement_level
) VALUES
-- User platform rules
('user', 'email_required', 'required_field', 'email', 'Email field is mandatory for user registration', 'strict'),
('user', 'password_required', 'required_field', 'password', 'Password field is mandatory for user registration', 'strict'),
('user', 'first_name_required', 'required_field', 'first_name', 'First name field is mandatory for user registration', 'strict'),
('user', 'last_name_required', 'required_field', 'last_name', 'Last name field is mandatory for user registration', 'strict'),
('user', 'only_users_table', 'table_isolation', 'users', 'User auth MUST ONLY reference users table', 'strict'),
('user', 'no_admin_check', 'cross_check', 'admin_users', 'NEVER check admin_users table in user auth flow', 'strict'),
('user', 'no_developer_check', 'cross_check', 'developer_users', 'NEVER check developer_users table in user auth flow', 'strict'),
('user', 'password_min_length', 'password_policy', '8', 'Password must be minimum 8 characters', 'strict'),
-- Admin platform rules
('admin', 'email_required', 'required_field', 'email', 'Email field is mandatory for admin registration', 'strict'),
('admin', 'password_required', 'required_field', 'password', 'Password field is mandatory for admin registration', 'strict'),
('admin', 'first_name_required', 'required_field', 'first_name', 'First name field is mandatory for admin registration', 'strict'),
('admin', 'last_name_required', 'required_field', 'last_name', 'Last name field is mandatory for admin registration', 'strict'),
('admin', 'role_required', 'required_field', 'role', 'Role field is mandatory for admin registration', 'strict'),
('admin', 'only_admin_users_table', 'table_isolation', 'admin_users', 'Admin auth MUST ONLY reference admin_users table', 'strict'),
('admin', 'no_users_check', 'cross_check', 'users', 'NEVER check users table in admin auth flow', 'strict'),
('admin', 'no_developer_check', 'cross_check', 'developer_users', 'NEVER check developer_users table in admin auth flow', 'strict'),
('admin', 'password_min_length', 'password_policy', '8', 'Password must be minimum 8 characters', 'strict'),
-- Developer platform rules
('developer', 'email_required', 'required_field', 'email', 'Email field is mandatory for developer registration', 'strict'),
('developer', 'password_required', 'required_field', 'password', 'Password field is mandatory for developer registration', 'strict'),
('developer', 'first_name_required', 'required_field', 'first_name', 'First name field is mandatory for developer registration', 'strict'),
('developer', 'last_name_required', 'required_field', 'last_name', 'Last name field is mandatory for developer registration', 'strict'),
('developer', 'role_required', 'required_field', 'role', 'Role field is mandatory for developer registration', 'strict'),
('developer', 'only_developer_users_table', 'table_isolation', 'developer_users', 'Developer auth MUST ONLY reference developer_users table', 'strict'),
('developer', 'no_users_check', 'cross_check', 'users', 'NEVER check users table in developer auth flow', 'strict'),
('developer', 'no_admin_check', 'cross_check', 'admin_users', 'NEVER check admin_users table in developer auth flow', 'strict'),
('developer', 'password_min_length', 'password_policy', '8', 'Password must be minimum 8 characters', 'strict');

-- =============================================
-- VIEWS for Auth Platform Monitoring
-- =============================================

-- View: Active Auth Platforms
CREATE OR REPLACE VIEW v_active_auth_platforms AS
SELECT 
    platform_name,
    table_name,
    register_endpoint,
    login_endpoint,
    description,
    is_active,
    is_locked,
    locked_at,
    locked_by
FROM auth_platform_mapping
WHERE is_active = TRUE AND is_locked = TRUE
ORDER BY platform_name;

-- View: Auth Request Success Rate
CREATE OR REPLACE VIEW v_auth_request_stats AS
SELECT 
    platform,
    table_name,
    endpoint,
    COUNT(*) as total_requests,
    SUM(CASE WHEN is_success = TRUE THEN 1 ELSE 0 END) as successful_requests,
    SUM(CASE WHEN is_success = FALSE THEN 1 ELSE 0 END) as failed_requests,
    ROUND(
        (SUM(CASE WHEN is_success = TRUE THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2
    ) as success_rate_percentage,
    ROUND(AVG(execution_time_ms), 2) as avg_execution_time_ms,
    MIN(created_at) as first_request_at,
    MAX(created_at) as last_request_at
FROM auth_request_log
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY platform, table_name, endpoint
ORDER BY platform, endpoint;

-- =============================================
-- Sample Audit Query
-- =============================================
-- SELECT 
--     platform_name,
--     table_name,
--     register_endpoint,
--     login_endpoint,
--     is_locked,
--     locked_at,
--     locked_by
-- FROM auth_platform_mapping
-- WHERE is_locked = TRUE;


-- =====================================================
-- SECTION: COMPREHENSIVE ACCOUNTING SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS accounting_chart_of_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_code VARCHAR(20) NOT NULL UNIQUE,
    account_name VARCHAR(200) NOT NULL,
    account_type ENUM('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE') NOT NULL,
    sub_type ENUM('CURRENT_ASSET', 'FIXED_ASSET', 'CURRENT_LIABILITY', 'LONG_TERM_LIABILITY', 'RETAINED_EARNINGS', 'OPERATING_REVENUE', 'OPERATING_EXPENSE', 'OTHER_REVENUE', 'OTHER_EXPENSE') NOT NULL,
    parent_account_id INT NULL,
    account_level INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    is_system BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (parent_account_id) REFERENCES accounting_chart_of_accounts(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Currencies
CREATE TABLE IF NOT EXISTS accounting_currencies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    currency_code VARCHAR(3) NOT NULL UNIQUE,
    currency_name VARCHAR(50) NOT NULL,
    currency_symbol VARCHAR(5) NOT NULL,
    exchange_rate DECIMAL(10, 4) DEFAULT 1.0000,
    is_base_currency BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tax Rates
CREATE TABLE IF NOT EXISTS accounting_tax_rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tax_name VARCHAR(100) NOT NULL,
    tax_rate DECIMAL(5, 4) NOT NULL,
    tax_type ENUM('VAT', 'INCOME_TAX', 'PAYE', 'WITHHOLDING_TAX', 'EXCISE_DUTY', 'DIGITAL_SERVICE_TAX', 'OTHER') NOT NULL,
    tax_code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    effective_date DATE NOT NULL,
    expiry_date DATE NULL,
    is_active BOOLEAN DEFAULT TRUE,
    kra_tax_code VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================
-- BANK ACCOUNTS & TRANSACTIONS
-- ==========================================

-- Bank Accounts
CREATE TABLE IF NOT EXISTS accounting_bank_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_name VARCHAR(200) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    bank_name VARCHAR(200) NOT NULL,
    bank_branch VARCHAR(200),
    account_type ENUM('CURRENT', 'SAVINGS', 'FIXED_DEPOSIT', 'CALL_ACCOUNT', 'CREDIT_CARD') NOT NULL,
    currency_id INT NOT NULL,
    opening_balance DECIMAL(20, 2) DEFAULT 0.00,
    current_balance DECIMAL(20, 2) DEFAULT 0.00,
    available_balance DECIMAL(20, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    is_primary BOOLEAN DEFAULT FALSE,
    account_status ENUM('ACTIVE', 'DORMANT', 'FROZEN', 'CLOSED') DEFAULT 'ACTIVE',
    swift_code VARCHAR(20),
    routing_number VARCHAR(50),
    api_enabled BOOLEAN DEFAULT FALSE,
    api_credentials_encrypted TEXT,
    last_sync TIMESTAMP NULL,
    last_reconciliation TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Bank Transactions
CREATE TABLE IF NOT EXISTS accounting_bank_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bank_account_id INT NOT NULL,
    transaction_type ENUM('DEBIT', 'CREDIT', 'TRANSFER_IN', 'TRANSFER_OUT', 'FEE', 'INTEREST') NOT NULL,
    transaction_amount DECIMAL(20, 2) NOT NULL,
    running_balance DECIMAL(20, 2),
    reference_number VARCHAR(100),
    transaction_date DATE NOT NULL,
    value_date DATE,
    description TEXT,
    category VARCHAR(100),
    sub_category VARCHAR(100),
    counterparty_name VARCHAR(200),
    counterparty_account VARCHAR(100),
    reconciliation_status ENUM('UNRECONCILED', 'PARTIALLY_RECONCILED', 'RECONCILED', 'DISPUTED') DEFAULT 'UNRECONCILED',
    related_invoice_id INT NULL,
    related_payment_id INT NULL,
    related_expense_id INT NULL,
    attachment_path VARCHAR(500),
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_transaction_id INT NULL,
    import_source ENUM('MANUAL', 'API_IMPORT', 'CSV_IMPORT', 'BANK_FEED'),
    external_reference VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (bank_account_id) REFERENCES accounting_bank_accounts(id),
    FOREIGN KEY (recurring_transaction_id) REFERENCES accounting_bank_transactions(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Bank Transfers
CREATE TABLE IF NOT EXISTS accounting_bank_transfers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transfer_type ENUM('INTRA_BANK', 'INTER_BANK', 'INTERNATIONAL') NOT NULL,
    from_bank_account_id INT NOT NULL,
    to_bank_account_id INT NULL,
    recipient_name VARCHAR(200) NOT NULL,
    recipient_account_number VARCHAR(100) NOT NULL,
    recipient_bank VARCHAR(200),
    recipient_branch VARCHAR(200),
    amount DECIMAL(20, 2) NOT NULL,
    currency_id INT NOT NULL,
    exchange_rate DECIMAL(10, 4) DEFAULT 1.0000,
    transfer_purpose VARCHAR(200),
    reference_number VARCHAR(100) UNIQUE,
    transaction_id VARCHAR(100),
    status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED') DEFAULT 'PENDING',
    scheduled_date DATE,
    processed_date DATE,
    fees DECIMAL(20, 2) DEFAULT 0.00,
    description TEXT,
    related_invoice_id INT NULL,
    related_payment_id INT NULL,
    priority ENUM('NORMAL', 'URGENT', 'IMMEDIATE') DEFAULT 'NORMAL',
    approval_status ENUM('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED') DEFAULT 'DRAFT',
    approved_by INT NULL,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (from_bank_account_id) REFERENCES accounting_bank_accounts(id),
    FOREIGN KEY (to_bank_account_id) REFERENCES accounting_bank_accounts(id),
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (approved_by) REFERENCES admin_users(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- ==========================================
-- M-PESA MOBILE MONEY INTEGRATION
-- ==========================================

-- M-Pesa Accounts
CREATE TABLE IF NOT EXISTS accounting_mpesa_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_name VARCHAR(200) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    account_type ENUM('PAYBILL', 'TILL_NUMBER', 'BUSINESS_ACCOUNT') NOT NULL,
    paybill_number VARCHAR(20) NULL,
    till_number VARCHAR(20) NULL,
    business_shortcode VARCHAR(20),
    api_consumer_key_encrypted TEXT,
    api_consumer_secret_encrypted TEXT,
    passkey_encrypted TEXT,
    environment ENUM('SANDBOX', 'PRODUCTION') DEFAULT 'SANDBOX',
    balance DECIMAL(20, 2) DEFAULT 0.00,
    float_balance DECIMAL(20, 2) DEFAULT 0.00,
    daily_limit DECIMAL(20, 2) DEFAULT 1000000.00,
    transaction_limit DECIMAL(20, 2) DEFAULT 150000.00,
    is_active BOOLEAN DEFAULT TRUE,
    is_primary BOOLEAN DEFAULT FALSE,
    last_balance_check TIMESTAMP NULL,
    last_transaction_sync TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- M-Pesa Transactions
CREATE TABLE IF NOT EXISTS accounting_mpesa_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mpesa_account_id INT NOT NULL,
    transaction_type ENUM('C2B', 'B2C', 'B2B', 'STK_PUSH', 'C2B_REGISTER', 'ACCOUNT_BALANCE', 'TRANSACTION_STATUS') NOT NULL,
    transaction_id VARCHAR(100) NOT NULL,
    originator_conversation_id VARCHAR(200),
    conversation_id VARCHAR(200),
    phone_number VARCHAR(20),
    amount DECIMAL(20, 2) NOT NULL,
    transaction_time DATETIME,
    business_shortcode VARCHAR(20),
    bill_ref_number VARCHAR(100),
    invoice_number VARCHAR(100),
    org_account_balance DECIMAL(20, 2),
    third_party_trans_id VARCHAR(200),
    transaction_status ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'TIMEOUT') DEFAULT 'PENDING',
    result_code INT NULL,
    result_desc TEXT,
    callback_received BOOLEAN DEFAULT FALSE,
    callback_received_at TIMESTAMP NULL,
    reconciliation_status ENUM('UNRECONCILED', 'PARTIALLY_RECONCILED', 'RECONCILED', 'DISPUTED') DEFAULT 'UNRECONCILED',
    related_invoice_id INT NULL,
    related_payment_id INT NULL,
    related_bank_transaction_id INT NULL,
    customer_message TEXT,
    excise_tax DECIMAL(20, 2) DEFAULT 0.00,
    transaction_fee DECIMAL(20, 2) DEFAULT 0.00,
    net_amount DECIMAL(20, 2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mpesa_account_id) REFERENCES accounting_mpesa_accounts(id),
    FOREIGN KEY (related_bank_transaction_id) REFERENCES accounting_bank_transactions(id)
);

-- M-Pesa Bulk Payments
CREATE TABLE IF NOT EXISTS accounting_mpesa_bulk_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    batch_name VARCHAR(200) NOT NULL,
    mpesa_account_id INT NOT NULL,
    total_amount DECIMAL(20, 2) NOT NULL,
    total_recipients INT NOT NULL,
    payment_purpose VARCHAR(200),
    status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'PARTIALLY_COMPLETED', 'FAILED', 'CANCELLED') DEFAULT 'PENDING',
    initiated_by INT NOT NULL,
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    remarks TEXT,
    FOREIGN KEY (mpesa_account_id) REFERENCES accounting_mpesa_accounts(id),
    FOREIGN KEY (initiated_by) REFERENCES admin_users(id)
);

-- M-Pesa Bulk Payment Recipients
CREATE TABLE IF NOT EXISTS accounting_mpesa_bulk_payment_recipients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bulk_payment_id INT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    amount DECIMAL(20, 2) NOT NULL,
    recipient_name VARCHAR(200),
    payment_status ENUM('PENDING', 'SUCCESS', 'FAILED', 'TIMEOUT') DEFAULT 'PENDING',
    transaction_id VARCHAR(100),
    result_code INT NULL,
    result_desc TEXT,
    processed_at TIMESTAMP NULL,
    remarks TEXT,
    FOREIGN KEY (bulk_payment_id) REFERENCES accounting_mpesa_bulk_payments(id)
);

-- ==========================================
-- CLIENTS & PROJECTS ACCOUNTING
-- ==========================================

-- Clients (for accounting)
CREATE TABLE IF NOT EXISTS accounting_clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_code VARCHAR(20) NOT NULL UNIQUE,
    client_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(200),
    email VARCHAR(200),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    tax_id_number VARCHAR(50),
    payment_terms INT DEFAULT 30, -- days
    credit_limit DECIMAL(20, 2) DEFAULT 0.00,
    current_balance DECIMAL(20, 2) DEFAULT 0.00,
    client_type ENUM('INDIVIDUAL', 'COMPANY', 'GOVERNMENT', 'NGO', 'OTHER') NOT NULL,
    industry VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    rating ENUM('A', 'B', 'C', 'D') DEFAULT 'B',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Projects (accounting view)
CREATE TABLE IF NOT EXISTS accounting_projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_code VARCHAR(20) NOT NULL UNIQUE,
    client_id INT NOT NULL,
    project_name VARCHAR(200) NOT NULL,
    project_value DECIMAL(20, 2) NOT NULL,
    currency_id INT NOT NULL,
    start_date DATE,
    end_date DATE,
    billing_type ENUM('FIXED_PRICE', 'HOURLY', 'MILESTONE', 'RETAINER', 'TIME_MATERIALS') NOT NULL,
    billing_rate DECIMAL(20, 2) NULL,
    estimated_hours DECIMAL(10, 2) NULL,
    actual_hours DECIMAL(10, 2) DEFAULT 0.00,
    amount_billed DECIMAL(20, 2) DEFAULT 0.00,
    amount_paid DECIMAL(20, 2) DEFAULT 0.00,
    amount_outstanding DECIMAL(20, 2) DEFAULT 0.00,
    project_status ENUM('PROPOSAL', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED') DEFAULT 'PROPOSAL',
    progress_percentage DECIMAL(5, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (client_id) REFERENCES accounting_clients(id),
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- ==========================================
-- INVOICING SYSTEM
-- ==========================================

-- Invoices
CREATE TABLE IF NOT EXISTS accounting_invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    client_id INT NOT NULL,
    project_id INT NULL,
    currency_id INT NOT NULL,
    subtotal DECIMAL(20, 2) NOT NULL,
    tax_amount DECIMAL(20, 2) DEFAULT 0.00,
    discount_amount DECIMAL(20, 2) DEFAULT 0.00,
    total_amount DECIMAL(20, 2) NOT NULL,
    amount_paid DECIMAL(20, 2) DEFAULT 0.00,
    amount_outstanding DECIMAL(20, 2) NOT NULL,
    payment_status ENUM('DRAFT', 'SENT', 'VIEWED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'WRITE_OFF', 'CANCELLED') DEFAULT 'DRAFT',
    invoice_type ENUM('STANDARD', 'CREDIT_NOTE', 'DEBIT_NOTE', 'PROFORMA') DEFAULT 'STANDARD',
    payment_terms VARCHAR(200),
    notes TEXT,
    terms_and_conditions TEXT,
    sent_via ENUM('EMAIL', 'WHATSAPP', 'SMS', 'MANUAL', 'PORTAL') NULL,
    sent_at TIMESTAMP NULL,
    viewed_at TIMESTAMP NULL,
    reminder_count INT DEFAULT 0,
    last_reminder_sent TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (client_id) REFERENCES accounting_clients(id),
    FOREIGN KEY (project_id) REFERENCES accounting_projects(id),
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Invoice Line Items
CREATE TABLE IF NOT EXISTS accounting_invoice_line_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    item_description VARCHAR(500) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(20, 2) NOT NULL,
    line_total DECIMAL(20, 2) NOT NULL,
    account_id INT NULL,
    tax_rate_id INT NULL,
    tax_amount DECIMAL(20, 2) DEFAULT 0.00,
    discount_percent DECIMAL(5, 2) DEFAULT 0.00,
    discount_amount DECIMAL(20, 2) DEFAULT 0.00,
    service_date DATE,
    item_code VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES accounting_invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounting_chart_of_accounts(id),
    FOREIGN KEY (tax_rate_id) REFERENCES accounting_tax_rates(id)
);

-- Invoice Payment Methods
CREATE TABLE IF NOT EXISTS accounting_invoice_payment_methods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    payment_method ENUM('MPESA', 'BANK_TRANSFER', 'CASH', 'CREDIT_CARD', 'MOBILE_WALLET', 'CHEQUE', 'OTHER') NOT NULL,
    mpesa_transaction_id INT NULL,
    bank_transaction_id INT NULL,
    cash_transaction_id INT NULL,
    card_transaction_id INT NULL,
    is_primary BOOLEAN DEFAULT TRUE,
    payment_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES accounting_invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (mpesa_transaction_id) REFERENCES accounting_mpesa_transactions(id),
    FOREIGN KEY (bank_transaction_id) REFERENCES accounting_bank_transactions(id)
);

-- ==========================================
-- PAYMENTS & RECEIPTS
-- ==========================================

-- Payments Received
CREATE TABLE IF NOT EXISTS accounting_payments_received (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_number VARCHAR(50) NOT NULL UNIQUE,
    payment_date DATE NOT NULL,
    invoice_id INT NULL,
    client_id INT NOT NULL,
    project_id INT NULL,
    amount DECIMAL(20, 2) NOT NULL,
    currency_id INT NOT NULL,
    exchange_rate DECIMAL(10, 4) DEFAULT 1.0000,
    payment_method ENUM('MPESA', 'BANK_TRANSFER', 'CASH', 'CREDIT_CARD', 'MOBILE_WALLET', 'CHEQUE', 'OTHER') NOT NULL,
    mpesa_transaction_id INT NULL,
    bank_transaction_id INT NULL,
    cash_transaction_id INT NULL,
    reference_number VARCHAR(100),
    description TEXT,
    notes TEXT,
    allocation_status ENUM('UNALLOCATED', 'PARTIALLY_ALLOCATED', 'FULLY_ALLOCATED') DEFAULT 'UNALLOCATED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (invoice_id) REFERENCES accounting_invoices(id),
    FOREIGN KEY (client_id) REFERENCES accounting_clients(id),
    FOREIGN KEY (project_id) REFERENCES accounting_projects(id),
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (mpesa_transaction_id) REFERENCES accounting_mpesa_transactions(id),
    FOREIGN KEY (bank_transaction_id) REFERENCES accounting_bank_transactions(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Payment Allocations
CREATE TABLE IF NOT EXISTS accounting_payment_allocations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_id INT NOT NULL,
    invoice_id INT NOT NULL,
    amount_allocated DECIMAL(20, 2) NOT NULL,
    allocation_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES accounting_payments_received(id),
    FOREIGN KEY (invoice_id) REFERENCES accounting_invoices(id)
);

-- ==========================================
-- EXPENSES & PAYABLES
-- ==========================================

-- Vendors/Suppliers
CREATE TABLE IF NOT EXISTS accounting_vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_code VARCHAR(20) NOT NULL UNIQUE,
    vendor_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(200),
    email VARCHAR(200),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    tax_id_number VARCHAR(50),
    payment_terms INT DEFAULT 30,
    credit_limit DECIMAL(20, 2) DEFAULT 0.00,
    current_balance DECIMAL(20, 2) DEFAULT 0.00,
    vendor_type ENUM('SERVICE_PROVIDER', 'SUPPLIER', 'CONTRACTOR', 'OTHER') NOT NULL,
    industry VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    rating ENUM('A', 'B', 'C', 'D') DEFAULT 'B',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Expenses
CREATE TABLE IF NOT EXISTS accounting_expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expense_number VARCHAR(50) NOT NULL UNIQUE,
    expense_date DATE NOT NULL,
    vendor_id INT NULL,
    project_id INT NULL,
    category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(100),
    amount DECIMAL(20, 2) NOT NULL,
    currency_id INT NOT NULL,
    exchange_rate DECIMAL(10, 4) DEFAULT 1.0000,
    payment_method ENUM('MPESA', 'BANK_TRANSFER', 'CASH', 'CREDIT_CARD', 'MOBILE_WALLET', 'CHEQUE', 'OTHER') NOT NULL,
    payment_status ENUM('PENDING', 'PAID', 'PARTIALLY_PAID', 'OVERDUE') DEFAULT 'PENDING',
    mpesa_transaction_id INT NULL,
    bank_transaction_id INT NULL,
    cash_transaction_id INT NULL,
    description TEXT,
    receipt_number VARCHAR(100),
    receipt_attachment_path VARCHAR(500),
    is_billable BOOLEAN DEFAULT FALSE,
    billable_client_id INT NULL,
    is_reimbursable BOOLEAN DEFAULT FALSE,
    tax_amount DECIMAL(20, 2) DEFAULT 0.00,
    tax_rate_id INT NULL,
    account_id INT NULL,
    approval_status ENUM('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED') DEFAULT 'DRAFT',
    approved_by INT NULL,
    approved_at TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (vendor_id) REFERENCES accounting_vendors(id),
    FOREIGN KEY (project_id) REFERENCES accounting_projects(id),
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (mpesa_transaction_id) REFERENCES accounting_mpesa_transactions(id),
    FOREIGN KEY (bank_transaction_id) REFERENCES accounting_bank_transactions(id),
    FOREIGN KEY (tax_rate_id) REFERENCES accounting_tax_rates(id),
    FOREIGN KEY (account_id) REFERENCES accounting_chart_of_accounts(id),
    FOREIGN KEY (approved_by) REFERENCES admin_users(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Bills/Payable Invoices
CREATE TABLE IF NOT EXISTS accounting_bills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bill_number VARCHAR(50) NOT NULL UNIQUE,
    bill_date DATE NOT NULL,
    due_date DATE NOT NULL,
    vendor_id INT NOT NULL,
    project_id INT NULL,
    currency_id INT NOT NULL,
    subtotal DECIMAL(20, 2) NOT NULL,
    tax_amount DECIMAL(20, 2) DEFAULT 0.00,
    discount_amount DECIMAL(20, 2) DEFAULT 0.00,
    total_amount DECIMAL(20, 2) NOT NULL,
    amount_paid DECIMAL(20, 2) DEFAULT 0.00,
    amount_outstanding DECIMAL(20, 2) NOT NULL,
    payment_status ENUM('DRAFT', 'RECEIVED', 'APPROVED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED') DEFAULT 'DRAFT',
    bill_type ENUM('STANDARD', 'CREDIT_NOTE', 'DEBIT_NOTE') DEFAULT 'STANDARD',
    payment_terms VARCHAR(200),
    notes TEXT,
    attachment_path VARCHAR(500),
    received_date DATE,
    approval_status ENUM('PENDING_APPROVAL', 'APPROVED', 'REJECTED') DEFAULT 'PENDING_APPROVAL',
    approved_by INT NULL,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (vendor_id) REFERENCES accounting_vendors(id),
    FOREIGN KEY (project_id) REFERENCES accounting_projects(id),
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (approved_by) REFERENCES admin_users(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Bill Line Items
CREATE TABLE IF NOT EXISTS accounting_bill_line_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bill_id INT NOT NULL,
    item_description VARCHAR(500) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(20, 2) NOT NULL,
    line_total DECIMAL(20, 2) NOT NULL,
    account_id INT NULL,
    tax_rate_id INT NULL,
    tax_amount DECIMAL(20, 2) DEFAULT 0.00,
    discount_percent DECIMAL(5, 2) DEFAULT 0.00,
    discount_amount DECIMAL(20, 2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bill_id) REFERENCES accounting_bills(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounting_chart_of_accounts(id),
    FOREIGN KEY (tax_rate_id) REFERENCES accounting_tax_rates(id)
);

-- Vendor Payments Made
CREATE TABLE IF NOT EXISTS accounting_vendor_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_number VARCHAR(50) NOT NULL UNIQUE,
    payment_date DATE NOT NULL,
    bill_id INT NULL,
    vendor_id INT NOT NULL,
    amount DECIMAL(20, 2) NOT NULL,
    currency_id INT NOT NULL,
    exchange_rate DECIMAL(10, 4) DEFAULT 1.0000,
    payment_method ENUM('MPESA', 'BANK_TRANSFER', 'CASH', 'CREDIT_CARD', 'MOBILE_WALLET', 'CHEQUE', 'OTHER') NOT NULL,
    mpesa_transaction_id INT NULL,
    bank_transaction_id INT NULL,
    cash_transaction_id INT NULL,
    reference_number VARCHAR(100),
    description TEXT,
    notes TEXT,
    allocation_status ENUM('UNALLOCATED', 'PARTIALLY_ALLOCATED', 'FULLY_ALLOCATED') DEFAULT 'UNALLOCATED',
    approval_status ENUM('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED') DEFAULT 'DRAFT',
    approved_by INT NULL,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (bill_id) REFERENCES accounting_bills(id),
    FOREIGN KEY (vendor_id) REFERENCES accounting_vendors(id),
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (mpesa_transaction_id) REFERENCES accounting_mpesa_transactions(id),
    FOREIGN KEY (bank_transaction_id) REFERENCES accounting_bank_transactions(id),
    FOREIGN KEY (approved_by) REFERENCES admin_users(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- ==========================================
-- CASH MANAGEMENT
-- ==========================================

-- Cash Accounts (Physical Cash)
CREATE TABLE IF NOT EXISTS accounting_cash_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_name VARCHAR(200) NOT NULL,
    account_type ENUM('PETTY_CASH', 'MAIN_CASH', 'FLOAT', 'RESERVE') NOT NULL,
    currency_id INT NOT NULL,
    opening_balance DECIMAL(20, 2) DEFAULT 0.00,
    current_balance DECIMAL(20, 2) DEFAULT 0.00,
    location VARCHAR(200),
    custodian_id INT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_count TIMESTAMP NULL,
    last_reconciliation TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (custodian_id) REFERENCES admin_users(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Cash Transactions
CREATE TABLE IF NOT EXISTS accounting_cash_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cash_account_id INT NOT NULL,
    transaction_type ENUM('DEPOSIT', 'WITHDRAWAL', 'TRANSFER_IN', 'TRANSFER_OUT', 'ADJUSTMENT') NOT NULL,
    amount DECIMAL(20, 2) NOT NULL,
    transaction_date DATE NOT NULL,
    description TEXT,
    category VARCHAR(100),
    sub_category VARCHAR(100),
    reference_number VARCHAR(100),
    related_transaction_id INT NULL,
    related_mpessa_transaction_id INT NULL,
    related_bank_transaction_id INT NULL,
    reconciliation_status ENUM('UNRECONCILED', 'RECONCILED') DEFAULT 'UNRECONCILED',
    approval_status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    approved_by INT NULL,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (cash_account_id) REFERENCES accounting_cash_accounts(id),
    FOREIGN KEY (approved_by) REFERENCES admin_users(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Cash Count Records
CREATE TABLE IF NOT EXISTS accounting_cash_counts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cash_account_id INT NOT NULL,
    count_date DATE NOT NULL,
    system_balance DECIMAL(20, 2) NOT NULL,
    actual_count DECIMAL(20, 2) NOT NULL,
    difference DECIMAL(20, 2) NOT NULL,
    counted_by INT NOT NULL,
    verified_by INT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cash_account_id) REFERENCES accounting_cash_accounts(id),
    FOREIGN KEY (counted_by) REFERENCES admin_users(id),
    FOREIGN KEY (verified_by) REFERENCES admin_users(id)
);

-- ==========================================
-- BUDGETING & FORECASTING
-- ==========================================

-- Budgets
CREATE TABLE IF NOT EXISTS accounting_budgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    budget_name VARCHAR(200) NOT NULL,
    budget_type ENUM('ANNUAL', 'QUARTERLY', 'MONTHLY', 'PROJECT_BASED', 'DEPARTMENT') NOT NULL,
    fiscal_year INT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    currency_id INT NOT NULL,
    total_budget DECIMAL(20, 2) NOT NULL,
    status ENUM('DRAFT', 'APPROVED', 'ACTIVE', 'CLOSED') DEFAULT 'DRAFT',
    approved_by INT NULL,
    approved_at TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (approved_by) REFERENCES admin_users(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Budget Line Items
CREATE TABLE IF NOT EXISTS accounting_budget_line_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    budget_id INT NOT NULL,
    account_id INT NOT NULL,
    budgeted_amount DECIMAL(20, 2) NOT NULL,
    actual_amount DECIMAL(20, 2) DEFAULT 0.00,
    variance DECIMAL(20, 2) DEFAULT 0.00,
    variance_percent DECIMAL(5, 2) DEFAULT 0.00,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (budget_id) REFERENCES accounting_budgets(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounting_chart_of_accounts(id)
);

-- Forecasts
CREATE TABLE IF NOT EXISTS accounting_forecasts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    forecast_name VARCHAR(200) NOT NULL,
    forecast_type ENUM('REVENUE', 'EXPENSE', 'CASH_FLOW', 'PROFITABILITY', 'LIQUIDITY') NOT NULL,
    forecast_period ENUM('WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    currency_id INT NOT NULL,
    confidence_level ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
    status ENUM('DRAFT', 'APPROVED', 'ACTIVE', 'ARCHIVED') DEFAULT 'DRAFT',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Forecast Data Points
CREATE TABLE IF NOT EXISTS accounting_forecast_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    forecast_id INT NOT NULL,
    forecast_date DATE NOT NULL,
    forecast_amount DECIMAL(20, 2) NOT NULL,
    actual_amount DECIMAL(20, 2) DEFAULT 0.00,
    variance DECIMAL(20, 2) DEFAULT 0.00,
    variance_percent DECIMAL(5, 2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (forecast_id) REFERENCES accounting_forecasts(id) ON DELETE CASCADE
);

-- ==========================================
-- TAX COMPLIANCE
-- ==========================================

-- Tax Returns
CREATE TABLE IF NOT EXISTS accounting_tax_returns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tax_type ENUM('VAT', 'INCOME_TAX', 'PAYE', 'WITHHOLDING_TAX', 'EXCISE_DUTY', 'DIGITAL_SERVICE_TAX') NOT NULL,
    return_period_start DATE NOT NULL,
    return_period_end DATE NOT NULL,
    return_period VARCHAR(50) NOT NULL,
    total_tax_liability DECIMAL(20, 2) NOT NULL,
    total_tax_paid DECIMAL(20, 2) DEFAULT 0.00,
    tax_due DECIMAL(20, 2) NOT NULL,
    currency_id INT NOT NULL,
    status ENUM('DRAFT', 'SUBMITTED', 'ACCEPTED', 'REJECTED', 'AMENDED') DEFAULT 'DRAFT',
    submission_date DATE NULL,
    kra_reference_number VARCHAR(100),
    kra_receipt_number VARCHAR(100),
    filing_method ENUM('MANUAL', 'ITAX_SYSTEM', 'API') NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Tax Payments
CREATE TABLE IF NOT EXISTS accounting_tax_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tax_return_id INT NULL,
    tax_type ENUM('VAT', 'INCOME_TAX', 'PAYE', 'WITHHOLDING_TAX', 'EXCISE_DUTY', 'DIGITAL_SERVICE_TAX') NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(20, 2) NOT NULL,
    currency_id INT NOT NULL,
    payment_method ENUM('MPESA', 'BANK_TRANSFER', 'OTHER') NOT NULL,
    reference_number VARCHAR(100),
    kra_payment_reference VARCHAR(100),
    bank_transaction_id INT NULL,
    mpesa_transaction_id INT NULL,
    status ENUM('PENDING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (tax_return_id) REFERENCES accounting_tax_returns(id),
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (bank_transaction_id) REFERENCES accounting_bank_transactions(id),
    FOREIGN KEY (mpesa_transaction_id) REFERENCES accounting_mpesa_transactions(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- ==========================================
-- AUDIT TRAIL & SECURITY
-- ==========================================

-- Audit Log
CREATE TABLE IF NOT EXISTS accounting_audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INT NOT NULL,
    action_type ENUM('INSERT', 'UPDATE', 'DELETE', 'APPROVAL', 'REJECTION') NOT NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    changed_fields JSON NULL,
    user_id INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES admin_users(id)
);

-- User Permissions for Accounting
CREATE TABLE IF NOT EXISTS accounting_user_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    permission_category ENUM('INVOICES', 'PAYMENTS', 'EXPENSES', 'REPORTS', 'BANKING', 'MPESA', 'TAX', 'SETTINGS', 'APPROVALS') NOT NULL,
    permission_level ENUM('VIEW', 'EDIT', 'CREATE', 'DELETE', 'APPROVE', 'ADMIN') NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by INT NOT NULL,
    expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES admin_users(id),
    FOREIGN KEY (granted_by) REFERENCES admin_users(id)
);

-- ==========================================
-- REPORTS & ANALYTICS
-- ==========================================

-- Saved Reports
CREATE TABLE IF NOT EXISTS accounting_saved_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_name VARCHAR(200) NOT NULL,
    report_type ENUM('PROFIT_LOSS', 'BALANCE_SHEET', 'CASH_FLOW', 'AGED_RECEIVABLES', 'AGED_PAYABLES', 'REVENUE_ANALYSIS', 'EXPENSE_ANALYSIS', 'LIQUIDITY_ANALYSIS', 'CUSTOM') NOT NULL,
    report_config JSON NOT NULL,
    created_by INT NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Report Schedules
CREATE TABLE IF NOT EXISTS accounting_report_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_name VARCHAR(200) NOT NULL,
    report_type ENUM('PROFIT_LOSS', 'BALANCE_SHEET', 'CASH_FLOW', 'AGED_RECEIVABLES', 'AGED_PAYABLES', 'CUSTOM') NOT NULL,
    report_config JSON NOT NULL,
    schedule_frequency ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL') NOT NULL,
    next_run_date DATETIME NOT NULL,
    last_run_date DATETIME NULL,
    is_active BOOLEAN DEFAULT TRUE,
    recipients TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- ==========================================
-- NOTIFICATIONS & ALERTS
-- ==========================================

-- Accounting Notifications
CREATE TABLE IF NOT EXISTS accounting_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    notification_type ENUM('PAYMENT_RECEIVED', 'INVOICE_OVERDUE', 'BILL_DUE', 'LIQUIDITY_LOW', 'BUDGET_EXCEEDED', 'TAX_DUE', 'APPROVAL_REQUIRED', 'PAYMENT_FAILED') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    related_entity_type VARCHAR(50),
    related_entity_id INT,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES admin_users(id)
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

-- Bank Transactions Indexes
CREATE INDEX idx_bank_account_id ON accounting_bank_transactions(bank_account_id);
CREATE INDEX idx_transaction_date ON accounting_bank_transactions(transaction_date);
CREATE INDEX idx_reconciliation_status ON accounting_bank_transactions(reconciliation_status);

-- M-Pesa Transactions Indexes
CREATE INDEX idx_mpesa_account_id ON accounting_mpesa_transactions(mpesa_account_id);
CREATE INDEX idx_transaction_type ON accounting_mpesa_transactions(transaction_type);
CREATE INDEX idx_transaction_status ON accounting_mpesa_transactions(transaction_status);
CREATE INDEX idx_transaction_time ON accounting_mpesa_transactions(transaction_time);

-- Invoice Indexes
CREATE INDEX idx_invoice_client_id ON accounting_invoices(client_id);
CREATE INDEX idx_invoice_status ON accounting_invoices(payment_status);
CREATE INDEX idx_invoice_date ON accounting_invoices(invoice_date);
CREATE INDEX idx_due_date ON accounting_invoices(due_date);

-- Expense Indexes
CREATE INDEX idx_expense_vendor_id ON accounting_expenses(vendor_id);
CREATE INDEX idx_expense_date ON accounting_expenses(expense_date);
CREATE INDEX idx_expense_category ON accounting_expenses(category);

-- Payment Indexes
CREATE INDEX idx_payment_client_id ON accounting_payments_received(client_id);
CREATE INDEX idx_payment_date ON accounting_payments_received(payment_date);
CREATE INDEX idx_payment_status ON accounting_payments_received(allocation_status);

-- Audit Log Indexes
CREATE INDEX idx_audit_table ON accounting_audit_log(table_name);
CREATE INDEX idx_audit_user ON accounting_audit_log(user_id);
CREATE INDEX idx_audit_timestamp ON accounting_audit_log(timestamp);

-- ==========================================
-- DEFAULT DATA
-- ==========================================

-- Insert default currency (Kenya Shilling)
INSERT INTO accounting_currencies (currency_code, currency_name, currency_symbol, exchange_rate, is_base_currency, is_active) VALUES
('KES', 'Kenya Shilling', 'KSh', 1.0000, TRUE, TRUE),
('USD', 'US Dollar', '$', 0.0070, FALSE, TRUE),
('EUR', 'Euro', '€', 0.0064, FALSE, TRUE),
('GBP', 'British Pound', '£', 0.0055, FALSE, TRUE);

-- Insert default Kenya tax rates
INSERT INTO accounting_tax_rates (tax_name, tax_rate, tax_type, tax_code, description, effective_date, kra_tax_code, is_active) VALUES
('VAT Standard', 0.1600, 'VAT', 'VAT_STD', 'Standard VAT Rate for Kenya', '2021-01-01', 'A1', TRUE),
('VAT Exempt', 0.0000, 'VAT', 'VAT_EXM', 'VAT Exempt Goods and Services', '2021-01-01', 'A2', TRUE),
('PAYE Band 1', 0.1000, 'PAYE', 'PAYE_1', 'PAYE Rate Band 1', '2021-01-01', 'P1', TRUE),
('PAYE Band 2', 0.1500, 'PAYE', 'PAYE_2', 'PAYE Rate Band 2', '2021-01-01', 'P2', TRUE),
('PAYE Band 3', 0.2000, 'PAYE', 'PAYE_3', 'PAYE Rate Band 3', '2021-01-01', 'P3', TRUE),
('PAYE Band 4', 0.2500, 'PAYE', 'PAYE_4', 'PAYE Rate Band 4', '2021-01-01', 'P4', TRUE),
('PAYE Band 5', 0.3000, 'PAYE', 'PAYE_5', 'PAYE Rate Band 5', '2021-01-01', 'P5', TRUE),
('Withholding Tax Consulting', 0.0500, 'WITHHOLDING_TAX', 'WHT_CONS', 'Withholding Tax on Consulting Services', '2021-01-01', 'W1', TRUE),
('Withholding Tax Rent', 0.1000, 'WITHHOLDING_TAX', 'WHT_RENT', 'Withholding Tax on Rent', '2021-01-01', 'W2', TRUE),
('Excise Duty Mobile Money', 0.0020, 'EXCISE_DUTY', 'EXC_MM', 'Excise Duty on Mobile Money Transfers', '2021-01-01', 'E1', TRUE),
('Digital Service Tax', 0.0150, 'DIGITAL_SERVICE_TAX', 'DST_1', 'Digital Service Tax', '2021-01-01', 'D1', TRUE);

-- Insert basic chart of accounts
INSERT INTO accounting_chart_of_accounts (account_code, account_name, account_type, sub_type, account_level, is_system, description) VALUES
('1000', 'ASSETS', 'ASSET', 'CURRENT_ASSET', 1, TRUE, 'Total Assets'),
('1100', 'CURRENT ASSETS', 'ASSET', 'CURRENT_ASSET', 2, TRUE, 'Current Assets'),
('1110', 'Cash and Cash Equivalents', 'ASSET', 'CURRENT_ASSET', 3, TRUE, 'Cash, Bank Accounts, M-Pesa'),
('1111', 'Bank Accounts', 'ASSET', 'CURRENT_ASSET', 4, TRUE, 'Bank Accounts'),
('1112', 'M-Pesa Accounts', 'ASSET', 'CURRENT_ASSET', 4, TRUE, 'M-Pesa Mobile Money Accounts'),
('1113', 'Petty Cash', 'ASSET', 'CURRENT_ASSET', 4, TRUE, 'Petty Cash'),
('1120', 'Accounts Receivable', 'ASSET', 'CURRENT_ASSET', 3, TRUE, 'Accounts Receivable'),
('1130', 'Other Current Assets', 'ASSET', 'CURRENT_ASSET', 3, TRUE, 'Other Current Assets'),
('1200', 'FIXED ASSETS', 'ASSET', 'FIXED_ASSET', 2, TRUE, 'Fixed Assets'),
('1210', 'Equipment', 'ASSET', 'FIXED_ASSET', 3, TRUE, 'Office Equipment'),
('1220', 'Vehicles', 'ASSET', 'FIXED_ASSET', 3, TRUE, 'Company Vehicles'),
('1230', 'Furniture and Fixtures', 'ASSET', 'FIXED_ASSET', 3, TRUE, 'Office Furniture'),
('2000', 'LIABILITIES', 'LIABILITY', 'CURRENT_LIABILITY', 1, TRUE, 'Total Liabilities'),
('2100', 'CURRENT LIABILITIES', 'LIABILITY', 'CURRENT_LIABILITY', 2, TRUE, 'Current Liabilities'),
('2110', 'Accounts Payable', 'LIABILITY', 'CURRENT_LIABILITY', 3, TRUE, 'Accounts Payable'),
('2120', 'Accrued Expenses', 'LIABILITY', 'CURRENT_LIABILITY', 3, TRUE, 'Accrued Expenses'),
('2130', 'Tax Payable', 'LIABILITY', 'CURRENT_LIABILITY', 3, TRUE, 'Tax Payable'),
('3000', 'EQUITY', 'EQUITY', 'RETAINED_EARNINGS', 1, TRUE, 'Total Equity'),
('3100', 'Owner Equity', 'EQUITY', 'RETAINED_EARNINGS', 2, TRUE, 'Owner Equity'),
('3200', 'Retained Earnings', 'EQUITY', 'RETAINED_EARNINGS', 2, TRUE, 'Retained Earnings'),
('4000', 'REVENUE', 'REVENUE', 'OPERATING_REVENUE', 1, TRUE, 'Total Revenue'),
('4100', 'Consulting Revenue', 'REVENUE', 'OPERATING_REVENUE', 2, TRUE, 'Consulting Services Revenue'),
('4200', 'Project Revenue', 'REVENUE', 'OPERATING_REVENUE', 2, TRUE, 'Project Management Revenue'),
('4300', 'Training Revenue', 'REVENUE', 'OPERATING_REVENUE', 2, TRUE, 'Training and Certification Revenue'),
('5000', 'EXPENSES', 'EXPENSE', 'OPERATING_EXPENSE', 1, TRUE, 'Total Expenses'),
('5100', 'Operating Expenses', 'EXPENSE', 'OPERATING_EXPENSE', 2, TRUE, 'Operating Expenses'),
('5110', 'Salaries and Wages', 'EXPENSE', 'OPERATING_EXPENSE', 3, TRUE, 'Employee Compensation'),
('5120', 'Rent and Utilities', 'EXPENSE', 'OPERATING_EXPENSE', 3, TRUE, 'Office Rent and Utilities'),
('5130', 'Software and Subscriptions', 'EXPENSE', 'OPERATING_EXPENSE', 3, TRUE, 'Software Licenses'),
('5140', 'Marketing and Advertising', 'EXPENSE', 'OPERATING_EXPENSE', 3, TRUE, 'Marketing Expenses'),
('5150', 'Professional Fees', 'EXPENSE', 'OPERATING_EXPENSE', 3, TRUE, 'Professional Services Fees'),
('5200', 'Transaction Fees', 'EXPENSE', 'OPERATING_EXPENSE', 2, TRUE, 'Bank and M-Pesa Transaction Fees');

-- =====================================================
-- SECTION: USER MANAGEMENT & ACTIVITY LOGGING
-- =====================================================

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

INSERT INTO user_permissions (user_id, user_type, permission_name, permission_value)
SELECT id, 'admin', 'users.manage', 'admin' FROM admin_users WHERE deleted_at IS NULL AND admin_level = 'super_admin'
ON DUPLICATE KEY UPDATE permission_value = 'admin';

INSERT INTO user_permissions (user_id, user_type, permission_name, permission_value)
SELECT id, 'admin', 'projects.manage', 'admin' FROM admin_users WHERE deleted_at IS NULL AND admin_level = 'super_admin'
ON DUPLICATE KEY UPDATE permission_value = 'admin';

INSERT INTO user_permissions (user_id, user_type, permission_name, permission_value)
SELECT id, 'admin', 'content.manage', 'admin' FROM admin_users WHERE deleted_at IS NULL AND admin_level = 'super_admin'
ON DUPLICATE KEY UPDATE permission_value = 'admin';

INSERT INTO user_permissions (user_id, user_type, permission_name, permission_value)
SELECT id, 'admin', 'users.view', 'read' FROM admin_users WHERE deleted_at IS NULL AND admin_level = 'admin'
ON DUPLICATE KEY UPDATE permission_value = 'read';

INSERT INTO user_permissions (user_id, user_type, permission_name, permission_value)
SELECT id, 'admin', 'projects.view', 'read' FROM admin_users WHERE deleted_at IS NULL AND admin_level = 'admin'
ON DUPLICATE KEY UPDATE permission_value = 'read';

-- =============================================
-- Table: quick_links
-- Navigation links for website
-- =============================================
CREATE TABLE IF NOT EXISTS quick_links (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(512) NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    icon_name VARCHAR(100),
    route_path VARCHAR(255),
    link_type VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_quick_links_order (display_order),
    INDEX idx_quick_links_active (is_active),
    INDEX idx_link_type (link_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default quick links
INSERT INTO quick_links (title, url, icon_name, route_path, display_order, is_active, link_type) VALUES
('Home', '/', NULL, '/', 1, TRUE, 'navbar'),
('About Us', '/about', NULL, '/about', 2, TRUE, 'navbar'),
('Our Services', '/services', NULL, '/services', 3, TRUE, 'navbar'),
('Blog', '/blog', NULL, '/blog', 4, TRUE, 'navbar'),
('Contact', '/contact', NULL, '/contact', 5, TRUE, 'navbar'),
('Our Companies', '/about', NULL, '/about', 6, TRUE, 'navbar');

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT 'Complete database schema created successfully with all tables and test users!' as message;