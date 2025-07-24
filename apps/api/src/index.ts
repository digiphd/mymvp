import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import Joi from 'joi'
import { createClient } from '@supabase/supabase-js'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

// Load environment variables
dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 3001

// Environment validation
const requiredEnvVars = [
  'API_SECRET_KEY',
  'LOOPS_API_KEY',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'CORS_ORIGIN'
]

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName])
if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '))
  process.exit(1)
}

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
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
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-api-key']
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute per IP
  message: {
    status: 'error',
    message: 'Too many requests. Please try again later.',
    retry_after: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api', limiter)

// Body parsing with size limit
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// API Key authentication middleware
const authenticateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key']
  
  if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or missing API key'
    })
  }
  
  next()
}

// Request validation schema
const applicationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 100 characters',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  company: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Company name must be at least 2 characters long',
    'string.max': 'Company name cannot exceed 100 characters',
    'any.required': 'Company name is required'
  }),
  prd_content: Joi.string().min(500).max(10000).required().messages({
    'string.min': 'PRD content must be at least 500 characters long',
    'string.max': 'PRD content cannot exceed 10,000 characters',
    'any.required': 'PRD content is required'
  }),
  budget_timeline: Joi.string().valid(
    'under_2k',
    '2k_1month',
    '5k_2weeks',
    '10k_flexible',
    'exploring'
  ).required().messages({
    'any.only': 'Please select a valid budget and timeline option',
    'any.required': 'Budget and timeline selection is required'
  }),
  project_readiness: Joi.string().valid(
    'ready_collaboration',
    'hands_off',
    'marketing_too'
  ).required().messages({
    'any.only': 'Please select a valid project readiness option',
    'any.required': 'Project readiness selection is required'
  }),
  technical_preferences: Joi.string().max(1000).optional().allow('').messages({
    'string.max': 'Technical preferences cannot exceed 1000 characters'
  })
})

// Qualification logic
interface ApplicationData {
  name: string
  email: string
  company: string
  prd_content: string
  budget_timeline: string
  project_readiness: string
  technical_preferences?: string
}

interface QualificationResult {
  qualification: 'highly_qualified' | 'qualified' | 'unqualified'
  next_action: 'calendar_booking' | 'manual_review' | 'rejection'
  message: string
  calendar_url?: string
}

function qualifyLead(formData: ApplicationData): QualificationResult {
  const { budget_timeline, project_readiness, prd_content } = formData
  
  // Unqualified criteria
  if (
    budget_timeline === 'under_2k' || 
    budget_timeline === 'exploring' ||
    project_readiness !== 'ready_collaboration' ||
    prd_content.length < 500
  ) {
    return {
      qualification: 'unqualified',
      next_action: 'rejection',
      message: 'Thanks for your interest. Based on your responses, we may not be the right fit at this time. We\'ll notify you if we expand our services to match your needs.'
    }
  }
  
  // Highly qualified criteria
  if (
    (budget_timeline === '5k_2weeks' || budget_timeline === '10k_flexible') &&
    project_readiness === 'ready_collaboration'
  ) {
    return {
      qualification: 'highly_qualified',
      next_action: 'calendar_booking',
      message: 'Perfect! You\'re exactly the type of founder we love working with. Book your discovery call below.',
      calendar_url: process.env.CALENDLY_URL || 'https://calendly.com/mymvp/discovery-call'
    }
  }
  
  // Default to qualified
  return {
    qualification: 'qualified',
    next_action: 'manual_review',
    message: 'Great application! We\'ll review your PRD and respond within 24 hours with next steps.'
  }
}

