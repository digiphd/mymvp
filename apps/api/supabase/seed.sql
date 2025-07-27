-- MyMVP Dashboard - Development Seed Data
-- This file contains sample data for development and testing

-- Note: This seed data is included in the migration for convenience
-- In production, remove the sample data section from the migration
-- and use this file separately for local development

-- Clean existing data (if any)
TRUNCATE TABLE message_reads, messages, files, project_updates, project_tasks, projects, developer_availability, users RESTART IDENTITY CASCADE;

-- =====================
-- SAMPLE USERS
-- =====================

-- Admin user (admin@mymvp.io / admin123)
INSERT INTO users (email, name, password_hash, role, created_at) VALUES 
('admin@mymvp.io', 'System Admin', '$2b$12$rBV2HQ/xsvx0/ZV.bJM4ou1LTgX2uiJQ7J1fW5vu6xgSANYQlHXHi', 'admin', NOW());

-- Developer users
INSERT INTO users (email, name, password_hash, role, skills, hourly_rate, timezone, bio, created_at) VALUES 
('john@mymvp.io', 'John Developer', '$2b$12$rBV2HQ/xsvx0/ZV.bJM4ou1LTgX2uiJQ7J1fW5vu6xgSANYQlHXHi', 'developer', 
 '["React", "Node.js", "TypeScript", "PostgreSQL", "Next.js", "AWS"]', 7500, 'America/New_York', 
 'Full-stack developer with 5+ years experience building scalable web applications. Specializes in React ecosystems and Node.js backends.'),

('sarah@mymvp.io', 'Sarah Johnson', '$2b$12$rBV2HQ/xsvx0/ZV.bJM4ou1LTgX2uiJQ7J1fW5vu6xgSANYQlHXHi', 'developer', 
 '["Vue.js", "Python", "Django", "MySQL", "Docker", "GCP"]', 8000, 'America/Los_Angeles', 
 'Experienced full-stack developer with expertise in Python/Django and modern frontend frameworks. Strong DevOps background.'),

('mike@mymvp.io', 'Mike Chen', '$2b$12$rBV2HQ/xsvx0/ZV.bJM4ou1LTgX2uiJQ7J1fW5vu6xgSANYQlHXHi', 'developer', 
 '["React Native", "Swift", "Kotlin", "Firebase", "MongoDB"]', 9000, 'America/Chicago', 
 'Mobile-first developer specializing in cross-platform apps. Expert in React Native with native iOS/Android experience.');

-- Customer users
INSERT INTO users (email, name, password_hash, role, created_at) VALUES 
('alice@techstartup.com', 'Alice Cooper', '$2b$12$rBV2HQ/xsvx0/ZV.bJM4ou1LTgX2uiJQ7J1fW5vu6xgSANYQlHXHi', 'customer', NOW()),
('bob@innovate.co', 'Bob Williams', '$2b$12$rBV2HQ/xsvx0/ZV.bJM4ou1LTgX2uiJQ7J1fW5vu6xgSANYQlHXHi', 'customer', NOW()),
('emma@foodtech.io', 'Emma Davis', '$2b$12$rBV2HQ/xsvx0/ZV.bJM4ou1LTgX2uiJQ7J1fW5vu6xgSANYQlHXHi', 'customer', NOW());

-- =====================
-- SAMPLE PROJECTS
-- =====================

-- Project 1: E-commerce Platform (In Progress)
INSERT INTO projects (
  customer_id, 
  assigned_developer_id,
  title, 
  description, 
  type, 
  status,
  priority,
  price_cents, 
  developer_budget_cents,
  start_date,
  delivery_date,
  preview_url,
  requirements_doc,
  technical_requirements,
  estimated_hours,
  actual_hours,
  created_at
) VALUES (
  (SELECT id FROM users WHERE email = 'alice@techstartup.com'),
  (SELECT id FROM users WHERE email = 'john@mymvp.io'),
  'TechStartup E-commerce Platform',
  'Modern e-commerce platform for selling tech products with advanced filtering, user reviews, and subscription management.',
  'mvp',
  'building',
  'high',
  1500000,  -- $15,000
  750000,   -- $7,500 to developer
  '2024-01-15',
  '2024-02-28',
  'https://techstartup-preview.vercel.app',
  'Complete e-commerce solution with React frontend, Node.js backend, PostgreSQL database, Stripe payments, and admin dashboard.',
  '{"frontend": "React + Next.js 14", "backend": "Node.js + Express", "database": "PostgreSQL", "payments": "Stripe", "hosting": "Vercel + Railway", "features": ["product catalog", "user auth", "shopping cart", "payments", "admin panel", "reviews"]}',
  200,
  85,
  NOW() - INTERVAL '15 days'
);

