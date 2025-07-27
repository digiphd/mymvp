# Supabase Database Setup

This directory contains the Supabase configuration and migrations for the MyMVP Dashboard API.

## Quick Start

### 1. Install Supabase CLI

```bash
npm install -g supabase
# or
brew install supabase/tap/supabase
```

### 2. Initialize Local Development

```bash
# Start local Supabase instance
supabase start

# Apply migrations
supabase db reset
```

### 3. Create Production Database

```bash
# Link to your Supabase project
supabase link --project-ref your-project-ref

# Push migrations to production
supabase db push
```

## Database Structure

### Core Tables

- **users** - All system users (customers, developers, admins)
- **projects** - Customer projects with developer assignments
- **project_tasks** - Individual tasks within projects
- **project_updates** - Status updates and milestones
- **messages** - Multi-party communication system
- **files** - File uploads and deliverables
- **developer_availability** - Developer capacity tracking

### Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Role-based policies** for customers, developers, and admins
- **Service role access** for API operations
- **Audit trails** with created_at/updated_at timestamps

## Migrations

### Current Migrations

- `20241127000000_initial_dashboard_schema.sql` - Complete dashboard schema with sample data

### Creating New Migrations

```bash
# Generate new migration
supabase migration new your_migration_name

# Apply locally
supabase db reset

# Push to production
supabase db push
```

## Sample Data

The initial migration includes comprehensive sample data for development:

### Sample Users (password: 'admin123', 'dev123', 'customer123')
- **Admin**: admin@mymvp.io
- **Developers**: john@mymvp.io, sarah@mymvp.io, mike@mymvp.io  
- **Customers**: alice@techstartup.com, bob@innovate.co, emma@foodtech.io

### Sample Projects
- **E-commerce Platform** (In Progress) - $15K project
- **Analytics Dashboard** (Planning) - $10K project  
- **Food Delivery App** (PoC) - $5K project

### Features Demonstrated
- Complete project workflow from planning to delivery
- Multi-role messaging and communication
- Task management with time tracking
- File uploads and deliverables
- Developer availability and workload management

## Local Development

### Starting Local Supabase

```bash
supabase start
```

This starts:
- **Database**: PostgreSQL on localhost:54322
- **API**: Auto-generated REST API on localhost:54321
- **Dashboard**: Supabase Studio on localhost:54323
- **Auth**: Built-in authentication server
- **Storage**: File storage system

### Environment Variables

Update your `.env` file with local development settings:

```bash
# Local development
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your-local-anon-key
SUPABASE_SERVICE_KEY=your-local-service-key
```

### Resetting Database

```bash
# Reset to latest migration
supabase db reset

# Reset and seed with sample data
supabase db reset --seed
```

## Production Deployment

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note your project reference and database URL

### 2. Link and Deploy

```bash
# Link to production project
supabase link --project-ref your-project-ref

# Push schema to production
supabase db push

# Optional: Seed with sample data (development only)
psql "your-production-connection-string" < seed.sql
```

### 3. Configure API Environment

Update your production environment variables:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_KEY=your-production-service-key
```

## API Integration

The database is designed to work seamlessly with the Express API:

### Authentication
- JWT tokens validated against `users` table
- Role-based access control with RLS policies
- Service role for API operations

### Data Access Patterns
- **Customers**: See only their own projects and related data
- **Developers**: Access assigned projects and internal communication
- **Admins**: Full access to all data and management functions

### Performance Optimizations
- Strategic indexes on frequently queried columns
- Optimized joins for dashboard queries
- Efficient RLS policies to minimize query overhead

## Monitoring

### Database Health

```bash
# Check migration status
supabase migration list

# View database logs
supabase logs db

# Check connection status
supabase status
```

### Useful Queries

```sql
-- Check user distribution
SELECT role, COUNT(*) FROM users GROUP BY role;

-- Project status overview
SELECT status, COUNT(*) FROM projects GROUP BY status;

-- Developer workload
SELECT 
  u.name,
  COUNT(p.id) as active_projects,
  SUM(p.actual_hours) as total_hours
FROM users u
LEFT JOIN projects p ON u.id = p.assigned_developer_id
WHERE u.role = 'developer'
GROUP BY u.id, u.name;
```

## Troubleshooting

### Common Issues

1. **Migration failed**: Check for syntax errors in SQL files
2. **RLS blocking queries**: Ensure proper authentication context
3. **Connection issues**: Verify environment variables and network access

### Reset and Rebuild

```bash
# Complete reset (destroys all local data)
supabase stop
supabase start
supabase db reset
```

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)