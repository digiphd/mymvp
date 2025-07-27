# MyMVP Dashboard API

A comprehensive Express.js API for the MyMVP dashboard system supporting customers, developers, and administrators with full project management capabilities.

## Features

### Core Dashboard Functionality
- ✅ **Multi-role Authentication**: JWT-based auth for customers, developers, and admins
- ✅ **Project Management**: Full lifecycle project tracking with developer assignment
- ✅ **Task Management**: Developer workflow with time tracking and status updates
- ✅ **Real-time Messaging**: Multi-party communication between all stakeholders
- ✅ **File Management**: Upload/download with role-based access control
- ✅ **Dashboard Analytics**: Role-specific insights and metrics

### Security & Performance
- ✅ **Role-based Access Control**: Granular permissions for each user type
- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **Database Security**: Row Level Security (RLS) policies
- ✅ **Input Validation**: Comprehensive Joi schema validation
- ✅ **Rate Limiting**: Protection against abuse
- ✅ **CORS Protection**: Configurable cross-origin policies

### Legacy Support
- ✅ **Application Processing**: Maintains backward compatibility
- ✅ **Lead Qualification**: Automated scoring and routing logic
- ✅ **Email Integration**: Loops.so transactional emails
- ✅ **Vercel Ready**: Optimized for serverless deployment

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

**Required variables:**
- `JWT_SECRET`: Secret key for JWT tokens (min 32 characters)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_KEY`: Supabase service role key
- `CORS_ORIGIN`: Your frontend domain

**Optional variables:**
- `LOOPS_API_KEY`: For email notifications
- `API_SECRET_KEY`: For legacy application endpoint
- `FILE_STORAGE_URL`: For file downloads

### 3. Set Up Database

#### Option A: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Start local development
cd supabase
supabase start

# Apply migrations (includes sample data)
supabase db reset
```

#### Option B: Manual Setup

```bash
# Copy and run the dashboard schema in your Supabase SQL editor
cat database/dashboard-schema.sql

# Or use the migration file
cat supabase/migrations/20241127000000_initial_dashboard_schema.sql
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

Dashboard endpoints require JWT authentication. Legacy application endpoint uses API key.

## API Documentation

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer",
    "currentOrganizationId": "org-uuid"
  }
}
```

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123",
  "role": "customer"
}
```

#### Get Profile
```http
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

### Organization Management

#### Get User's Organizations
```http
GET /api/organizations
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "status": "success",
  "organizations": [
    {
      "organization_id": "uuid",
      "organization_name": "TechStartup Inc",
      "organization_slug": "techstartup-inc",
      "user_role": "admin",
      "is_current": true
    }
  ]
}
```

#### Create Organization
```http
POST /api/organizations
Authorization: Bearer <jwt_token>

{
  "name": "My Company",
  "slug": "my-company",
  "description": "Description of my company",
  "website_url": "https://mycompany.com"
}
```

#### Switch Organization
```http
POST /api/organizations/:organizationId/switch
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "status": "success",
  "token": "new-jwt-token-with-org-context",
  "organization_id": "uuid"
}
```

#### Get Organization Members
```http
GET /api/organizations/:organizationId/members
Authorization: Bearer <jwt_token>
```

#### Add Member to Organization
```http
POST /api/organizations/:organizationId/members
Authorization: Bearer <jwt_token>

{
  "user_id": "uuid",
  "role": "developer"
}
```

#### Update Member Role
```http
PUT /api/organizations/:organizationId/members/:memberId
Authorization: Bearer <jwt_token>

{
  "role": "admin"
}
```

#### Remove Member
```http
DELETE /api/organizations/:organizationId/members/:memberId
Authorization: Bearer <jwt_token>
```

### Project Management

#### Get Projects (Role-filtered)
```http
GET /api/projects
Authorization: Bearer <jwt_token>
```

#### Create Project (Admin Only)
```http
POST /api/projects
Authorization: Bearer <jwt_token>

{
  "title": "E-commerce Platform",
  "type": "mvp",
  "price_cents": 1200000,
  "customer_id": "uuid-here"
}
```

#### Assign Developer (Admin Only)
```http
PUT /api/projects/:id/assign
Authorization: Bearer <jwt_token>

{
  "developer_id": "uuid-here"
}
```

### Task Management

#### Get Project Tasks
```http
GET /api/projects/:projectId/tasks
Authorization: Bearer <jwt_token>
```

#### Create Task
```http
POST /api/projects/:projectId/tasks
Authorization: Bearer <jwt_token>

{
  "title": "Set up authentication",
  "description": "Implement JWT-based auth",
  "priority": "high",
  "estimated_hours": 8
}
```

