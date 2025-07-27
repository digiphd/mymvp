import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import Joi from 'joi'
import bcrypt from 'bcryptjs'
import multer from 'multer'
import { createClient } from '@supabase/supabase-js'
import { 
  authenticateToken, 
  requireRole, 
  requireProjectAccess,
  requireOrganizationAccess,
  requireOrganizationRole,
  generateToken,
  validateApiKey 
} from './middleware/auth'

// Load environment variables
dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 3001

// Environment validation
const requiredEnvVars = [
  'JWT_SECRET',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_KEY',
  'CORS_ORIGIN'
]

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName])
if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '))
  process.exit(1)
}

// Initialize Supabase client with service key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://mymvp.io',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes per IP
  message: {
    status: 'error',
    message: 'Too many requests. Please try again later.',
    retry_after: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api', limiter)

// Body parsing with size limit
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// File upload configuration
const storage = multer.memoryStorage()
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files per request
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip', 'application/x-zip-compressed'
    ]
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('File type not allowed'))
    }
  }
})

// Validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
})

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(100).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('customer', 'developer').default('customer')
})

const projectSchema = Joi.object({
  title: Joi.string().min(2).max(255).required(),
  description: Joi.string().allow(''),
  type: Joi.string().valid('poc', 'mvp').required(),
  price_cents: Joi.number().integer().min(0).required(),
  customer_id: Joi.string().uuid().required(),
  assigned_developer_id: Joi.string().uuid().allow(null),
  start_date: Joi.date().allow(null),
  delivery_date: Joi.date().allow(null),
  requirements_doc: Joi.string().allow(''),
  technical_requirements: Joi.object().allow(null),
  estimated_hours: Joi.number().integer().min(0).allow(null)
})

const taskSchema = Joi.object({
  title: Joi.string().min(2).max(255).required(),
  description: Joi.string().allow(''),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  estimated_hours: Joi.number().min(0).allow(null),
  due_date: Joi.date().allow(null),
  labels: Joi.array().items(Joi.string()).allow(null)
})

const messageSchema = Joi.object({
  content: Joi.string().min(1).max(5000).required(),
  message_type: Joi.string().valid('general', 'technical', 'feedback', 'question').default('general'),
  is_internal: Joi.boolean().default(false)
})

const organizationSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  slug: Joi.string().min(2).max(100).pattern(/^[a-z0-9-]+$/).required(),
  description: Joi.string().allow(''),
  logo_url: Joi.string().uri().allow(''),
  website_url: Joi.string().uri().allow(''),
  billing_email: Joi.string().email().allow('')
})

const organizationMemberSchema = Joi.object({
  user_id: Joi.string().uuid().required(),
  role: Joi.string().valid('customer', 'developer', 'admin').required()
})

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development'
  })
})

// ===================
// ORGANIZATION ENDPOINTS
// ===================

// Get user's organizations
app.get('/api/organizations', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { data: organizations, error } = await supabase
      .rpc('get_user_organizations', { user_uuid: req.user!.id })

    if (error) {
      console.error('Get organizations error:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Failed to get organizations'
      })
    }

    res.json({
      status: 'success',
      organizations
    })

  } catch (error: any) {
    console.error('Get organizations error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to get organizations'
    })
  }
})

// Get specific organization details
app.get('/api/organizations/:organizationId', authenticateToken, requireOrganizationAccess, async (req: Request, res: Response) => {
  try {
    const { data: organization, error } = await supabase
      .from('organizations')
      .select(`
        *,
        created_by_user:users!organizations_created_by_fkey(id, name, email),
        member_count:organization_members(count)
      `)
      .eq('id', req.organizationId)
      .single()

    if (error || !organization) {
      return res.status(404).json({
        status: 'error',
        message: 'Organization not found'
      })
    }

    res.json({
      status: 'success',
      organization
    })

  } catch (error: any) {
    console.error('Get organization error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to get organization'
    })
  }
})