-- Project 2: SaaS Dashboard (Planning)
INSERT INTO projects (
  customer_id, 
  assigned_developer_id,
  title, 
  description, 
  type, 
  status,
  priority,
  price_cents, 
  developer_budget_cents,
  start_date,
  delivery_date,
  requirements_doc,
  technical_requirements,
  estimated_hours,
  created_at
) VALUES (
  (SELECT id FROM users WHERE email = 'bob@innovate.co'),
  (SELECT id FROM users WHERE email = 'sarah@mymvp.io'),
  'Innovate Analytics Dashboard',
  'Real-time analytics dashboard for tracking business metrics with custom charts, data export, and team collaboration features.',
  'mvp',
  'assigned',
  'medium',
  1000000,  -- $10,000
  500000,   -- $5,000 to developer
  '2024-02-01',
  '2024-03-15',
  'Business intelligence dashboard with Vue.js frontend, Python/Django backend, and integration with multiple data sources.',
  '{"frontend": "Vue.js 3 + Vuetify", "backend": "Python + Django", "database": "PostgreSQL + Redis", "integrations": ["Google Analytics", "Stripe", "HubSpot"], "hosting": "GCP", "features": ["real-time charts", "data export", "team management", "custom reports"]}',
  160,
  0,
  NOW() - INTERVAL '5 days'
);

-- Project 3: Food Delivery App (Proof of Concept)
INSERT INTO projects (
  customer_id, 
  title, 
  description, 
  type, 
  status,
  priority,
  price_cents, 
  start_date,
  delivery_date,
  requirements_doc,
  technical_requirements,
  estimated_hours,
  created_at
) VALUES (
  (SELECT id FROM users WHERE email = 'emma@foodtech.io'),
  'FoodTech Mobile App PoC',
  'Mobile app proof of concept for local food delivery with restaurant discovery, ordering, and real-time tracking.',
  'poc',
  'planning',
  'low',
  500000,   -- $5,000
  '2024-02-15',
  '2024-03-01',
  'Mobile-first proof of concept to validate the food delivery concept with basic ordering flow and restaurant integration.',
  '{"platform": "React Native", "backend": "Firebase", "payments": "Stripe", "maps": "Google Maps API", "features": ["restaurant listing", "basic ordering", "user auth", "simple tracking"]}',
  80,
  0,
  NOW() - INTERVAL '2 days'
);

-- =====================
-- SAMPLE TASKS
-- =====================