#### Update Task Status
```http
PUT /api/tasks/:id
Authorization: Bearer <jwt_token>

{
  "status": "completed",
  "actual_hours": 6.5
}
```

### Messaging System

#### Get Project Messages
```http
GET /api/projects/:projectId/messages
Authorization: Bearer <jwt_token>
```

#### Send Message
```http
POST /api/projects/:projectId/messages
Authorization: Bearer <jwt_token>

{
  "content": "Project looks great! Can we adjust the styling?",
  "message_type": "feedback"
}
```

### File Management

#### Upload Files
```http
POST /api/projects/:projectId/files
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

files: [file1, file2]
description: "Design mockups"
category: "asset"
```

#### Download File
```http
GET /api/files/:id/download
Authorization: Bearer <jwt_token>
```

### Dashboard Data

#### Get Role-based Dashboard
```http
GET /api/dashboard
Authorization: Bearer <jwt_token>
```

Returns different data based on user role:
- **Admin**: All projects, developer workload, system stats
- **Developer**: Assigned projects, upcoming tasks
- **Customer**: Their projects, progress updates

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "2.0.0",
  "environment": "development"
}
```

## Multi-Organization Architecture

### Organization Structure
- **Users belong to multiple organizations** with different roles in each
- **Developers can work across organizations** on different projects
- **Organization switching** allows users to change context seamlessly
- **Role-based permissions** apply within each organization separately

### User Roles & Permissions (Per Organization)

#### Customer Role
- **View**: Own projects within current organization, assigned developer info, project updates
- **Create**: Messages to developer/admin, feedback on deliverables
- **Switch**: Between organizations where they are members
- **Cannot**: See other customers' projects, internal developer notes, cross-organization data

#### Developer Role
- **View**: Assigned projects within current organization, all project details, customer messages
- **Create**: Task updates, internal notes, progress reports, customer communication
- **Update**: Task status, logged hours, technical specifications
- **Switch**: Between organizations where they provide development services
- **Cannot**: Create/delete projects, see other developers' projects, manage organization members

#### Organization Admin Role
- **Organization Access**: Full access to current organization's projects and data
- **Member Management**: Add/remove members, change roles within organization
- **Project Management**: Create projects, assign developers, manage organization workflow
- **Switch**: Between organizations where they have admin privileges
- **Cannot**: Access other organizations' data, manage global system settings

#### Global Admin Role (MyMVP Team)
- **Full System Access**: All organizations, all users, all data
- **Organization Management**: Create organizations, manage cross-organization features
- **Developer Assignment**: Assign developers to projects across organizations
- **System Management**: Global settings, monitoring, and administration

## Database Schema

The API uses a comprehensive PostgreSQL schema with:

### Core Tables
- **users** - All system users (customers, developers, admins)
- **projects** - Customer projects with developer assignments and tracking
- **project_tasks** - Individual tasks within projects for developer workflow
- **project_updates** - Status updates, milestones, and progress reports
- **messages** - Multi-party communication between users
- **files** - File uploads and deliverables with role-based access
- **developer_availability** - Developer capacity and workload tracking

### Security Features
- **Row Level Security (RLS)** policies for data isolation
- **Role-based access** controls at the database level
- **Audit trails** for all critical operations
- **Indexes** optimized for dashboard queries

See `database/dashboard-schema.sql` for the complete implementation.

## Security Features

### Authentication & Authorization
- **JWT Authentication**: Token-based auth with role claims
- **Password Security**: Bcrypt hashing with 12 salt rounds
- **Role-based Middleware**: Granular permission controls
- **Project-level Access**: Users can only access authorized projects

### API Security
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable allowed origins
- **Input Validation**: Comprehensive Joi schema validation
- **Security Headers**: Helmet.js protection against common attacks
- **File Upload Restrictions**: Type and size limitations

### Database Security
- **Row Level Security**: Supabase RLS policies
- **Service Role Access**: Elevated permissions for API operations
- **Parameterized Queries**: Protection against SQL injection
- **Connection Security**: Encrypted connections to database

## Error Handling

The API provides detailed error responses:

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

The `vercel.json` configuration is already included.

### Manual Deployment

```bash
npm run build
npm start
```

## Development Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
npm run lint     # Run ESLint
```

## Monitoring

The API logs all important events:
- ✅ Successful applications
- ❌ Validation failures
- 📧 Email delivery status
- 💾 Database operations
- 🚨 Errors and exceptions

Monitor these logs in your deployment platform for insights and debugging.

## Support

For questions or issues:
1. Check the logs for error details
2. Verify environment variables are set correctly
3. Test with the health check endpoint
4. Ensure Supabase database schema is applied

## License

Private - MyMVP Internal Use Only