// Loops.so email service
async function sendLoopsEmail(templateId: string, email: string, variables: Record<string, any>) {
  try {
    const response = await axios.post(
      'https://app.loops.so/api/v1/transactional',
      {
        transactionalId: templateId,
        email: email,
        dataVariables: variables
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.LOOPS_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    console.log('✅ Email sent successfully:', { email, templateId, response: response.data })
    return { success: true, data: response.data }
  } catch (error: any) {
    console.error('❌ Failed to send email:', {
      email,
      templateId,
      error: error.response?.data || error.message
    })
    return { success: false, error: error.response?.data || error.message }
  }
}

// Database operations
async function saveApplication(applicationData: ApplicationData, qualification: QualificationResult) {
  try {
    const applicationRecord = {
      id: uuidv4(),
      name: applicationData.name,
      email: applicationData.email,
      company: applicationData.company,
      prd_content: applicationData.prd_content,
      budget_timeline: applicationData.budget_timeline,
      project_readiness: applicationData.project_readiness,
      technical_preferences: applicationData.technical_preferences || null,
      qualification_level: qualification.qualification,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('applications')
      .insert(applicationRecord)
      .select()

    if (error) {
      console.error('❌ Database save error:', error)
      return { success: false, error }
    }

    console.log('✅ Application saved to database:', data[0].id)
    return { success: true, data: data[0] }
  } catch (error: any) {
    console.error('❌ Database operation failed:', error)
    return { success: false, error: error.message }
  }
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  })
})

// Main application endpoint
app.post('/api/applications', authenticateApiKey, async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { error: validationError, value: validatedData } = applicationSchema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false
    })

    if (validationError) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: validationError.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      })
    }

    const applicationData: ApplicationData = validatedData
    
    // Run qualification logic
    const qualification = qualifyLead(applicationData)
    
    // Save to database (continue even if this fails)
    const dbResult = await saveApplication(applicationData, qualification)
    if (!dbResult.success) {
      console.error('Database save failed, but continuing with email flow')
    }

    // Send applicant confirmation email
    const applicantEmailVariables = {
      name: applicationData.name,
      company: applicationData.company,
      qualification_level: qualification.qualification,
      message: qualification.message,
      calendar_url: qualification.calendar_url || '',
      prd_length: applicationData.prd_content.length,
      budget_timeline: applicationData.budget_timeline
    }

    // Send internal notification email
    const adminEmailVariables = {
      name: applicationData.name,
      email: applicationData.email,
      company: applicationData.company,
      qualification_level: qualification.qualification,
      prd_content: applicationData.prd_content.substring(0, 2000) + (applicationData.prd_content.length > 2000 ? '...' : ''),
      budget_timeline: applicationData.budget_timeline,
      project_readiness: applicationData.project_readiness,
      technical_preferences: applicationData.technical_preferences || 'None specified',
      next_action: qualification.next_action,
      submitted_at: new Date().toLocaleString()
    }

    // Send emails (don't wait for completion, log errors but don't fail the request)
    const emailPromises = [
      sendLoopsEmail('application_confirmation', applicationData.email, applicantEmailVariables),
      sendLoopsEmail('new_application_admin', process.env.ADMIN_EMAIL || 'admin@mymvp.io', adminEmailVariables)
    ]

    // Execute email sending in background
    Promise.allSettled(emailPromises).then(results => {
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Email ${index} failed:`, result.reason)
        }
      })
    })

    // Return successful response
    res.status(200).json({
      status: 'success',
      qualification: qualification.qualification,
      message: qualification.message,
      next_action: qualification.next_action,
      ...(qualification.calendar_url && { calendar_url: qualification.calendar_url })
    })

    // Log successful application
    console.log('✅ Application processed successfully:', {
      name: applicationData.name,
      email: applicationData.email,
      company: applicationData.company,
      qualification: qualification.qualification,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ Application processing error:', error)
    
    res.status(500).json({
      status: 'error',
      message: 'Internal server error. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && { debug: error.message })
    })
  }
})

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
    console.log(`🚀 MyMVP API server running on port ${PORT}`)
    console.log(`📧 Loops.so integration: ${process.env.LOOPS_API_KEY ? '✅ Configured' : '❌ Missing API key'}`)
    console.log(`💾 Supabase integration: ${process.env.SUPABASE_URL ? '✅ Configured' : '❌ Missing URL'}`)
    console.log(`🔒 CORS origin: ${process.env.CORS_ORIGIN || 'https://mymvp.io'}`)
    console.log(`🛡️  Security: Rate limiting enabled (10 req/min)`)
  })
}

export default app