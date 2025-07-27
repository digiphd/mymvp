-- MyMVP Dashboard - Organizations Support Migration
-- Adds multi-organization support for users, projects, and role management

-- =====================
-- NEW TABLES FOR ORGANIZATIONS
-- =====================

-- Organizations Table - Companies/teams that use the platform
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL, -- URL-friendly identifier
  description TEXT,
  logo_url VARCHAR(500),
  website_url VARCHAR(500),
  billing_email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organization Members Table - Many-to-many relationship between users and organizations
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role user_role NOT NULL, -- role within this specific organization
  is_active BOOLEAN DEFAULT true,
  invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
  invited_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, user_id) -- User can only have one role per organization
);

-- User Organization Preferences - Track which organization a user is currently viewing
CREATE TABLE user_organization_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  current_organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================
-- UPDATE EXISTING TABLES
-- =====================

-- Add organization_id to projects table
ALTER TABLE projects ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- Add organization_id to developer_availability table
ALTER TABLE developer_availability ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- Add organization context to messages (for organization-wide announcements)
ALTER TABLE messages ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- =====================
-- INDEXES FOR PERFORMANCE
-- =====================

-- Organizations indexes
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_is_active ON organizations(is_active);
CREATE INDEX idx_organizations_created_by ON organizations(created_by);

-- Organization members indexes
CREATE INDEX idx_org_members_organization_id ON organization_members(organization_id);
CREATE INDEX idx_org_members_user_id ON organization_members(user_id);
CREATE INDEX idx_org_members_role ON organization_members(role);
CREATE INDEX idx_org_members_is_active ON organization_members(is_active);

-- User preferences indexes
CREATE INDEX idx_user_prefs_user_id ON user_organization_preferences(user_id);
CREATE INDEX idx_user_prefs_current_org ON user_organization_preferences(current_organization_id);

-- Update existing indexes for organization support
CREATE INDEX idx_projects_organization_id ON projects(organization_id);
CREATE INDEX idx_availability_organization_id ON developer_availability(organization_id);
CREATE INDEX idx_messages_organization_id ON messages(organization_id);

-- =====================
-- TRIGGERS FOR AUTO-UPDATES
-- =====================

-- Add triggers for new tables
CREATE TRIGGER update_organizations_updated_at 
    BEFORE UPDATE ON organizations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_org_members_updated_at 
    BEFORE UPDATE ON organization_members 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_prefs_updated_at 
    BEFORE UPDATE ON user_organization_preferences 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- ROW LEVEL SECURITY (RLS)
-- =====================

-- Enable RLS on new tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_organization_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Organizations
CREATE POLICY "Users can view organizations they belong to" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Organization admins can update their organization" ON organizations
  FOR UPDATE USING (
    id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid() AND role = 'admin' AND is_active = true
    )
  );

CREATE POLICY "Service role has full access to organizations" ON organizations
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for Organization Members
CREATE POLICY "Users can view members of their organizations" ON organization_members
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Organization admins can manage members" ON organization_members
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid() AND role = 'admin' AND is_active = true
    )
  );

CREATE POLICY "Users can update their own membership status" ON organization_members
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Service role has full access to organization members" ON organization_members
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for User Preferences
CREATE POLICY "Users can manage their own preferences" ON user_organization_preferences
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Service role has full access to user preferences" ON user_organization_preferences
  FOR ALL USING (auth.role() = 'service_role');

-- Update existing RLS policies to include organization context

-- Update Projects RLS policies
DROP POLICY IF EXISTS "Customers can view their own projects" ON projects;
DROP POLICY IF EXISTS "Developers can view assigned projects" ON projects;

CREATE POLICY "Users can view projects in their organizations" ON projects
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid() AND is_active = true
    )
    AND (
      -- Customers can see their own projects
      (customer_id = auth.uid()) OR
      -- Developers can see assigned projects
      (assigned_developer_id = auth.uid()) OR
      -- Admins can see all projects in their organizations
      (organization_id IN (
        SELECT organization_id FROM organization_members 
        WHERE user_id = auth.uid() AND role = 'admin' AND is_active = true
      ))
    )
  );

-- Update Tasks RLS policies
DROP POLICY IF EXISTS "Users can view tasks for their projects" ON project_tasks;

CREATE POLICY "Users can view tasks for accessible projects" ON project_tasks
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects WHERE
        organization_id IN (
          SELECT organization_id FROM organization_members 
          WHERE user_id = auth.uid() AND is_active = true
        )
        AND (
          customer_id = auth.uid() OR 
          assigned_developer_id = auth.uid() OR
          organization_id IN (
            SELECT organization_id FROM organization_members 
            WHERE user_id = auth.uid() AND role = 'admin' AND is_active = true
          )
        )
    )
  );