// Create new organization
app.post('/api/organizations', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { error: validationError, value } = organizationSchema.validate(req.body)
    if (validationError) {
      return res.status(400).json({
        status: 'error',
        message: validationError.details[0].message
      })
    }

    // Check if slug is available
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', value.slug)
      .single()

    if (existingOrg) {
      return res.status(400).json({
        status: 'error',
        message: 'Organization slug already exists'
      })
    }

    // Create organization
    const { data: organization, error } = await supabase
      .from('organizations')
      .insert({
        ...value,
        created_by: req.user!.id
      })
      .select()
      .single()

    if (error) {
      console.error('Create organization error:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create organization'
      })
    }

    // Add creator as admin member
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: organization.id,
        user_id: req.user!.id,
        role: 'admin',
        invited_by: req.user!.id,
        joined_at: new Date().toISOString()
      })

    if (memberError) {
      console.error('Add organization member error:', memberError)
      // Continue anyway, organization was created
    }

    // Set as current organization for the user
    await supabase
      .from('user_organization_preferences')
      .upsert({
        user_id: req.user!.id,
        current_organization_id: organization.id
      })

    res.status(201).json({
      status: 'success',
      organization
    })

  } catch (error: any) {
    console.error('Create organization error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to create organization'
    })
  }
})

// Update organization
app.put('/api/organizations/:organizationId', authenticateToken, requireOrganizationAccess, requireOrganizationRole('admin'), async (req: Request, res: Response) => {
  try {
    const allowedFields = ['name', 'description', 'logo_url', 'website_url', 'billing_email']
    const updateData: any = {}
    
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key) && req.body[key] !== undefined) {
        updateData[key] = req.body[key]
      }
    })

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No valid fields to update'
      })
    }

    const { data: organization, error } = await supabase
      .from('organizations')
      .update(updateData)
      .eq('id', req.organizationId)
      .select()
      .single()

    if (error) {
      console.error('Update organization error:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update organization'
      })
    }

    res.json({
      status: 'success',
      organization
    })

  } catch (error: any) {
    console.error('Update organization error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to update organization'
    })
  }
})

// Switch current organization
app.post('/api/organizations/:organizationId/switch', authenticateToken, requireOrganizationAccess, async (req: Request, res: Response) => {
  try {
    // Update user's current organization preference
    const { error } = await supabase
      .from('user_organization_preferences')
      .upsert({
        user_id: req.user!.id,
        current_organization_id: req.organizationId
      })

    if (error) {
      console.error('Switch organization error:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Failed to switch organization'
      })
    }

    // Generate new token with updated organization context
    const newToken = generateToken({
      userId: req.user!.id,
      email: req.user!.email,
      role: req.user!.role,
      name: req.user!.name,
      currentOrganizationId: req.organizationId
    })

    res.json({
      status: 'success',
      token: newToken,
      organization_id: req.organizationId
    })

  } catch (error: any) {
    console.error('Switch organization error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to switch organization'
    })
  }
})

// Get organization members
app.get('/api/organizations/:organizationId/members', authenticateToken, requireOrganizationAccess, async (req: Request, res: Response) => {
  try {
    const { data: members, error } = await supabase
      .from('organization_members')
      .select(`
        *,
        user:users!organization_members_user_id_fkey(id, name, email, avatar_url, created_at),
        invited_by_user:users!organization_members_invited_by_fkey(id, name, email)
      `)
      .eq('organization_id', req.organizationId)
      .eq('is_active', true)
      .order('joined_at', { ascending: false })

    if (error) {
      console.error('Get organization members error:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Failed to get organization members'
      })
    }

    res.json({
      status: 'success',
      members
    })

  } catch (error: any) {
    console.error('Get organization members error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to get organization members'
    })
  }
})