-- Tasks for Project 1 (E-commerce Platform)
INSERT INTO project_tasks (
  project_id,
  assigned_developer_id,
  title,
  description,
  status,
  priority,
  estimated_hours,
  actual_hours,
  due_date,
  labels,
  created_by,
  created_at
) VALUES 
-- Completed tasks
(
  (SELECT id FROM projects WHERE title = 'TechStartup E-commerce Platform'),
  (SELECT id FROM users WHERE email = 'john@mymvp.io'),
  'Project Setup & Architecture',
  'Initialize Next.js project, set up database schema, configure deployment pipeline',
  'completed',
  'high',
  12.0,
  10.5,
  NOW() - INTERVAL '12 days',
  '["setup", "architecture", "devops"]',
  (SELECT id FROM users WHERE email = 'admin@mymvp.io'),
  NOW() - INTERVAL '15 days'
),
(
  (SELECT id FROM projects WHERE title = 'TechStartup E-commerce Platform'),
  (SELECT id FROM users WHERE email = 'john@mymvp.io'),
  'User Authentication System',
  'Implement JWT-based auth with registration, login, password reset, and profile management',
  'completed',
  'high',
  16.0,
  15.5,
  NOW() - INTERVAL '8 days',
  '["auth", "backend", "security"]',
  (SELECT id FROM users WHERE email = 'admin@mymvp.io'),
  NOW() - INTERVAL '14 days'
),
(
  (SELECT id FROM projects WHERE title = 'TechStartup E-commerce Platform'),
  (SELECT id FROM users WHERE email = 'john@mymvp.io'),
  'Product Catalog Backend API',
  'Build REST API for product management with categories, search, and filtering',
  'completed',
  'high',
  20.0,
  18.0,
  NOW() - INTERVAL '4 days',
  '["api", "backend", "products"]',
  (SELECT id FROM users WHERE email = 'admin@mymvp.io'),
  NOW() - INTERVAL '12 days'
),
-- Current tasks
(
  (SELECT id FROM projects WHERE title = 'TechStartup E-commerce Platform'),
  (SELECT id FROM users WHERE email = 'john@mymvp.io'),
  'Product Catalog Frontend',
  'Build responsive product listing pages with search, filters, and pagination',
  'in_progress',
  'high',
  24.0,
  16.0,
  NOW() + INTERVAL '3 days',
  '["frontend", "products", "responsive"]',
  (SELECT id FROM users WHERE email = 'admin@mymvp.io'),
  NOW() - INTERVAL '8 days'
),
(
  (SELECT id FROM projects WHERE title = 'TechStartup E-commerce Platform'),
  (SELECT id FROM users WHERE email = 'john@mymvp.io'),
  'Shopping Cart System',
  'Implement add to cart, cart persistence, quantity updates, and cart summary',
  'in_progress',
  'high',
  18.0,
  8.5,
  NOW() + INTERVAL '6 days',
  '["frontend", "cart", "state-management"]',
  (SELECT id FROM users WHERE email = 'admin@mymvp.io'),
  NOW() - INTERVAL '6 days'
),
-- Upcoming tasks
(
  (SELECT id FROM projects WHERE title = 'TechStartup E-commerce Platform'),
  (SELECT id FROM users WHERE email = 'john@mymvp.io'),
  'Stripe Payment Integration',
  'Integrate Stripe for secure payment processing with checkout flow',
  'todo',
  'high',
  16.0,
  0.0,
  NOW() + INTERVAL '10 days',
  '["payments", "stripe", "security"]',
  (SELECT id FROM users WHERE email = 'admin@mymvp.io'),
  NOW() - INTERVAL '10 days'
),
(
  (SELECT id FROM projects WHERE title = 'TechStartup E-commerce Platform'),
  (SELECT id FROM users WHERE email = 'john@mymvp.io'),
  'Order Management System',
  'Build order tracking, history, and status updates for customers',
  'todo',
  'medium',
  20.0,
  0.0,
  NOW() + INTERVAL '15 days',
  '["orders", "backend", "frontend"]',
  (SELECT id FROM users WHERE email = 'admin@mymvp.io'),
  NOW() - INTERVAL '10 days'
),
(
  (SELECT id FROM projects WHERE title = 'TechStartup E-commerce Platform'),
  (SELECT id FROM users WHERE email = 'john@mymvp.io'),
  'Admin Dashboard',
  'Create admin interface for product management, order processing, and analytics',
  'todo',
  'medium',
  28.0,
  0.0,
  NOW() + INTERVAL '20 days',
  '["admin", "dashboard", "management"]',
  (SELECT id FROM users WHERE email = 'admin@mymvp.io'),
  NOW() - INTERVAL '10 days'
);

-- Tasks for Project 2 (Analytics Dashboard)
INSERT INTO project_tasks (
  project_id,
  assigned_developer_id,
  title,
  description,
  status,
  priority,
  estimated_hours,
  due_date,
  labels,
  created_by,
  created_at
) VALUES 
(
  (SELECT id FROM projects WHERE title = 'Innovate Analytics Dashboard'),
  (SELECT id FROM users WHERE email = 'sarah@mymvp.io'),
  'Project Architecture & Setup',
  'Set up Vue.js 3 project with Django backend and establish data pipeline architecture',
  'todo',
  'high',
  14.0,
  NOW() + INTERVAL '7 days',
  '["setup", "architecture", "vue", "django"]',
  (SELECT id FROM users WHERE email = 'admin@mymvp.io'),
  NOW() - INTERVAL '3 days'
),
(
  (SELECT id FROM projects WHERE title = 'Innovate Analytics Dashboard'),
  (SELECT id FROM users WHERE email = 'sarah@mymvp.io'),
  'Data Integration Layer',
  'Build integrations with Google Analytics, Stripe, and HubSpot APIs',
  'todo',
  'high',
  20.0,
  NOW() + INTERVAL '12 days',
  '["integrations", "api", "data"]',
  (SELECT id FROM users WHERE email = 'admin@mymvp.io'),
  NOW() - INTERVAL '3 days'
);

-- =====================
-- SAMPLE PROJECT UPDATES
-- =====================

