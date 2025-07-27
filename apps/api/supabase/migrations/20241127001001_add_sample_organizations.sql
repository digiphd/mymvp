-- MyMVP Dashboard - Sample Organizations Data
-- Adds realistic sample organizations and updates existing data

-- =====================
-- SAMPLE ORGANIZATIONS
-- =====================

-- Insert additional sample organizations
INSERT INTO organizations (name, slug, description, logo_url, website_url, billing_email, created_by) VALUES 
-- Tech Startup (existing customers)
('TechStartup Inc', 'techstartup-inc', 'Fast-growing B2B SaaS company building the future of workplace collaboration', 
 'https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=TS', 'https://techstartup.com', 'billing@techstartup.com',
 (SELECT id FROM users WHERE email = 'alice@techstartup.com')),

-- Innovation Company
('Innovate Solutions', 'innovate-solutions', 'Data analytics consultancy helping enterprises make better decisions through advanced analytics and AI',
 'https://via.placeholder.com/200x200/059669/FFFFFF?text=IS', 'https://innovate.co', 'finance@innovate.co',
 (SELECT id FROM users WHERE email = 'bob@innovate.co')),

-- Food Tech Company
('FoodTech Labs', 'foodtech-labs', 'Restaurant technology platform revolutionizing the food delivery experience',
 'https://via.placeholder.com/200x200/DC2626/FFFFFF?text=FT', 'https://foodtech.io', 'billing@foodtech.io',
 (SELECT id FROM users WHERE email = 'emma@foodtech.io')),

-- Additional organizations for multi-org scenarios
('Agency Pro', 'agency-pro', 'Full-service digital agency specializing in custom software development and design',
 'https://via.placeholder.com/200x200/7C2D12/FFFFFF?text=AP', 'https://agencypro.com', 'billing@agencypro.com',
 (SELECT id FROM users WHERE email = 'admin@mymvp.io')),

('Startup Accelerator', 'startup-accelerator', 'Accelerator program helping early-stage startups build and scale their MVPs',
 'https://via.placeholder.com/200x200/1E40AF/FFFFFF?text=SA', 'https://startupaccelerator.com', 'billing@startupaccelerator.com',
 (SELECT id FROM users WHERE email = 'admin@mymvp.io'));

-- =====================
-- UPDATE ORGANIZATION MEMBERSHIPS
-- =====================

-- Clear existing memberships (the migration already added default org memberships)
DELETE FROM organization_members WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'mymvp-default');

-- Add users to their respective organizations
DO $$
DECLARE
  techstartup_org_id UUID;
  innovate_org_id UUID;
  foodtech_org_id UUID;
  agency_org_id UUID;
  accelerator_org_id UUID;
  default_org_id UUID;