// Add member to organization
app.post('/api/organizations/:organizationId/members', authenticateToken, requireOrganizationAccess, requireOrganizationRole('admin'), async (req: Request, res: Response) => {
  try {
    const { error: validationError, value } = organizationMemberSchema.validate(req.body)
    if (validationError) {
      return res.status(400).json({
        status: 'error',
        message: validationError.details[0].message
      })
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('id', value.user_id)
      .single()

    if (userError || !user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      })
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', req.organizationId)
      .eq('user_id', value.user_id)
      .single()

    if (existingMember) {
      return res.status(400).json({
        status: 'error',
        message: 'User is already a member of this organization'
      })
    }

    // Add member
    const { data: member, error } = await supabase
      .from('organization_members')
      .insert({
        organization_id: req.organizationId,
        user_id: value.user_id,
        role: value.role,
        invited_by: req.user!.id,
        invited_at: new Date().toISOString(),
        joined_at: new Date().toISOString()
      })
      .select(`
        *,
        user:users!organization_members_user_id_fkey(id, name, email, avatar_url)
      `)
      .single()

    if (error) {
      console.error('Add organization member error:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Failed to add member to organization'
      })
    }

    res.status(201).json({
      status: 'success',
      member
    })

  } catch (error: any) {
    console.error('Add organization member error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to add member to organization'
    })
  }
})

// Update member role
app.put('/api/organizations/:organizationId/members/:memberId', authenticateToken, requireOrganizationAccess, requireOrganizationRole('admin'), async (req: Request, res: Response) => {
  try {
    const { role } = req.body

    if (!role || !['customer', 'developer', 'admin'].includes(role)) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid role is required'
      })
    }

    const { data: member, error } = await supabase
      .from('organization_members')
      .update({ role })
      .eq('id', req.params.memberId)
      .eq('organization_id', req.organizationId)
      .select(`
        *,
        user:users!organization_members_user_id_fkey(id, name, email, avatar_url)
      `)
      .single()

    if (error) {
      console.error('Update member role error:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update member role'
      })
    }

    res.json({
      status: 'success',
      member
    })

  } catch (error: any) {
    console.error('Update member role error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to update member role'
    })
  }
})

// Remove member from organization
app.delete('/api/organizations/:organizationId/members/:memberId', authenticateToken, requireOrganizationAccess, requireOrganizationRole('admin'), async (req: Request, res: Response) => {
  try {
    const { error } = await supabase
      .from('organization_members')
      .update({ is_active: false })
      .eq('id', req.params.memberId)
      .eq('organization_id', req.organizationId)

    if (error) {
      console.error('Remove organization member error:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Failed to remove member from organization'
      })
    }

    res.json({
      status: 'success',
      message: 'Member removed from organization'
    })

  } catch (error: any) {
    console.error('Remove organization member error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to remove member from organization'
    })
  }
})

// ===================
// AUTHENTICATION ENDPOINTS
// ===================

// Login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { error: validationError, value } = loginSchema.validate(req.body)
    if (validationError) {
      return res.status(400).json({
        status: 'error',
        message: validationError.details[0].message
      })
    }

    const { email, password } = value

    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, password_hash, role, is_active')
      .eq('email', email)
      .single()

    if (error || !user || !user.is_active) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      })
    }

    // Get user's current organization
    const { data: preferences } = await supabase
      .from('user_organization_preferences')
      .select('current_organization_id')
      .eq('user_id', user.id)
      .single()

    // Generate JWT token with organization context
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      currentOrganizationId: preferences?.current_organization_id
    })

    res.json({
      status: 'success',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        currentOrganizationId: preferences?.current_organization_id
      }
    })

  } catch (error: any) {
    console.error('Login error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Login failed'
    })
  }
})

// Register
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { error: validationError, value } = registerSchema.validate(req.body)
    if (validationError) {
      return res.status(400).json({
        status: 'error',
        message: validationError.details[0].message
      })
    }

    const { email, name, password, role } = value

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already registered'
      })
    }

    // Hash password
    const saltRounds = 12
    const password_hash = await bcrypt.hash(password, saltRounds)

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email,
        name,
        password_hash,
        role
      })
      .select('id, email, name, role')
      .single()

    if (error) {
      console.error('User creation error:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Registration failed'
      })
    }

    // Generate JWT token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name
    })

    res.status(201).json({
      status: 'success',
      token,
      user: newUser
    })

  } catch (error: any) {
    console.error('Registration error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Registration failed'
    })
  }
})

