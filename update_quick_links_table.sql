-- Add missing columns to quick_links table for navbar functionality
ALTER TABLE quick_links ADD COLUMN IF NOT EXISTS icon_name VARCHAR(100);
ALTER TABLE quick_links ADD COLUMN IF NOT EXISTS route_path VARCHAR(255);
ALTER TABLE quick_links ADD COLUMN IF NOT EXISTS link_type VARCHAR(50) DEFAULT 'general';

-- Add index for link_type
ALTER TABLE quick_links ADD INDEX IF NOT EXISTS idx_link_type (link_type);

-- Clear existing quick_links data to avoid conflicts
TRUNCATE TABLE quick_links;

-- Insert default navbar items with proper link_type
INSERT INTO quick_links (title, url, icon_name, route_path, display_order, is_active, link_type) VALUES
('Home', '/', NULL, '/', 1, TRUE, 'navbar'),
('About Us', '/about', NULL, '/about', 2, TRUE, 'navbar'),
('Our Services', '/services', NULL, '/services', 3, TRUE, 'navbar'),
('Blog', '/blog', NULL, '/blog', 4, TRUE, 'navbar'),
('Contact', '/contact', NULL, '/contact', 5, TRUE, 'navbar'),
('Our Companies', '/about', NULL, '/about', 6, TRUE, 'navbar');