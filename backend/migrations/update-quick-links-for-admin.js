const mysql = require('mysql2');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'greggory_foundation_db';

console.log('Updating quick_links table for admin navbar...');

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  multipleStatements: true
});

const sql = `
-- Drop existing table and recreate with proper structure
DROP TABLE IF EXISTS quick_links;

CREATE TABLE quick_links (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(512) NOT NULL,
    icon_name VARCHAR(50),
    route_path VARCHAR(255),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    link_type ENUM('footer', 'admin') DEFAULT 'footer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_quick_links_order (display_order),
    INDEX idx_quick_links_active (is_active),
    INDEX idx_quick_links_type (link_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert admin navbar quick links
INSERT INTO quick_links (title, url, icon_name, route_path, display_order, is_active, link_type) VALUES
('Manage Users', '/admin/users', 'Users', '/admin/users', 1, TRUE, 'admin'),
('Projects', '/admin/projects', 'FolderKanban', '/admin/projects', 2, TRUE, 'admin'),
('Applications', '/admin/applications', 'ClipboardList', '/admin/applications', 3, TRUE, 'admin'),
('Settings', '/admin/settings', 'Settings', '/admin/settings', 4, TRUE, 'admin'),
('Content', '/admin/content', 'Briefcase', '/admin/content', 5, TRUE, 'admin'),
('Analytics', '/admin/analytics', 'BarChart3', '/admin/analytics', 6, TRUE, 'admin'),
('Reports', '/admin/reports', 'FileText', '/admin/reports', 7, TRUE, 'admin'),
('Communication', '/admin/communication', 'MessageSquare', '/admin/communication', 8, TRUE, 'admin'),
('Support', '/admin/support', 'HelpCircle', '/admin/support', 9, TRUE, 'admin'),
('Security', '/admin/security', 'ShieldCheck', '/admin/security', 10, TRUE, 'admin'),
('Financial', '/admin/financial', 'Calculator', '/admin/financial', 11, TRUE, 'admin'),
('CRM', '/admin/crm', 'Building2', '/admin/crm', 12, TRUE, 'admin'),
('Tasks', '/admin/tasks', 'CheckSquare', '/admin/tasks', 13, TRUE, 'admin'),
('Developer', '/admin/developer', 'Code2', '/admin/developer', 14, TRUE, 'admin');
`;

connection.query(sql, (err, results) => {
  if (err) {
    console.error('Error updating quick_links table:', err.message);
    connection.end();
    process.exit(1);
  } else {
    console.log('✓ quick_links table updated for admin navbar');
    console.log('✓ Admin navbar quick links inserted');
    connection.end();
    process.exit(0);
  }
});