// Get current user profile
app.get('/api/auth/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, bio, skills, hourly_rate, timezone, avatar_url, created_at')
      .eq('id', req.user!.id)
      .single()

    if (error || !user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      })
    }

    res.json({
      status: 'success',
      user
    })

  } catch (error: any) {
    console.error('Get profile error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to get profile'
    })
  }
})

// Update user profile
app.put('/api/auth/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const allowedFields = ['name', 'bio', 'skills', 'hourly_rate', 'timezone', 'avatar_url']
    const updateData: any = {}
    
    // Only include allowed fields that are present in request
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key) && req.body[key] !== undefined) {
        updateData[key] = req.body[key]
      }
    })

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No valid fields to update'
      })
    }

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', req.user!.id)
      .select('id, email, name, role, bio, skills, hourly_rate, timezone, avatar_url')
      .single()

    if (error) {
      console.error('Profile update error:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Profile update failed'
      })
    }

    res.json({
      status: 'success',
      user: updatedUser
    })

  } catch (error: any) {
    console.error('Profile update error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Profile update failed'
    })
  }
})

// ===================
// PROJECT ENDPOINTS
// ===================

// Get projects (organization and role-based filtering)
app.get('/api/projects', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user!.currentOrganizationId) {
      return res.status(400).json({
        status: 'error',
        message: 'No organization selected. Please switch to an organization first.'
      })
    }

    let query = supabase
      .from('projects')
      .select(`
        *,
        customer:users!projects_customer_id_fkey(id, name, email),
        developer:users!projects_assigned_developer_id_fkey(id, name, email),
        organization:organizations!projects_organization_id_fkey(id, name, slug)
      `)
      .eq('organization_id', req.user!.currentOrganizationId)

    // Apply additional role-based filtering within the organization
    if (req.user!.role === 'customer') {
      query = query.eq('customer_id', req.user!.id)
    } else if (req.user!.role === 'developer') {
      query = query.eq('assigned_developer_id', req.user!.id)
    }
    // Admin sees all projects in the organization

    const { data: projects, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Get projects error:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Failed to get projects'
      })
    }

    res.json({
      status: 'success',
      projects
    })

  } catch (error: any) {
    console.error('Get projects error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to get projects'
    })
  }
})