-- Update Project Updates RLS policies
DROP POLICY IF EXISTS "Users can view updates for their projects" ON project_updates;

CREATE POLICY "Users can view updates for accessible projects" ON project_updates
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects WHERE
        organization_id IN (
          SELECT organization_id FROM organization_members 
          WHERE user_id = auth.uid() AND is_active = true
        )
        AND (
          customer_id = auth.uid() OR 
          assigned_developer_id = auth.uid() OR
          organization_id IN (
            SELECT organization_id FROM organization_members 
            WHERE user_id = auth.uid() AND role = 'admin' AND is_active = true
          )
        )
    )
    AND (is_visible_to_customer = true OR author_id = auth.uid())
  );

-- Update Messages RLS policies
DROP POLICY IF EXISTS "Users can view messages for their projects" ON messages;

CREATE POLICY "Users can view messages for accessible projects" ON messages
  FOR SELECT USING (
    (project_id IS NOT NULL AND project_id IN (
      SELECT id FROM projects WHERE
        organization_id IN (
          SELECT organization_id FROM organization_members 
          WHERE user_id = auth.uid() AND is_active = true
        )
        AND (
          customer_id = auth.uid() OR 
          assigned_developer_id = auth.uid() OR
          organization_id IN (
            SELECT organization_id FROM organization_members 
            WHERE user_id = auth.uid() AND role = 'admin' AND is_active = true
          )
        )
    )) OR
    (organization_id IS NOT NULL AND organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid() AND is_active = true
    ))
  ) AND (is_internal = false OR sender_id = auth.uid());

-- Update Files RLS policies
DROP POLICY IF EXISTS "Users can view files for their projects" ON files;

CREATE POLICY "Users can view files for accessible projects" ON files
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects WHERE
        organization_id IN (
          SELECT organization_id FROM organization_members 
          WHERE user_id = auth.uid() AND is_active = true
        )
        AND (
          customer_id = auth.uid() OR 
          assigned_developer_id = auth.uid() OR
          organization_id IN (
            SELECT organization_id FROM organization_members 
            WHERE user_id = auth.uid() AND role = 'admin' AND is_active = true
          )
        )
    )
  );

-- Update Developer Availability RLS policies
DROP POLICY IF EXISTS "Developers can manage their own availability" ON developer_availability;

CREATE POLICY "Developers can manage their availability in their organizations" ON developer_availability
  FOR ALL USING (
    developer_id = auth.uid() AND
    (organization_id IS NULL OR organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid() AND is_active = true
    ))
  );

CREATE POLICY "Organization admins can view developer availability" ON developer_availability
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid() AND role = 'admin' AND is_active = true
    )
  );

-- =====================
-- UPDATED ANALYTICS VIEWS
-- =====================

-- Drop existing views and recreate with organization support
DROP VIEW IF EXISTS project_dashboard_stats;
DROP VIEW IF EXISTS developer_workload_stats;

-- Organization-aware Project Dashboard Stats
CREATE OR REPLACE VIEW project_dashboard_stats AS
SELECT 
  p.organization_id,
  o.name as organization_name,
  p.status,
  COUNT(*) as count,
  AVG(p.actual_hours) as avg_hours,
  SUM(p.price_cents) as total_revenue
FROM projects p
LEFT JOIN organizations o ON p.organization_id = o.id
GROUP BY p.organization_id, o.name, p.status;

-- Organization-aware Developer Workload Stats
CREATE OR REPLACE VIEW developer_workload_stats AS
SELECT 
  om.organization_id,
  org.name as organization_name,
  u.id as developer_id,
  u.name as developer_name,
  COUNT(p.id) as active_projects,
  SUM(p.actual_hours) as total_hours,
  AVG(p.actual_hours) as avg_hours_per_project
FROM organization_members om
JOIN users u ON om.user_id = u.id
JOIN organizations org ON om.organization_id = org.id
LEFT JOIN projects p ON u.id = p.assigned_developer_id 
  AND p.organization_id = om.organization_id
  AND p.status IN ('assigned', 'building', 'testing', 'review')
WHERE om.role = 'developer' 
  AND om.is_active = true 
  AND u.is_active = true
GROUP BY om.organization_id, org.name, u.id, u.name;

