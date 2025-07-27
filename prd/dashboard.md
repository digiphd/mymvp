# MyMVP Customer Dashboard - Product Requirements Document

## Overview
A comprehensive project management dashboard for MyMVP that supports customers, contractors, and administrators throughout the 14-day build process. The platform enables seamless collaboration between clients and developers while providing administrators with full project oversight.

## Core Requirements

### User Types
- **Customers** - Can have multiple projects, view progress, leave feedback, communicate with assigned developers
- **Developers** - Contractors who can be assigned to projects, update task status, communicate with customers, manage their workload
- **Admin/Developer** - Full privileges including project creation, user management, developer assignment, and all developer capabilities

### Key Features
- Multi-project support per customer
- Developer assignment and task management
- Real-time project status tracking
- Role-based dashboards and permissions
- Integrated preview viewing with Vercel comments
- Multi-party messaging system
- File sharing for deliverables
- Developer workload management

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('customer', 'developer', 'admin') DEFAULT 'customer',
  bio TEXT,
  skills JSONB, -- For developers: ["React", "Node.js", "Python"]
  hourly_rate INTEGER, -- For developers: rate in cents
  timezone VARCHAR(50),
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assigned_developer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('poc', 'mvp') NOT NULL,
  status ENUM('planning', 'assigned', 'building', 'testing', 'review', 'delivered', 'cancelled') DEFAULT 'planning',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
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
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Project Tasks Table
```sql
CREATE TABLE project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  assigned_developer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('todo', 'in_progress', 'review', 'completed', 'blocked') DEFAULT 'todo',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  estimated_hours DECIMAL(4,2),
  actual_hours DECIMAL(4,2) DEFAULT 0,
  due_date DATE,
  dependencies JSONB, -- Task IDs this task depends on
  labels JSONB, -- ["frontend", "api", "database"]
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Project Updates Table
```sql
CREATE TABLE project_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type ENUM('status_update', 'milestone', 'issue', 'delivery', 'task_completed', 'dev_note') NOT NULL,
  is_visible_to_customer BOOLEAN DEFAULT true,
  task_id UUID REFERENCES project_tasks(id) ON DELETE SET NULL, -- If update relates to specific task
  hours_logged DECIMAL(4,2), -- For developer updates
  attachments JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type ENUM('general', 'technical', 'feedback', 'question') DEFAULT 'general',
  is_internal BOOLEAN DEFAULT false, -- Developer-to-admin messages not visible to customer
  attachments JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Message Reads Table
```sql
CREATE TABLE message_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  read_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);
```

### Files Table
```sql
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES users(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  description TEXT,
  category ENUM('deliverable', 'asset', 'documentation', 'reference') DEFAULT 'asset',
  is_final_deliverable BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Developer Availability Table
```sql
CREATE TABLE developer_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  available_from DATE NOT NULL,
  available_until DATE,
  max_concurrent_projects INTEGER DEFAULT 3,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Endpoints

### Authentication
```javascript
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/register
GET  /api/auth/me
PUT  /api/auth/profile              // Update user profile
```

### Projects
```javascript
GET    /api/projects                // Get projects based on user role
GET    /api/projects/:id            // Get specific project details
POST   /api/projects                // Create new project (admin only)
PUT    /api/projects/:id            // Update project
DELETE /api/projects/:id            // Delete project (admin only)
PUT    /api/projects/:id/assign     // Assign developer to project (admin only)
PUT    /api/projects/:id/status     // Update project status
```

### Project Tasks
```javascript
GET    /api/projects/:id/tasks      // Get all tasks for a project
POST   /api/projects/:id/tasks      // Create new task
PUT    /api/tasks/:id               // Update task (developer/admin)
DELETE /api/tasks/:id               // Delete task (admin only)
PUT    /api/tasks/:id/status        // Update task status
POST   /api/tasks/:id/log-hours     // Log hours worked (developer)
```

### Project Updates
```javascript
GET  /api/projects/:id/updates      // Get all updates for a project
POST /api/projects/:id/updates      // Create new update
PUT  /api/updates/:id               // Update specific update
```