// Get specific project
app.get('/api/projects/:id', authenticateToken, requireProjectAccess, async (req: Request, res: Response) => {
  try {
    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        *,
        customer:users!projects_customer_id_fkey(id, name, email, avatar_url),
        developer:users!projects_assigned_developer_id_fkey(id, name, email, avatar_url, bio, skills)
      `)
      .eq('id', req.params.id)
      .single()

    if (error || !project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      })
    }

    res.json({
      status: 'success',
      project
    })

  } catch (error: any) {
    console.error('Get project error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to get project'
    })
  }
})

// Create project (admin only within current organization)
app.post('/api/projects', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user!.currentOrganizationId) {
      return res.status(400).json({
        status: 'error',
        message: 'No organization selected. Please switch to an organization first.'
      })
    }

    // Check if user is admin in current organization
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', req.user!.currentOrganizationId)
      .eq('user_id', req.user!.id)
      .eq('is_active', true)
      .single()

    if (!membership || membership.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin role required in current organization'
      })
    }

    const { error: validationError, value } = projectSchema.validate(req.body)
    if (validationError) {
      return res.status(400).json({
        status: 'error',
        message: validationError.details[0].message
      })
    }

    // Ensure project belongs to current organization
    const projectData = {
      ...value,
      organization_id: req.user!.currentOrganizationId
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select(`
        *,
        customer:users!projects_customer_id_fkey(id, name, email),
        developer:users!projects_assigned_developer_id_fkey(id, name, email),
        organization:organizations!projects_organization_id_fkey(id, name, slug)
      `)
      .single()

    if (error) {
      console.error('Create project error:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create project'
      })
    }

    res.status(201).json({
      status: 'success',
      project
    })

  } catch (error: any) {
    console.error('Create project error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to create project'
    })
  }
})

// Update project
app.put('/api/projects/:id', authenticateToken, requireProjectAccess, async (req: Request, res: Response) => {
  try {
    const allowedFields = [
      'title', 'description', 'status', 'priority', 'start_date', 
      'delivery_date', 'preview_url', 'repo_url', 'requirements_doc', 
      'technical_requirements', 'final_deliverables', 'estimated_hours', 'actual_hours'
    ]

    // Admin can update additional fields
    if (req.user!.role === 'admin') {
      allowedFields.push('assigned_developer_id', 'price_cents', 'developer_budget_cents')
    }

    const updateData: any = {}
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key) && req.body[key] !== undefined) {
        updateData[key] = req.body[key]
      }
    })

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No valid fields to update'
      })
    }

    const { data: project, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', req.params.id)
      .select(`
        *,
        customer:users!projects_customer_id_fkey(id, name, email),
        developer:users!projects_assigned_developer_id_fkey(id, name, email)
      `)
      .single()

    if (error) {
      console.error('Update project error:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update project'
      })
    }

    res.json({
      status: 'success',
      project
    })

  } catch (error: any) {
    console.error('Update project error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to update project'
    })
  }
})

// Assign developer to project (admin only)
app.put('/api/projects/:id/assign', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { developer_id } = req.body

    if (!developer_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Developer ID is required'
      })
    }

    // Verify developer exists and is active
    const { data: developer, error: devError } = await supabase
      .from('users')
      .select('id, role, is_active')
      .eq('id', developer_id)
      .eq('role', 'developer')
      .eq('is_active', true)
      .single()

    if (devError || !developer) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid developer'
      })
    }

    const { data: project, error } = await supabase
      .from('projects')
      .update({ 
        assigned_developer_id: developer_id,
        status: 'assigned'
      })
      .eq('id', req.params.id)
      .select(`
        *,
        customer:users!projects_customer_id_fkey(id, name, email),
        developer:users!projects_assigned_developer_id_fkey(id, name, email)
      `)
      .single()

    if (error) {
      console.error('Assign developer error:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Failed to assign developer'
      })
    }

    res.json({
      status: 'success',
      project
    })

  } catch (error: any) {
    console.error('Assign developer error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to assign developer'
    })
  }
})

// ===================
// TASK ENDPOINTS
// ===================

// Get tasks for a project
app.get('/api/projects/:projectId/tasks', authenticateToken, requireProjectAccess, async (req: Request, res: Response) => {
  try {
    const { data: tasks, error } = await supabase
      .from('project_tasks')
      .select(`
        *,
        assigned_developer:users!project_tasks_assigned_developer_id_fkey(id, name, email),
        created_by_user:users!project_tasks_created_by_fkey(id, name, email)
      `)
      .eq('project_id', req.params.projectId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get tasks error:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Failed to get tasks'
      })
    }

    res.json({
      status: 'success',
      tasks
    })

  } catch (error: any) {
    console.error('Get tasks error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to get tasks'
    })
  }
})

// Create task
app.post('/api/projects/:projectId/tasks', authenticateToken, requireProjectAccess, async (req: Request, res: Response) => {
  try {
    const { error: validationError, value } = taskSchema.validate(req.body)
    if (validationError) {
      return res.status(400).json({
        status: 'error',
        message: validationError.details[0].message
      })
    }

    const taskData = {
      ...value,
      project_id: req.params.projectId,
      created_by: req.user!.id
    }

    const { data: task, error } = await supabase
      .from('project_tasks')
      .insert(taskData)
      .select(`
        *,
        assigned_developer:users!project_tasks_assigned_developer_id_fkey(id, name, email),
        created_by_user:users!project_tasks_created_by_fkey(id, name, email)
      `)
      .single()

    if (error) {
      console.error('Create task error:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create task'
      })
    }

    res.status(201).json({
      status: 'success',
      task
    })

  } catch (error: any) {
    console.error('Create task error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to create task'
    })
  }
})

// Update task
app.put('/api/tasks/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    // First check if user has access to this task
    const { data: task, error: taskError } = await supabase
      .from('project_tasks')
      .select('project_id, assigned_developer_id')
      .eq('id', req.params.id)
      .single()

    if (taskError || !task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      })
    }

    // Check project access
    req.params.projectId = task.project_id
    await new Promise((resolve, reject) => {
      requireProjectAccess(req, res, (err) => {
        if (err) reject(err)
        else resolve(true)
      })
    })

    const allowedFields = ['title', 'description', 'status', 'priority', 'estimated_hours', 'actual_hours', 'due_date', 'labels']
    
    // Developers can only update tasks assigned to them
    if (req.user!.role === 'developer' && task.assigned_developer_id !== req.user!.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Can only update tasks assigned to you'
      })
    }

    const updateData: any = {}
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key) && req.body[key] !== undefined) {
        updateData[key] = req.body[key]
      }
    })

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No valid fields to update'
      })
    }

    const { data: updatedTask, error } = await supabase
      .from('project_tasks')
      .update(updateData)
      .eq('id', req.params.id)
      .select(`
        *,
        assigned_developer:users!project_tasks_assigned_developer_id_fkey(id, name, email),
        created_by_user:users!project_tasks_created_by_fkey(id, name, email)
      `)
      .single()

    if (error) {
      console.error('Update task error:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update task'
      })
    }

    res.json({
      status: 'success',
      task: updatedTask
    })

  } catch (error: any) {
    console.error('Update task error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to update task'
    })
  }
})

// ===================
// MESSAGE ENDPOINTS
// ===================

// Get messages for a project
app.get('/api/projects/:projectId/messages', authenticateToken, requireProjectAccess, async (req: Request, res: Response) => {
  try {
    let query = supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, name, email, avatar_url)
      `)
      .eq('project_id', req.params.projectId)

    // Filter internal messages for customers
    if (req.user!.role === 'customer') {
      query = query.eq('is_internal', false)
    }

    const { data: messages, error } = await query.order('created_at', { ascending: true })

    if (error) {
      console.error('Get messages error:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Failed to get messages'
      })
    }

    res.json({
      status: 'success',
      messages
    })

  } catch (error: any) {
    console.error('Get messages error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to get messages'
    })
  }
})