INSERT INTO project_updates (
  project_id,
  author_id,
  title,
  content,
  type,
  is_visible_to_customer,
  hours_logged,
  created_at
) VALUES 
(
  (SELECT id FROM projects WHERE title = 'TechStartup E-commerce Platform'),
  (SELECT id FROM users WHERE email = 'john@mymvp.io'),
  'Week 1 Milestone: Foundation Complete',
  'Excellent progress in the first week! The project foundation is solid with Next.js frontend and Node.js backend fully configured. Authentication system is working perfectly with secure JWT tokens, password hashing, and protected routes. Database schema is optimized and ready for scale. Preview deployment is live and looking great!',
  'milestone',
  true,
  26.0,
  NOW() - INTERVAL '8 days'
),
(
  (SELECT id FROM projects WHERE title = 'TechStartup E-commerce Platform'),
  (SELECT id FROM users WHERE email = 'john@mymvp.io'),
  'Product API Development Complete',
  'The product catalog backend is now complete with full CRUD operations, advanced search capabilities, category filtering, and performance optimizations. API is well-documented and ready for frontend integration. Next up: building the customer-facing product pages.',
  'status_update',
  true,
  18.0,
  NOW() - INTERVAL '4 days'
),
(
  (SELECT id FROM projects WHERE title = 'TechStartup E-commerce Platform'),
  (SELECT id FROM users WHERE email = 'john@mymvp.io'),
  'Technical Note: Performance Optimization',
  'Implemented database indexing for product searches and added Redis caching for frequently accessed data. Page load times improved by 60%. Also set up image optimization pipeline for product photos.',
  'dev_note',
  false,
  4.0,
  NOW() - INTERVAL '3 days'
),
(
  (SELECT id FROM projects WHERE title = 'Innovate Analytics Dashboard'),
  (SELECT id FROM users WHERE email = 'sarah@mymvp.io'),
  'Project Kickoff and Planning',
  'Project officially started! Had a great kickoff call with the client to review requirements and finalize the technical approach. Vue.js 3 with Composition API will provide excellent performance for real-time charts. Django backend will handle data aggregation efficiently.',
  'status_update',
  true,
  2.0,
  NOW() - INTERVAL '2 days'
);

-- =====================
-- SAMPLE MESSAGES
-- =====================

INSERT INTO messages (
  project_id,
  sender_id,
  content,
  message_type,
  is_internal,
  created_at
) VALUES 
-- E-commerce project messages
(
  (SELECT id FROM projects WHERE title = 'TechStartup E-commerce Platform'),
  (SELECT id FROM users WHERE email = 'alice@techstartup.com'),
  'Hi John! The authentication flow looks fantastic. I love how smooth the registration process is. Quick question: can we add social login options (Google/Facebook) to make it even easier for users?',
  'question',
  false,
  NOW() - INTERVAL '6 days'
),
(
  (SELECT id FROM projects WHERE title = 'TechStartup E-commerce Platform'),
  (SELECT id FROM users WHERE email = 'john@mymvp.io'),
  'Hi Alice! Absolutely, social login is a great addition. I can integrate Google and Facebook OAuth using NextAuth.js. It will add about 6-8 hours to the timeline but will significantly improve user experience. Should I prioritize this for the current sprint?',
  'technical',
  false,
  NOW() - INTERVAL '6 days'
),
(
  (SELECT id FROM projects WHERE title = 'TechStartup E-commerce Platform'),
  (SELECT id FROM users WHERE email = 'alice@techstartup.com'),
  'Yes, let''s do it! User experience is crucial for us. The extra time investment will be worth it.',
  'feedback',
  false,
  NOW() - INTERVAL '5 days'
),
(
  (SELECT id FROM projects WHERE title = 'TechStartup E-commerce Platform'),
  (SELECT id FROM users WHERE email = 'john@mymvp.io'),
  'Perfect! I''ll add that to the current sprint. Also, the product catalog frontend is coming along nicely. Should have a preview ready by Friday for your review.',
  'general',
  false,
  NOW() - INTERVAL '2 days'
),
(
  (SELECT id FROM projects WHERE title = 'TechStartup E-commerce Platform'),
  (SELECT id FROM users WHERE email = 'john@mymvp.io'),
  'Internal note: Alice is very engaged and has great product sense. Scope creep is minimal and justified. Project timeline is still on track. Client satisfaction seems very high.',
  'general',
  true,
  NOW() - INTERVAL '5 days'
),
-- Analytics dashboard messages
(
  (SELECT id FROM projects WHERE title = 'Innovate Analytics Dashboard'),
  (SELECT id FROM users WHERE email = 'bob@innovate.co'),
  'Hi Sarah! Excited to get started on the analytics dashboard. I''ve prepared all the API keys and access credentials for Google Analytics, Stripe, and HubSpot. When would be a good time to do a technical handoff call?',
  'general',
  false,
  NOW() - INTERVAL '1 day'
),
(
  (SELECT id FROM projects WHERE title = 'Innovate Analytics Dashboard'),
  (SELECT id FROM users WHERE email = 'sarah@mymvp.io'),
  'Hi Bob! Great to work with you on this project. How about we schedule the technical handoff for tomorrow at 2 PM PST? I''ll prepare a list of questions about the data sources and your specific analytics requirements.',
  'general',
  false,
  NOW() - INTERVAL '1 day'
);