BEGIN
  -- Get organization IDs
  SELECT id INTO techstartup_org_id FROM organizations WHERE slug = 'techstartup-inc';
  SELECT id INTO innovate_org_id FROM organizations WHERE slug = 'innovate-solutions';
  SELECT id INTO foodtech_org_id FROM organizations WHERE slug = 'foodtech-labs';
  SELECT id INTO agency_org_id FROM organizations WHERE slug = 'agency-pro';
  SELECT id INTO accelerator_org_id FROM organizations WHERE slug = 'startup-accelerator';
  SELECT id INTO default_org_id FROM organizations WHERE slug = 'mymvp-default';
  
  -- TechStartup Inc members
  INSERT INTO organization_members (organization_id, user_id, role, invited_by, joined_at) VALUES
  (techstartup_org_id, (SELECT id FROM users WHERE email = 'alice@techstartup.com'), 'admin', 
   (SELECT id FROM users WHERE email = 'alice@techstartup.com'), NOW() - INTERVAL '30 days'),
  (techstartup_org_id, (SELECT id FROM users WHERE email = 'john@mymvp.io'), 'developer',
   (SELECT id FROM users WHERE email = 'alice@techstartup.com'), NOW() - INTERVAL '25 days');
  
  -- Innovate Solutions members
  INSERT INTO organization_members (organization_id, user_id, role, invited_by, joined_at) VALUES
  (innovate_org_id, (SELECT id FROM users WHERE email = 'bob@innovate.co'), 'admin',
   (SELECT id FROM users WHERE email = 'bob@innovate.co'), NOW() - INTERVAL '20 days'),
  (innovate_org_id, (SELECT id FROM users WHERE email = 'sarah@mymvp.io'), 'developer',
   (SELECT id FROM users WHERE email = 'bob@innovate.co'), NOW() - INTERVAL '15 days');
  
  -- FoodTech Labs members
  INSERT INTO organization_members (organization_id, user_id, role, invited_by, joined_at) VALUES
  (foodtech_org_id, (SELECT id FROM users WHERE email = 'emma@foodtech.io'), 'admin',
   (SELECT id FROM users WHERE email = 'emma@foodtech.io'), NOW() - INTERVAL '10 days');
  
  -- Agency Pro members (MyMVP's own agency)
  INSERT INTO organization_members (organization_id, user_id, role, invited_by, joined_at) VALUES
  (agency_org_id, (SELECT id FROM users WHERE email = 'admin@mymvp.io'), 'admin',
   (SELECT id FROM users WHERE email = 'admin@mymvp.io'), NOW() - INTERVAL '60 days'),
  (agency_org_id, (SELECT id FROM users WHERE email = 'john@mymvp.io'), 'developer',
   (SELECT id FROM users WHERE email = 'admin@mymvp.io'), NOW() - INTERVAL '60 days'),
  (agency_org_id, (SELECT id FROM users WHERE email = 'sarah@mymvp.io'), 'developer',
   (SELECT id FROM users WHERE email = 'admin@mymvp.io'), NOW() - INTERVAL '60 days'),
  (agency_org_id, (SELECT id FROM users WHERE email = 'mike@mymvp.io'), 'developer',
   (SELECT id FROM users WHERE email = 'admin@mymvp.io'), NOW() - INTERVAL '60 days');
  
  -- Startup Accelerator members (developers work across multiple startups)
  INSERT INTO organization_members (organization_id, user_id, role, invited_by, joined_at) VALUES
  (accelerator_org_id, (SELECT id FROM users WHERE email = 'admin@mymvp.io'), 'admin',
   (SELECT id FROM users WHERE email = 'admin@mymvp.io'), NOW() - INTERVAL '90 days'),
  (accelerator_org_id, (SELECT id FROM users WHERE email = 'john@mymvp.io'), 'developer',
   (SELECT id FROM users WHERE email = 'admin@mymvp.io'), NOW() - INTERVAL '85 days'),
  (accelerator_org_id, (SELECT id FROM users WHERE email = 'sarah@mymvp.io'), 'developer',
   (SELECT id FROM users WHERE email = 'admin@mymvp.io'), NOW() - INTERVAL '85 days'),
  (accelerator_org_id, (SELECT id FROM users WHERE email = 'mike@mymvp.io'), 'developer',
   (SELECT id FROM users WHERE email = 'admin@mymvp.io'), NOW() - INTERVAL '85 days'),
  (accelerator_org_id, (SELECT id FROM users WHERE email = 'alice@techstartup.com'), 'customer',
   (SELECT id FROM users WHERE email = 'admin@mymvp.io'), NOW() - INTERVAL '80 days'),
  (accelerator_org_id, (SELECT id FROM users WHERE email = 'bob@innovate.co'), 'customer',
   (SELECT id FROM users WHERE email = 'admin@mymvp.io'), NOW() - INTERVAL '75 days'),
  (accelerator_org_id, (SELECT id FROM users WHERE email = 'emma@foodtech.io'), 'customer',
   (SELECT id FROM users WHERE email = 'admin@mymvp.io'), NOW() - INTERVAL '70 days');
  
END $$;

-- =====================
-- UPDATE USER PREFERENCES
-- =====================

-- Set current organization preferences for users
DO $$
DECLARE
  techstartup_org_id UUID;
  innovate_org_id UUID;
  foodtech_org_id UUID;
  agency_org_id UUID;
  accelerator_org_id UUID;
BEGIN
  -- Get organization IDs
  SELECT id INTO techstartup_org_id FROM organizations WHERE slug = 'techstartup-inc';
  SELECT id INTO innovate_org_id FROM organizations WHERE slug = 'innovate-solutions';
  SELECT id INTO foodtech_org_id FROM organizations WHERE slug = 'foodtech-labs';
  SELECT id INTO agency_org_id FROM organizations WHERE slug = 'agency-pro';
  SELECT id INTO accelerator_org_id FROM organizations WHERE slug = 'startup-accelerator';
  
  -- Clear existing preferences
  DELETE FROM user_organization_preferences;
  
  -- Set current organization for each user
  INSERT INTO user_organization_preferences (user_id, current_organization_id) VALUES
  ((SELECT id FROM users WHERE email = 'admin@mymvp.io'), agency_org_id),
  ((SELECT id FROM users WHERE email = 'alice@techstartup.com'), techstartup_org_id),
  ((SELECT id FROM users WHERE email = 'bob@innovate.co'), innovate_org_id),
  ((SELECT id FROM users WHERE email = 'emma@foodtech.io'), foodtech_org_id),
  ((SELECT id FROM users WHERE email = 'john@mymvp.io'), agency_org_id),
  ((SELECT id FROM users WHERE email = 'sarah@mymvp.io'), agency_org_id),
  ((SELECT id FROM users WHERE email = 'mike@mymvp.io'), agency_org_id);
  
END $$;

-- =====================
-- UPDATE EXISTING PROJECTS
-- =====================

-- Update projects to belong to correct organizations
DO $$
DECLARE
  techstartup_org_id UUID;
  innovate_org_id UUID;
  foodtech_org_id UUID;
  agency_org_id UUID;
  accelerator_org_id UUID;
BEGIN
  -- Get organization IDs
  SELECT id INTO techstartup_org_id FROM organizations WHERE slug = 'techstartup-inc';
  SELECT id INTO innovate_org_id FROM organizations WHERE slug = 'innovate-solutions';
  SELECT id INTO foodtech_org_id FROM organizations WHERE slug = 'foodtech-labs';
  SELECT id INTO agency_org_id FROM organizations WHERE slug = 'agency-pro';
  SELECT id INTO accelerator_org_id FROM organizations WHERE slug = 'startup-accelerator';
  
  -- Update existing projects
  UPDATE projects SET organization_id = techstartup_org_id 
  WHERE customer_id = (SELECT id FROM users WHERE email = 'alice@techstartup.com');
  
  UPDATE projects SET organization_id = innovate_org_id 
  WHERE customer_id = (SELECT id FROM users WHERE email = 'bob@innovate.co');
  
  UPDATE projects SET organization_id = foodtech_org_id 
  WHERE customer_id = (SELECT id FROM users WHERE email = 'emma@foodtech.io');
  
END $$;

-- =====================
-- UPDATE DEVELOPER AVAILABILITY
-- =====================

-- Update developer availability to be organization-specific
DO $$
DECLARE
  agency_org_id UUID;
  accelerator_org_id UUID;
BEGIN
  SELECT id INTO agency_org_id FROM organizations WHERE slug = 'agency-pro';
  SELECT id INTO accelerator_org_id FROM organizations WHERE slug = 'startup-accelerator';
  
  -- Update existing availability records
  UPDATE developer_availability SET organization_id = agency_org_id;
  
  -- Add additional availability for developers in accelerator
  INSERT INTO developer_availability (
    developer_id,
    organization_id,
    available_from,
    available_until,
    max_concurrent_projects,
    notes
  ) VALUES
  ((SELECT id FROM users WHERE email = 'john@mymvp.io'), accelerator_org_id,
   NOW() - INTERVAL '30 days', NOW() + INTERVAL '90 days', 1,
   'Available for accelerator program projects on weekends and evenings'),
  ((SELECT id FROM users WHERE email = 'sarah@mymvp.io'), accelerator_org_id,
   NOW() - INTERVAL '15 days', NOW() + INTERVAL '120 days', 2,
   'Specializing in data analytics projects for accelerator startups'),
  ((SELECT id FROM users WHERE email = 'mike@mymvp.io'), accelerator_org_id,
   NOW() + INTERVAL '7 days', NOW() + INTERVAL '150 days', 1,
   'Mobile development expertise for accelerator mobile app projects');
  
END $$;

-- =====================
-- ADD CROSS-ORGANIZATION PROJECTS
-- =====================

-- Add some projects in the accelerator program
DO $$
DECLARE
  accelerator_org_id UUID;
  alice_id UUID;
  bob_id UUID;
  emma_id UUID;
  sarah_id UUID;
  mike_id UUID;
BEGIN
  SELECT id INTO accelerator_org_id FROM organizations WHERE slug = 'startup-accelerator';
  SELECT id INTO alice_id FROM users WHERE email = 'alice@techstartup.com';
  SELECT id INTO bob_id FROM users WHERE email = 'bob@innovate.co';
  SELECT id INTO emma_id FROM users WHERE email = 'emma@foodtech.io';
  SELECT id INTO sarah_id FROM users WHERE email = 'sarah@mymvp.io';
  SELECT id INTO mike_id FROM users WHERE email = 'mike@mymvp.io';
  
  -- Add accelerator program projects
  INSERT INTO projects (
    organization_id,
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
    actual_hours,
    created_at
  ) VALUES
  -- Alice's accelerator project (different from her main business)
  (accelerator_org_id, alice_id, sarah_id,
   'Workforce Analytics PoC',
   'Proof of concept for AI-powered workforce analytics to help companies optimize team performance and productivity.',
   'poc', 'building', 'medium', 300000, 150000,
   NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days',
   'MVP to validate AI analytics concept with sample HR data and basic dashboard.',
   '{"frontend": "React + Chart.js", "backend": "Python + FastAPI", "ai": "scikit-learn", "database": "PostgreSQL"}',
   60, 25, NOW() - INTERVAL '10 days'),
  
  -- Bob's accelerator project
  (accelerator_org_id, bob_id, mike_id,
   'Mobile Analytics Companion',
   'Mobile app companion to the main analytics dashboard for on-the-go data access.',
   'poc', 'planning', 'low', 250000, 125000,
   NOW() + INTERVAL '5 days', NOW() + INTERVAL '25 days',
   'Simple mobile app with key metrics and notifications from the main dashboard.',
   '{"platform": "React Native", "backend": "REST API", "auth": "OAuth2", "notifications": "Push"}',
   40, 0, NOW() - INTERVAL '3 days');
  
END $$;

-- =====================
-- ADD ORGANIZATION-SPECIFIC MESSAGES
-- =====================

-- Add some organization-wide announcements and messages
DO $$
DECLARE
  techstartup_org_id UUID;
  agency_org_id UUID;
  accelerator_org_id UUID;
  admin_id UUID;
  alice_id UUID;
  sarah_id UUID;
BEGIN
  SELECT id INTO techstartup_org_id FROM organizations WHERE slug = 'techstartup-inc';
  SELECT id INTO agency_org_id FROM organizations WHERE slug = 'agency-pro';
  SELECT id INTO accelerator_org_id FROM organizations WHERE slug = 'startup-accelerator';
  SELECT id INTO admin_id FROM users WHERE email = 'admin@mymvp.io';
  SELECT id INTO alice_id FROM users WHERE email = 'alice@techstartup.com';
  SELECT id INTO sarah_id FROM users WHERE email = 'sarah@mymvp.io';
  
  -- Organization-wide messages
  INSERT INTO messages (
    organization_id,
    sender_id,
    content,
    message_type,
    is_internal,
    created_at
  ) VALUES
  (accelerator_org_id, admin_id,
   'Welcome to the MyMVP Startup Accelerator program! Over the next 12 weeks, our development team will help you build and validate your MVP. Each startup gets dedicated developer time and access to our full tech stack.',
   'general', false, NOW() - INTERVAL '12 days'),
  
  (agency_org_id, admin_id,
   'Team update: We''ve successfully onboarded 3 new client organizations this month. Great work everyone on maintaining our high-quality delivery standards!',
   'general', true, NOW() - INTERVAL '5 days'),
   
  (accelerator_org_id, sarah_id,
   'Data analytics workshop scheduled for next Tuesday at 2 PM PST. All accelerator participants welcome to join and learn about implementing analytics in your MVPs.',
   'technical', false, NOW() - INTERVAL '2 days');
  
END $$;

-- =====================
-- SAMPLE STATISTICS
-- =====================

-- Insert some sample data to populate analytics views
SELECT 
  'Organizations migration with sample data completed!' as status,
  COUNT(*) as total_organizations
FROM organizations;

SELECT 
  o.name as organization,
  COUNT(om.*) as members,
  COUNT(p.*) as projects
FROM organizations o
LEFT JOIN organization_members om ON o.id = om.organization_id AND om.is_active = true
LEFT JOIN projects p ON o.id = p.organization_id
GROUP BY o.id, o.name
ORDER BY o.created_at;