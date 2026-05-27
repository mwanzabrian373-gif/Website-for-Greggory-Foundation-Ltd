const mysql = require('mysql2');
require('dotenv').config();
const fs = require('fs');

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'greggory_foundation_db';

console.log('Adding quick_links table...');

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  multipleStatements: true
});

const sql = `
CREATE TABLE IF NOT EXISTS quick_links (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(512) NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_quick_links_order (display_order),
    INDEX idx_quick_links_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default quick links if they don't exist
INSERT IGNORE INTO quick_links (title, url, display_order, is_active) VALUES
('Home', '/', 1, TRUE),
('About Us', '/about', 2, TRUE),
('Our Services', '/services', 3, TRUE),
('Case Studies', '/case-studies', 4, TRUE),
('Blog', '/blog', 5, TRUE);
`;

connection.query(sql, (err, results) => {
  if (err) {
    console.error('Error adding quick_links table:', err.message);
    connection.end();
    process.exit(1);
  } else {
    console.log('✓ quick_links table created successfully');
    console.log('✓ Default quick links inserted');
    connection.end();
    process.exit(0);
  }
});
