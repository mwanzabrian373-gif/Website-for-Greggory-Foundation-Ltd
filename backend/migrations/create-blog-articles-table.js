const mysql = require('mysql2');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'greggory_foundation_db';

console.log('Creating blog_articles table...');

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  multipleStatements: true
});

const sql = `
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
    INDEX idx_blog_articles_published (is_published, published_date),
    INDEX idx_blog_articles_category (category),
    INDEX idx_blog_articles_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

connection.query(sql, (err, results) => {
  if (err) {
    console.error('Error creating blog_articles table:', err.message);
    connection.end();
    process.exit(1);
  } else {
    console.log('✓ blog_articles table created successfully');
    connection.end();
    process.exit(0);
  }
});
