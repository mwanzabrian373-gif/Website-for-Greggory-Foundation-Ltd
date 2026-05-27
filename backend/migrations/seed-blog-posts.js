const mysql = require('mysql2');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'greggory_foundation_db';

console.log('Seeding blog posts...');

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  multipleStatements: true
});

const blogPosts = [
  {
    title: 'Why Your Business Strategy is a Project Portfolio',
    excerpt: 'Discover how viewing your business strategy as a collection of interconnected projects can transform your organizational effectiveness and strategic execution.',
    content: 'Discover how viewing your business strategy as a collection of interconnected projects can transform your organizational effectiveness and strategic execution. Learn the key principles of strategic project management and how to align your project portfolio with business objectives.',
    author: 'Dr. James Greggory',
    read_time: '8 min read',
    category: 'Business Strategy',
    image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop',
    icon_class: 'Target',
    is_published: true
  },
  {
    title: '5 Project Management Principles to Improve Daily Operations',
    excerpt: 'Learn how to apply core project management principles to your everyday business operations for increased efficiency, clarity, and results.',
    content: 'Learn how to apply core project management principles to your everyday business operations for increased efficiency, clarity, and results. This article explores five fundamental principles that can transform your operational excellence.',
    author: 'Sarah Mitchell',
    read_time: '6 min read',
    category: 'Operations',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
    icon_class: 'TrendingUp',
    is_published: true
  },
  {
    title: 'Agile vs. Waterfall: Choosing the Right Path for Your Innovation Project',
    excerpt: 'A comprehensive comparison of Agile and Waterfall methodologies to help you select the best approach for your specific innovation initiatives.',
    content: 'A comprehensive comparison of Agile and Waterfall methodologies to help you select the best approach for your specific innovation initiatives. Understand the strengths and weaknesses of each methodology and when to apply them.',
    author: 'Marcus Thompson',
    read_time: '10 min read',
    category: 'Innovation',
    image_url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=500&fit=crop',
    icon_class: 'Lightbulb',
    is_published: true
  },
  {
    title: 'The Role of Change Management in Successful Business Improvement',
    excerpt: 'Why technical solutions alone aren\'t enough. Understanding the critical human element in driving sustainable business transformation.',
    content: 'Why technical solutions alone aren\'t enough. Understanding the critical human element in driving sustainable business transformation. Explore the people side of change and how to ensure your improvement initiatives succeed.',
    author: 'Elena Rodriguez',
    read_time: '7 min read',
    category: 'Change Management',
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
    icon_class: 'BookOpen',
    is_published: true
  },
  {
    title: 'Building a Project Management Office (PMO): A Starter Guide',
    excerpt: 'Step-by-step guidance on establishing a PMO that drives consistency, improves project success rates, and builds organizational capability.',
    content: 'Step-by-step guidance on establishing a PMO that drives consistency, improves project success rates, and builds organizational capability. Learn the essential components of a successful PMO and how to implement them effectively.',
    author: 'Dr. James Greggory',
    read_time: '12 min read',
    category: 'Project Management',
    image_url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=500&fit=crop',
    icon_class: 'Target',
    is_published: true
  },
  {
    title: 'Measuring Project Success: Beyond On-Time and On-Budget',
    excerpt: 'Expand your definition of project success with comprehensive metrics that capture true business value and stakeholder satisfaction.',
    content: 'Expand your definition of project success with comprehensive metrics that capture true business value and stakeholder satisfaction. Discover how to measure what truly matters for project success.',
    author: 'Sarah Mitchell',
    read_time: '9 min read',
    category: 'Project Management',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    icon_class: 'TrendingUp',
    is_published: true
  }
];

const sql = `
-- Clear existing blog posts
DELETE FROM blog_articles;

-- Insert hardcoded blog posts
INSERT INTO blog_articles (title, excerpt, content, author, read_time, category, image_url, icon_class, is_published, published_date) VALUES
(?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()),
(?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()),
(?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()),
(?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()),
(?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()),
(?, ?, ?, ?, ?, ?, ?, ?, ?, NOW());
`;

const values = blogPosts.flatMap(post => [
  post.title,
  post.excerpt,
  post.content,
  post.author,
  post.read_time,
  post.category,
  post.image_url,
  post.icon_class,
  post.is_published
]);

connection.query(sql, values, (err, results) => {
  if (err) {
    console.error('Error seeding blog posts:', err.message);
    connection.end();
    process.exit(1);
  } else {
    console.log('✓ Blog posts seeded successfully');
    console.log(`✓ Inserted ${blogPosts.length} blog posts`);
    connection.end();
    process.exit(0);
  }
});
