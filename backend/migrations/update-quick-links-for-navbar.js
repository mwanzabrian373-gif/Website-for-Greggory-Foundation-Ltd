const mysql = require('mysql2');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'greggory_foundation_db';

console.log('Updating quick_links table to support user navigation...');

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  multipleStatements: true
});

const sql = `
-- Modify the quick_links table to add 'navbar' link_type
ALTER TABLE quick_links 
MODIFY COLUMN link_type ENUM('footer', 'admin', 'navbar') DEFAULT 'footer';

-- Insert user navbar navigation items
INSERT INTO quick_links (title, url, icon_name, route_path, display_order, is_active, link_type) VALUES
('Home', '/', 'Home', '/', 1, TRUE, 'navbar'),
('About Us', '/about', 'Info', '/about', 2, TRUE, 'navbar'),
('Our Companies', '#', 'Building2', '#', 3, TRUE, 'navbar'),
('Our Services', '/services', 'Briefcase', '/services', 4, TRUE, 'navbar'),
('Blog', '/blog', 'FileText', '/blog', 5, TRUE, 'navbar'),
('Contact', '/contact', 'Mail', '/contact', 6, TRUE, 'navbar');
`;

connection.query(sql, (err, results) => {
  if (err) {
    console.error('Error updating quick_links table:', err.message);
    connection.end();
    process.exit(1);
  } else {
    console.log('✓ quick_links table updated to support navbar link_type');
    console.log('✓ User navbar navigation items inserted');
    connection.end();
    process.exit(0);
  }
});