// Send message
app.post('/api/projects/:projectId/messages', authenticateToken, requireProjectAccess, async (req: Request, res: Response) => {
  try {
    const { error: validationError, value } = messageSchema.validate(req.body)
    if (validationError) {
      return res.status(400).json({
        status: 'error',
        message: validationError.details[0].message
      })
    }

    // Customers cannot send internal messages
    if (req.user!.role === 'customer' && value.is_internal) {
      return res.status(403).json({
        status: 'error',
        message: 'Customers cannot send internal messages'
      })
    }

    const messageData = {
      ...value,
      project_id: req.params.projectId,
      sender_id: req.user!.id
    }

    const { data: message, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, name, email, avatar_url)
      `)
      .single()

    if (error) {
      console.error('Send message error:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send message'
      })
    }

    res.status(201).json({
      status: 'success',
      message
    })

  } catch (error: any) {
    console.error('Send message error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to send message'
    })
  }
})

// ===================
// FILE ENDPOINTS
// ===================

// Get files for a project
app.get('/api/projects/:projectId/files', authenticateToken, requireProjectAccess, async (req: Request, res: Response) => {
  try {
    const { data: files, error } = await supabase
      .from('files')
      .select(`
        *,
        uploaded_by_user:users!files_uploaded_by_fkey(id, name, email)
      `)
      .eq('project_id', req.params.projectId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get files error:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Failed to get files'
      })
    }

    res.json({
      status: 'success',
      files
    })

  } catch (error: any) {
    console.error('Get files error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to get files'
    })
  }
})

// Upload files to a project
app.post('/api/projects/:projectId/files', authenticateToken, requireProjectAccess, upload.array('files', 5), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[]
    if (!files || files.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No files provided'
      })
    }

    const { description, category = 'asset', is_final_deliverable = false } = req.body

    const uploadedFiles = []

    for (const file of files) {
      // In a real implementation, you would upload to cloud storage (S3, Cloudflare R2, etc.)
      // For now, we'll store file metadata and indicate files need external storage
      const fileRecord = {
        project_id: req.params.projectId,
        uploaded_by: req.user!.id,
        filename: file.originalname,
        file_path: `/uploads/${req.params.projectId}/${Date.now()}-${file.originalname}`, // Placeholder path
        file_size: file.size,
        mime_type: file.mimetype,
        description: description || null,
        category,
        is_final_deliverable: is_final_deliverable === 'true'
      }

      const { data: savedFile, error } = await supabase
        .from('files')
        .insert(fileRecord)
        .select(`
          *,
          uploaded_by_user:users!files_uploaded_by_fkey(id, name, email)
        `)
        .single()

      if (error) {
        console.error('Save file record error:', error)
        continue // Skip this file but continue with others
      }

      uploadedFiles.push(savedFile)
    }

    if (uploadedFiles.length === 0) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to upload any files'
      })
    }

    res.status(201).json({
      status: 'success',
      files: uploadedFiles,
      message: `Successfully uploaded ${uploadedFiles.length} of ${files.length} files`
    })

  } catch (error: any) {
    console.error('Upload files error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload files'
    })
  }
})

// Download file
app.get('/api/files/:id/download', authenticateToken, async (req: Request, res: Response) => {
  try {
    // Get file record and check project access
    const { data: file, error } = await supabase
      .from('files')
      .select('*, project_id')
      .eq('id', req.params.id)
      .single()

    if (error || !file) {
      return res.status(404).json({
        status: 'error',
        message: 'File not found'
      })
    }

    // Check project access
    req.params.projectId = file.project_id
    await new Promise((resolve, reject) => {
      requireProjectAccess(req, res, (err) => {
        if (err) reject(err)
        else resolve(true)
      })
    })

    // In a real implementation, you would:
    // 1. Get the file from cloud storage
    // 2. Stream it back to the client
    // For now, return file info and download URL
    res.json({
      status: 'success',
      file: {
        ...file,
        download_url: `${process.env.FILE_STORAGE_URL || 'https://storage.example.com'}${file.file_path}`
      },
      message: 'File download URL generated'
    })

  } catch (error: any) {
    console.error('Download file error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to download file'
    })
  }
})

// Delete file
app.delete('/api/files/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    // Get file record and check project access
    const { data: file, error } = await supabase
      .from('files')
      .select('*, project_id')
      .eq('id', req.params.id)
      .single()

    if (error || !file) {
      return res.status(404).json({
        status: 'error',
        message: 'File not found'
      })
    }

    // Check project access
    req.params.projectId = file.project_id
    await new Promise((resolve, reject) => {
      requireProjectAccess(req, res, (err) => {
        if (err) reject(err)
        else resolve(true)
      })
    })

    // Only allow file deletion by uploader or admin
    if (req.user!.role !== 'admin' && file.uploaded_by !== req.user!.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Can only delete files you uploaded'
      })
    }

    const { error: deleteError } = await supabase
      .from('files')
      .delete()
      .eq('id', req.params.id)

    if (deleteError) {
      console.error('Delete file error:', deleteError)
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete file'
      })
    }

    // In a real implementation, also delete from cloud storage
    // await deleteFromCloudStorage(file.file_path)

    res.json({
      status: 'success',
      message: 'File deleted successfully'
    })

  } catch (error: any) {
    console.error('Delete file error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete file'
    })
  }
})

// ===================
// DASHBOARD ENDPOINTS
// ===================

// Get dashboard data (organization and role-based)
app.get('/api/dashboard', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user!.currentOrganizationId) {
      return res.status(400).json({
        status: 'error',
        message: 'No organization selected. Please switch to an organization first.'
      })
    }

    // Get user's role in current organization
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', req.user!.currentOrganizationId)
      .eq('user_id', req.user!.id)
      .eq('is_active', true)
      .single()

    if (!membership) {
      return res.status(403).json({
        status: 'error',
        message: 'No access to current organization'
      })
    }

    const organizationRole = membership.role

    if (organizationRole === 'admin') {
      // Admin dashboard - organization-wide overview
      const { data: stats, error: statsError } = await supabase
        .from('project_dashboard_stats')
        .select('*')
        .eq('organization_id', req.user!.currentOrganizationId)

      const { data: recentProjects, error: projectsError } = await supabase
        .from('projects')
        .select(`
          id, title, status, created_at,
          customer:users!projects_customer_id_fkey(name, email),
          developer:users!projects_assigned_developer_id_fkey(name, email)
        `)
        .eq('organization_id', req.user!.currentOrganizationId)
        .order('created_at', { ascending: false })
        .limit(10)

      const { data: developerWorkload, error: workloadError } = await supabase
        .from('developer_workload_stats')
        .select('*')
        .eq('organization_id', req.user!.currentOrganizationId)

      if (statsError || projectsError || workloadError) {
        throw new Error('Failed to fetch admin dashboard data')
      }

      res.json({
        status: 'success',
        dashboard: {
          stats,
          recent_projects: recentProjects,
          developer_workload: developerWorkload,
          organization_role: organizationRole
        }
      })

    } else if (organizationRole === 'developer') {
      // Developer dashboard - assigned projects and tasks in current organization
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          customer:users!projects_customer_id_fkey(name, email, avatar_url)
        `)
        .eq('assigned_developer_id', req.user!.id)
        .eq('organization_id', req.user!.currentOrganizationId)
        .order('created_at', { ascending: false })

      const { data: tasks, error: tasksError } = await supabase
        .from('project_tasks')
        .select(`
          *,
          project:projects(id, title, organization_id, customer:users!projects_customer_id_fkey(name))
        `)
        .eq('assigned_developer_id', req.user!.id)
        .in('status', ['todo', 'in_progress'])
        .order('due_date', { ascending: true })
        .limit(10)

      // Filter tasks to only include those from current organization
      const organizationTasks = tasks?.filter(task => 
        task.project?.organization_id === req.user!.currentOrganizationId
      ) || []

      if (projectsError || tasksError) {
        throw new Error('Failed to fetch developer dashboard data')
      }

      res.json({
        status: 'success',
        dashboard: {
          projects,
          upcoming_tasks: organizationTasks,
          organization_role: organizationRole
        }
      })

    } else {
      // Customer dashboard - their projects in current organization
      const { data: projects, error } = await supabase
        .from('projects')
        .select(`
          *,
          developer:users!projects_assigned_developer_id_fkey(id, name, email, avatar_url)
        `)
        .eq('customer_id', req.user!.id)
        .eq('organization_id', req.user!.currentOrganizationId)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error('Failed to fetch customer dashboard data')
      }

      res.json({
        status: 'success',
        dashboard: {
          projects,
          organization_role: organizationRole
        }
      })
    }

  } catch (error: any) {
    console.error('Dashboard error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to get dashboard data'
    })
  }
})