### Messages
```javascript
GET  /api/projects/:id/messages     // Get messages for a project (filtered by role)
POST /api/projects/:id/messages     // Send new message
PUT  /api/messages/:id/read         // Mark message as read
```

### Files
```javascript
GET    /api/projects/:id/files      // Get all files for a project
POST   /api/projects/:id/files      // Upload new file
DELETE /api/files/:id               // Delete file
GET    /api/files/:id/download      // Download file
```

### Dashboard Data
```javascript
GET /api/dashboard                  // Get dashboard overview (role-based)
GET /api/admin/dashboard            // Get admin dashboard (admin only)
GET /api/developer/workload         // Get developer's current workload
GET /api/admin/developers           // Get all developers and availability (admin only)
```

### Developer Management
```javascript
GET    /api/developers              // Get all developers (admin only)
PUT    /api/developers/:id/status   // Activate/deactivate developer (admin only)
GET    /api/developers/available    // Get available developers for assignment (admin only)
PUT    /api/developers/:id/availability // Update developer availability
```

### Email Integration
```javascript
POST /api/emails/send               // Send email via Loops.so
GET  /api/emails/templates          // Get available email templates
POST /api/projects/:id/notify       // Send project notification email
```

---

## User Interface Requirements

### Customer Dashboard Layout

#### 1. Projects Overview Page
- **Header:** MyMVP logo, user name, logout
- **Project Cards:** Grid layout showing:
  - Project title and type (PoC/MVP)
  - Current status with progress indicator
  - Assigned developer name and avatar
  - Start date and estimated delivery
  - Quick action buttons (View, Message Developer)
- **Create Project Button:** Links to contact form (external)

#### 2. Project Detail Page
- **Project Header:** Title, status, timeline, assigned developer info
- **Navigation Tabs:**
  - Overview
  - Updates
  - Messages
  - Files
  - Preview

### Developer Dashboard Layout

#### 1. Developer Overview Page
- **Header:** MyMVP logo, developer name, availability toggle, logout
- **Active Projects:** Cards showing:
  - Project title and customer name
  - Current status and your tasks
  - Deadline and progress
  - Hours logged vs estimated
  - Quick actions (View Tasks, Message Customer)
- **Task Summary:** Today's tasks, overdue items, upcoming deadlines
- **Time Tracking:** Weekly hours summary, current project breakdown

#### 2. Developer Project Detail Page
- **Project Header:** Title, customer info, timeline, your role
- **Navigation Tabs:**
  - Tasks & Progress
  - Updates
  - Messages
  - Files
  - Technical Notes (internal)

#### 3. Tasks & Progress Tab (Developer-specific)
- **Task Board:** Kanban-style view (To Do, In Progress, Review, Done)
- **Time Tracking:** Log hours per task with notes
- **Task Details:** Descriptions, dependencies, acceptance criteria
- **Progress Updates:** Mark tasks complete, add dev notes
- **Blocking Issues:** Flag blockers for admin attention

#### 4. Developer Technical Notes Tab
- **Internal Notes:** Technical decisions, code snippets, issues
- **Architecture Notes:** System design, database changes
- **Dev-to-Admin Messages:** Internal communication not visible to customer
- **Resource Links:** Helpful links, documentation, references

### Admin Dashboard Layout

#### 1. Admin Overview Page
- **Header:** MyMVP logo, admin name, system status, logout
- **Project Status Board:** All projects with status indicators
- **Developer Workload:** Visual overview of developer assignments
- **Key Metrics:** Revenue, completion rates, developer utilization
- **Recent Activity:** Latest updates across all projects
- **Alert Center:** Overdue tasks, blocked projects, developer availability

#### 2. Project Management Interface
- **Project Creation:** Form with developer assignment
- **Developer Assignment:** Drag-and-drop or dropdown assignment
- **Status Management:** Quick status updates across projects
- **Resource Allocation:** Hours, budget, timeline adjustments
- **Customer Communication:** Broadcast updates to specific projects

#### 3. Developer Management Interface
- **Developer Directory:** All developers with skills, rates, availability
- **Workload Management:** Visual capacity planning
- **Performance Metrics:** Completion rates, quality scores, customer feedback
- **Availability Calendar:** Developer schedules and project assignments

---

## Role-Based Access Control

