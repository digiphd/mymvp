-- MyMVP Dashboard Database Schema for Supabase
-- Complete schema for the multi-role dashboard system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('customer', 'developer', 'admin');
CREATE TYPE project_status AS ENUM ('planning', 'assigned', 'building', 'testing', 'review', 'delivered', 'cancelled');
CREATE TYPE project_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE project_type AS ENUM ('poc', 'mvp');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'completed', 'blocked');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE update_type AS ENUM ('status_update', 'milestone', 'issue', 'delivery', 'task_completed', 'dev_note');
CREATE TYPE message_type AS ENUM ('general', 'technical', 'feedback', 'question');
CREATE TYPE file_category AS ENUM ('deliverable', 'asset', 'documentation', 'reference');

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'customer',
  bio TEXT,
  skills JSONB, -- For developers: ["React", "Node.js", "Python"]
  hourly_rate INTEGER, -- For developers: rate in cents
  timezone VARCHAR(50),
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assigned_developer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type project_type NOT NULL,
  status project_status DEFAULT 'planning',
  priority project_priority DEFAULT 'medium',
  price_cents INTEGER NOT NULL,
  developer_budget_cents INTEGER, -- Portion allocated to developer
  start_date DATE,
  delivery_date DATE,
  preview_url VARCHAR(500),
  repo_url VARCHAR(500),
  requirements_doc TEXT,
  technical_requirements JSONB, -- Stack, APIs, integrations needed
  final_deliverables JSONB,
  estimated_hours INTEGER,
  actual_hours INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Tasks Table
CREATE TABLE project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  assigned_developer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status task_status DEFAULT 'todo',
  priority task_priority DEFAULT 'medium',
  estimated_hours DECIMAL(4,2),
  actual_hours DECIMAL(4,2) DEFAULT 0,
  due_date DATE,
  dependencies JSONB, -- Task IDs this task depends on
  labels JSONB, -- ["frontend", "api", "database"]
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Updates Table
CREATE TABLE project_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type update_type NOT NULL,
  is_visible_to_customer BOOLEAN DEFAULT true,
  task_id UUID REFERENCES project_tasks(id) ON DELETE SET NULL, -- If update relates to specific task
  hours_logged DECIMAL(4,2), -- For developer updates
  attachments JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type message_type DEFAULT 'general',
  is_internal BOOLEAN DEFAULT false, -- Developer-to-admin messages not visible to customer
  attachments JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message Reads Table
CREATE TABLE message_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);

-- Files Table
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES users(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  description TEXT,
  category file_category DEFAULT 'asset',
  is_final_deliverable BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Developer Availability Table
CREATE TABLE developer_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  available_from DATE NOT NULL,
  available_until DATE,
  max_concurrent_projects INTEGER DEFAULT 3,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

CREATE INDEX idx_projects_customer_id ON projects(customer_id);
CREATE INDEX idx_projects_developer_id ON projects(assigned_developer_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

CREATE INDEX idx_tasks_project_id ON project_tasks(project_id);
CREATE INDEX idx_tasks_developer_id ON project_tasks(assigned_developer_id);
CREATE INDEX idx_tasks_status ON project_tasks(status);
CREATE INDEX idx_tasks_due_date ON project_tasks(due_date);

CREATE INDEX idx_updates_project_id ON project_updates(project_id);
CREATE INDEX idx_updates_created_at ON project_updates(created_at DESC);

CREATE INDEX idx_messages_project_id ON messages(project_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

CREATE INDEX idx_files_project_id ON files(project_id);
CREATE INDEX idx_files_uploaded_by ON files(uploaded_by);

CREATE INDEX idx_availability_developer_id ON developer_availability(developer_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON project_tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_updated_at 
    BEFORE UPDATE ON developer_availability 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Users
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role has full access to users" ON users
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for Projects
CREATE POLICY "Customers can view their own projects" ON projects
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Developers can view assigned projects" ON projects
  FOR SELECT USING (assigned_developer_id = auth.uid());

CREATE POLICY "Service role has full access to projects" ON projects
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for Tasks
CREATE POLICY "Users can view tasks for their projects" ON project_tasks
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE customer_id = auth.uid() OR assigned_developer_id = auth.uid()
    )
  );

CREATE POLICY "Developers can update their assigned tasks" ON project_tasks
  FOR UPDATE USING (assigned_developer_id = auth.uid());

CREATE POLICY "Service role has full access to tasks" ON project_tasks
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for Updates
CREATE POLICY "Users can view updates for their projects" ON project_updates
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE customer_id = auth.uid() OR assigned_developer_id = auth.uid()
    )
    AND (is_visible_to_customer = true OR author_id = auth.uid())
  );

CREATE POLICY "Service role has full access to updates" ON project_updates
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for Messages
CREATE POLICY "Users can view messages for their projects" ON messages
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE customer_id = auth.uid() OR assigned_developer_id = auth.uid()
    )
    AND (is_internal = false OR sender_id = auth.uid())
  );

CREATE POLICY "Service role has full access to messages" ON messages
  FOR ALL USING (auth.role() = 'service_role');

-- Create views for dashboard analytics
CREATE OR REPLACE VIEW project_dashboard_stats AS
SELECT 
  p.status,
  COUNT(*) as count,
  AVG(p.actual_hours) as avg_hours,
  SUM(p.price_cents) as total_revenue
FROM projects p
GROUP BY p.status;

CREATE OR REPLACE VIEW developer_workload_stats AS
SELECT 
  u.id as developer_id,
  u.name as developer_name,
  COUNT(p.id) as active_projects,
  SUM(p.actual_hours) as total_hours,
  AVG(p.actual_hours) as avg_hours_per_project
FROM users u
LEFT JOIN projects p ON u.id = p.assigned_developer_id AND p.status IN ('assigned', 'building', 'testing', 'review')
WHERE u.role = 'developer' AND u.is_active = true
GROUP BY u.id, u.name;

-- Grant access to views
GRANT SELECT ON project_dashboard_stats TO service_role;
GRANT SELECT ON project_dashboard_stats TO authenticated;
GRANT SELECT ON developer_workload_stats TO service_role;
GRANT SELECT ON developer_workload_stats TO authenticated;

-- Sample data for testing (remove in production)
/*
-- Insert sample admin user
INSERT INTO users (email, name, password_hash, role) VALUES 
('admin@mymvp.io', 'Admin User', '$2b$10$placeholder', 'admin');

-- Insert sample developer
INSERT INTO users (email, name, password_hash, role, skills, hourly_rate, timezone) VALUES 
('dev@mymvp.io', 'John Developer', '$2b$10$placeholder', 'developer', 
 '["React", "Node.js", "TypeScript", "PostgreSQL"]', 7500, 'America/New_York');

-- Insert sample customer
INSERT INTO users (email, name, password_hash, role) VALUES 
('customer@example.com', 'Jane Customer', '$2b$10$placeholder', 'customer');
*/

-- Comments for documentation
COMMENT ON TABLE users IS 'All system users including customers, developers, and admins';
COMMENT ON TABLE projects IS 'Customer projects with developer assignments and tracking';
COMMENT ON TABLE project_tasks IS 'Individual tasks within projects for developer workflow';
COMMENT ON TABLE project_updates IS 'Status updates and milestones for project tracking';
COMMENT ON TABLE messages IS 'Communication between customers, developers, and admins';
COMMENT ON TABLE files IS 'File uploads and deliverables for projects';
COMMENT ON TABLE developer_availability IS 'Developer capacity and availability tracking';