-- New view for organization member summary
CREATE OR REPLACE VIEW organization_member_stats AS
SELECT 
  o.id as organization_id,
  o.name as organization_name,
  om.role,
  COUNT(*) as member_count
FROM organizations o
LEFT JOIN organization_members om ON o.id = om.organization_id AND om.is_active = true
GROUP BY o.id, o.name, om.role;

-- Grant access to updated views
GRANT SELECT ON project_dashboard_stats TO service_role;
GRANT SELECT ON project_dashboard_stats TO authenticated;
GRANT SELECT ON developer_workload_stats TO service_role;
GRANT SELECT ON developer_workload_stats TO authenticated;
GRANT SELECT ON organization_member_stats TO service_role;
GRANT SELECT ON organization_member_stats TO authenticated;

-- =====================
-- HELPER FUNCTIONS
-- =====================

-- Function to get user's current organization
CREATE OR REPLACE FUNCTION get_user_current_organization(user_uuid UUID)
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT current_organization_id 
    FROM user_organization_preferences 
    WHERE user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has role in organization
CREATE OR REPLACE FUNCTION user_has_role_in_org(user_uuid UUID, org_uuid UUID, required_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organization_members 
    WHERE user_id = user_uuid 
      AND organization_id = org_uuid 
      AND role = required_role 
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's organizations
CREATE OR REPLACE FUNCTION get_user_organizations(user_uuid UUID)
RETURNS TABLE (
  organization_id UUID,
  organization_name VARCHAR(255),
  organization_slug VARCHAR(100),
  user_role user_role,
  is_current BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.name,
    o.slug,
    om.role,
    (o.id = (SELECT current_organization_id FROM user_organization_preferences WHERE user_id = user_uuid))
  FROM organizations o
  JOIN organization_members om ON o.id = om.organization_id
  WHERE om.user_id = user_uuid 
    AND om.is_active = true 
    AND o.is_active = true
  ORDER BY om.joined_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================
-- MIGRATION DATA UPDATES
-- =====================

-- Create a default organization for existing data
INSERT INTO organizations (name, slug, description, created_by) 
VALUES (
  'MyMVP Default Organization',
  'mymvp-default',
  'Default organization for existing users and projects',
  (SELECT id FROM users WHERE email = 'admin@mymvp.io' LIMIT 1)
);

-- Get the default organization ID
DO $$
DECLARE
  default_org_id UUID;
BEGIN
  SELECT id INTO default_org_id FROM organizations WHERE slug = 'mymvp-default';
  
  -- Update all existing projects to belong to the default organization
  UPDATE projects SET organization_id = default_org_id WHERE organization_id IS NULL;
  
  -- Add all existing users to the default organization with their current roles
  INSERT INTO organization_members (organization_id, user_id, role, joined_at)
  SELECT default_org_id, id, role, created_at
  FROM users
  WHERE is_active = true;
  
  -- Set default organization preferences for all users
  INSERT INTO user_organization_preferences (user_id, current_organization_id)
  SELECT id, default_org_id
  FROM users
  WHERE is_active = true;
  
  -- Update developer availability to reference the default organization
  UPDATE developer_availability 
  SET organization_id = default_org_id 
  WHERE organization_id IS NULL;
END $$;

-- =====================
-- MAKE ORGANIZATION_ID REQUIRED
-- =====================

-- Now that all existing data has been updated, make organization_id required
ALTER TABLE projects ALTER COLUMN organization_id SET NOT NULL;

-- =====================
-- DOCUMENTATION
-- =====================

-- Table comments for new tables
COMMENT ON TABLE organizations IS 'Organizations/companies that use the MyMVP platform';
COMMENT ON TABLE organization_members IS 'Many-to-many relationship between users and organizations with role assignments';
COMMENT ON TABLE user_organization_preferences IS 'User preferences including currently selected organization';

-- Column comments for key fields
COMMENT ON COLUMN organizations.slug IS 'URL-friendly unique identifier for the organization';
COMMENT ON COLUMN organization_members.role IS 'User role within this specific organization (customer, developer, admin)';
COMMENT ON COLUMN organization_members.is_active IS 'Whether the user membership is currently active';
COMMENT ON COLUMN projects.organization_id IS 'Organization that owns this project (required)';
COMMENT ON COLUMN user_organization_preferences.current_organization_id IS 'Organization currently selected by the user in the UI';

-- Grant permissions on helper functions
GRANT EXECUTE ON FUNCTION get_user_current_organization(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION user_has_role_in_org(UUID, UUID, user_role) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_organizations(UUID) TO authenticated;

SELECT 'Organizations migration completed successfully!' as status;