### Customer Permissions
- **View:** Own projects, assigned developer info, customer-visible updates
- **Create:** Messages to developer/admin, feedback, file uploads
- **Cannot:** See internal developer notes, other customers' projects, developer assignments

### Developer Permissions
- **View:** Assigned projects, all project details, internal notes
- **Create:** Task updates, internal notes, customer messages, progress reports
- **Update:** Task status, logged hours, technical specifications
- **Cannot:** Create/delete projects, see other developers' projects, manage user accounts

### Admin Permissions
- **Full Access:** All projects, all users, all data
- **Create:** Projects, tasks, user accounts
- **Update:** Any project data, user roles, developer assignments
- **Delete:** Projects, tasks, user accounts (with restrictions)
- **Manage:** Developer availability, project assignments, system settings

---

## Technical Implementation

### Frontend Stack
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **React Query** for data fetching
- **Zustand** for state management
- **Role-based routing** and component rendering

### Backend Stack
- **Express.js** API server
- **Supabase** PostgreSQL database
- **JWT** authentication with role claims
- **Role-based middleware** for API endpoints
- **Multer** for file uploads to Cloudflare R2
- **Loops.so** for email notifications and sequences

### Key Features Implementation

#### Role-Based Authentication
- JWT tokens include user role and permissions
- Middleware validates role access for each endpoint
- Frontend components conditionally render based on user role
- API responses filtered by user permissions

#### Developer Workflow
- **Task Assignment:** Automatic task creation when project assigned
- **Time Tracking:** Built-in timer and manual hour logging
- **Progress Reporting:** Automated updates when tasks completed
- **Internal Communication:** Developer-admin messaging separate from customer communication

#### Project Assignment Logic
- **Auto-Assignment:** Based on developer skills and availability
- **Manual Assignment:** Admin can override and assign specific developers
- **Workload Balancing:** Prevent over-assignment based on capacity settings
- **Skill Matching:** Match project requirements with developer expertise

---

## Future Enhancements (Not in MVP)

### Phase 2 Features
- **Advanced Task Management:** Dependencies, subtasks, recurring tasks
- **Developer Ratings:** Customer feedback and rating system
- **Automated Matching:** AI-powered developer-project matching
- **Mobile Apps:** Native iOS/Android apps for developers
- **Integration APIs:** Connect with popular dev tools (GitHub, Jira, Slack)

### Phase 3 Features
- **Freelancer Marketplace:** Open platform for external developers
- **Advanced Analytics:** Performance metrics, predictive analytics
- **White-label Solutions:** Branded versions for agencies
- **Multi-language Support:** International developer support
- **Advanced Billing:** Automatic invoicing, payment processing

---

## Success Metrics

### Customer Satisfaction
- **Response Time:** Average time to developer response
- **Project Completion:** On-time delivery rates
- **Communication Quality:** Message frequency and satisfaction
- **Transparency:** Customer understanding of project progress

### Developer Satisfaction
- **Workload Balance:** Hours per week, project variety
- **Payment Timeliness:** Invoice processing speed
- **Tool Effectiveness:** Time saved vs. previous workflows
- **Career Growth:** Skill development opportunities

### Business Metrics
- **Developer Utilization:** Percentage of available hours booked
- **Project Profitability:** Revenue vs. developer costs
- **Retention Rates:** Customer and developer retention
- **Scaling Efficiency:** Projects completed per admin hour

---

## Development Timeline

### Week 1-2: Core Infrastructure & Authentication
- Database setup with role-based schema
- JWT authentication with role permissions
- Basic API endpoints with role middleware
- User registration and profile management

### Week 3-4: Project & Task Management
- Project CRUD with developer assignment
- Task management system
- Basic dashboard layouts for all three user types
- Role-based data filtering

### Week 5-6: Communication & File Sharing
- Multi-party messaging system
- File upload with role-based access
- Email notifications for all user types
- Internal vs. customer-facing communication

### Week 7-8: Developer Tools & Polish
- Time tracking and hour logging
- Developer workload management
- Admin assignment interface
- UI/UX improvements and testing

### Week 9-10: Integration & Launch
- Vercel preview integration
- Performance optimization
- Security hardening
- Production deployment and monitoring