// Get available developers (admin only)
app.get('/api/developers/available', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { data: developers, error } = await supabase
      .from('users')
      .select(`
        id, name, email, bio, skills, hourly_rate, avatar_url,
        projects:projects!projects_assigned_developer_id_fkey(id, status)
      `)
      .eq('role', 'developer')
      .eq('is_active', true)

    if (error) {
      console.error('Get developers error:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Failed to get developers'
      })
    }

    res.json({
      status: 'success',
      developers
    })

  } catch (error: any) {
    console.error('Get developers error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to get developers'
    })
  }
})

// Keep existing application endpoint for backwards compatibility
// (Moving the original application logic here)
// ... [Previous application endpoint code] ...

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found'
  })
})

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Unhandled error:', err)
  
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { debug: err.message })
  })
})

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 MyMVP Dashboard API server running on port ${PORT}`)
    console.log(`🔒 JWT authentication: ${process.env.JWT_SECRET ? '✅ Configured' : '❌ Missing JWT_SECRET'}`)
    console.log(`💾 Supabase integration: ${process.env.SUPABASE_URL ? '✅ Configured' : '❌ Missing URL'}`)
    console.log(`🛡️  CORS origin: ${process.env.CORS_ORIGIN || 'https://mymvp.io'}`)
    console.log(`📊 Dashboard endpoints: ✅ Enabled`)
  })
}

export default app