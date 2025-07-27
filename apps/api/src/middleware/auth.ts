import { Request, Response, NextFunction } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        role: 'customer' | 'developer' | 'admin'
        name: string
        currentOrganizationId?: string
      }
      organizationId?: string
      organizationRole?: 'customer' | 'developer' | 'admin'
    }
  }
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export interface JWTPayload {
  userId: string
  email: string
  role: 'customer' | 'developer' | 'admin'
  name: string
  currentOrganizationId?: string
  iat?: number
  exp?: number
}

// Generate JWT token
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d'
  })
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  
  return jwt.verify(token, process.env.JWT_SECRET) as JWTPayload
}

// Authentication middleware - verifies JWT token
export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access token required'
      })
    }

    const decoded = verifyToken(token)
    
    // Fetch user details from database to ensure user is still active
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, is_active')
      .eq('id', decoded.userId)
      .single()

    if (error || !user || !user.is_active) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token'
      })
    }

    // Get user's current organization if specified in token
    let currentOrganizationId = decoded.currentOrganizationId
    
    // If no current org in token, get from user preferences
    if (!currentOrganizationId) {
      const { data: preferences } = await supabase
        .from('user_organization_preferences')
        .select('current_organization_id')
        .eq('user_id', user.id)
        .single()
      
      currentOrganizationId = preferences?.current_organization_id
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      currentOrganizationId
    }

    next()
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token'
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired'
      })
    }

    console.error('Authentication error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Authentication failed'
    })
  }
}

// Role-based authorization middleware
export function requireRole(...allowedRoles: Array<'customer' | 'developer' | 'admin'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Insufficient permissions'
      })
    }

    next()
  }
}

// Project access middleware - checks if user has access to specific project
export async function requireProjectAccess(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      })
    }

    const projectId = req.params.projectId || req.params.id
    if (!projectId) {
      return res.status(400).json({
        status: 'error',
        message: 'Project ID required'
      })
    }

    // Admin has access to all projects
    if (req.user.role === 'admin') {
      return next()
    }

    // Check if user has access to this project
    const { data: project, error } = await supabase
      .from('projects')
      .select('id, customer_id, assigned_developer_id')
      .eq('id', projectId)
      .single()

    if (error || !project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      })
    }

    // Customer can access their own projects
    if (req.user.role === 'customer' && project.customer_id === req.user.id) {
      return next()
    }

    // Developer can access assigned projects
    if (req.user.role === 'developer' && project.assigned_developer_id === req.user.id) {
      return next()
    }

    return res.status(403).json({
      status: 'error',
      message: 'Access denied to this project'
    })

  } catch (error: any) {
    console.error('Project access check error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Access verification failed'
    })
  }
}

// Organization access middleware - ensures user has access to specified organization
export async function requireOrganizationAccess(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      })
    }

    const organizationId = req.params.organizationId || req.user.currentOrganizationId
    if (!organizationId) {
      return res.status(400).json({
        status: 'error',
        message: 'Organization ID required'
      })
    }

    // Check if user has access to this organization
    const { data: membership, error } = await supabase
      .from('organization_members')
      .select('role, is_active')
      .eq('organization_id', organizationId)
      .eq('user_id', req.user.id)
      .single()

    if (error || !membership || !membership.is_active) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied to this organization'
      })
    }

    // Add organization context to request
    req.organizationId = organizationId
    req.organizationRole = membership.role

    next()
  } catch (error: any) {
    console.error('Organization access check error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Organization access verification failed'
    })
  }
}

// Require specific role within an organization
export function requireOrganizationRole(...allowedRoles: Array<'customer' | 'developer' | 'admin'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.organizationRole) {
      return res.status(401).json({
        status: 'error',
        message: 'Organization context required'
      })
    }

    if (!allowedRoles.includes(req.organizationRole)) {
      return res.status(403).json({
        status: 'error',
        message: 'Insufficient permissions in this organization'
      })
    }

    next()
  }
}

// Validate API key for external services
export function validateApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key']
  
  if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or missing API key'
    })
  }
  
  next()
}