-- =====================
-- SAMPLE FILES
-- =====================

INSERT INTO files (
  project_id,
  uploaded_by,
  filename,
  file_path,
  file_size,
  mime_type,
  description,
  category,
  is_final_deliverable,
  created_at
) VALUES 
(
  (SELECT id FROM projects WHERE title = 'TechStartup E-commerce Platform'),
  (SELECT id FROM users WHERE email = 'alice@techstartup.com'),
  'brand-guidelines.pdf',
  '/uploads/ecommerce/brand-guidelines.pdf',
  2048576,
  'application/pdf',
  'Complete brand guidelines including logos, colors, fonts, and design principles',
  'reference',
  false,
  NOW() - INTERVAL '14 days'
),
(
  (SELECT id FROM projects WHERE title = 'TechStartup E-commerce Platform'),
  (SELECT id FROM users WHERE email = 'alice@techstartup.com'),
  'product-images.zip',
  '/uploads/ecommerce/product-images.zip',
  15728640,
  'application/zip',
  'High-resolution product images for initial catalog',
  'asset',
  false,
  NOW() - INTERVAL '12 days'
),
(
  (SELECT id FROM projects WHERE title = 'TechStartup E-commerce Platform'),
  (SELECT id FROM users WHERE email = 'john@mymvp.io'),
  'authentication-flow-demo.mp4',
  '/uploads/ecommerce/auth-demo.mp4',
  8388608,
  'video/mp4',
  'Screen recording demonstrating the completed authentication flow',
  'deliverable',
  false,
  NOW() - INTERVAL '7 days'
),
(
  (SELECT id FROM projects WHERE title = 'Innovate Analytics Dashboard'),
  (SELECT id FROM users WHERE email = 'bob@innovate.co'),
  'analytics-requirements.docx',
  '/uploads/analytics/requirements.docx',
  1048576,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'Detailed requirements document with metrics definitions and dashboard mockups',
  'documentation',
  false,
  NOW() - INTERVAL '3 days'
);

-- =====================
-- DEVELOPER AVAILABILITY
-- =====================

INSERT INTO developer_availability (
  developer_id,
  available_from,
  available_until,
  max_concurrent_projects,
  notes,
  created_at
) VALUES 
(
  (SELECT id FROM users WHERE email = 'john@mymvp.io'),
  NOW() - INTERVAL '30 days',
  NOW() + INTERVAL '60 days',
  2,
  'Available full-time through Q1 2024. Prefer React/Node.js projects. Strong expertise in e-commerce and SaaS applications.',
  NOW() - INTERVAL '30 days'
),
(
  (SELECT id FROM users WHERE email = 'sarah@mymvp.io'),
  NOW() - INTERVAL '15 days',
  NOW() + INTERVAL '90 days',
  3,
  'Available for new projects starting February. Specializing in data-heavy applications and dashboard development.',
  NOW() - INTERVAL '15 days'
),
(
  (SELECT id FROM users WHERE email = 'mike@mymvp.io'),
  NOW() + INTERVAL '7 days',
  NOW() + INTERVAL '120 days',
  2,
  'Finishing current mobile project, then available for React Native or cross-platform development.',
  NOW() - INTERVAL '10 days'
);

-- =====================
-- MESSAGE READS (Mark some messages as read)
-- =====================

INSERT INTO message_reads (message_id, user_id, read_at) 
SELECT m.id, u.id, NOW() - INTERVAL '1 hour'
FROM messages m
CROSS JOIN users u
WHERE m.is_internal = false 
  AND u.id != m.sender_id
  AND u.role != 'admin'
  AND m.project_id IN (
    SELECT p.id FROM projects p 
    WHERE p.customer_id = u.id OR p.assigned_developer_id = u.id
  );

SELECT 'Sample data inserted successfully!' as status;