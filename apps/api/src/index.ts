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

// Request validation schema - Updated to match current form structure
const applicationSchema = Joi.object({
  // Contact Information
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 100 characters',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  productName: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Product name must be at least 2 characters long',
    'string.max': 'Product name cannot exceed 100 characters',
    'any.required': 'Product name is required'
  }),
  
  // PRD Output
  prdOutput: Joi.string().min(500).max(10000).required().messages({
    'string.min': 'PRD content must be at least 500 characters long',
    'string.max': 'PRD content cannot exceed 10,000 characters',
    'any.required': 'PRD content is required'
  }),
  
  // Project Type
  projectType: Joi.string().valid('proof-of-concept', 'full-mvp').required().messages({
    'any.only': 'Please select either proof-of-concept or full-mvp',
    'any.required': 'Project type selection is required'
  }),
  
  // Budget and Timeline
  budget: Joi.string().valid(
    'Under $2K, exploring options',
    '$2-5K, need it within 1 month',
    '$5-10K, need it within 2 weeks',
    '$10K+, flexible timeline'
  ).required().messages({
    'any.only': 'Please select a valid budget option',
    'any.required': 'Budget selection is required'
  }),
  
  // Project Readiness (array of selected options)
  readiness: Joi.string().required().messages({
    'any.required': 'Project readiness selection is required'
  }),
  
  // Technical Preferences
  technicalPrefs: Joi.string().max(1000).optional().allow('').messages({
    'string.max': 'Technical preferences cannot exceed 1000 characters'
  }),
  customRequirements: Joi.string().max(1000).optional().allow('').messages({
    'string.max': 'Custom requirements cannot exceed 1000 characters'
  }),
  
  // Marketing Strategy
  first10Users: Joi.string().max(1000).optional().allow('').messages({
    'string.max': 'First 10 users plan cannot exceed 1000 characters'
  }),
  first100Users: Joi.string().max(1000).optional().allow('').messages({
    'string.max': 'First 100 users plan cannot exceed 1000 characters'
  }),
  marketingChannels: Joi.string().max(1000).optional().allow('').messages({
    'string.max': 'Marketing channels cannot exceed 1000 characters'
  }),
  marketingBudget: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Marketing budget cannot exceed 500 characters'
  }),
  marketingExperience: Joi.string().valid(
    'no-experience',
    'some-experience', 
    'experienced'
  ).optional().allow('').messages({
    'any.only': 'Please select a valid marketing experience level'
  })
})

// Qualification logic - Updated to match current form structure
interface ApplicationData {
  // Contact Information
  name: string
  email: string
  productName: string
  
  // PRD Output
  prdOutput: string
  
  // Project Type
  projectType: string
  
  // Budget and Timeline
  budget: string
  
  // Project Readiness
  readiness: string
  
  // Technical Preferences
  technicalPrefs?: string
  customRequirements?: string
  
  // Marketing Strategy
  first10Users?: string
  first100Users?: string
  marketingChannels?: string
  marketingBudget?: string
  marketingExperience?: string
}

interface QualificationResult {
  qualification: 'highly_qualified' | 'qualified' | 'unqualified'
  next_action: 'calendar_booking' | 'manual_review' | 'rejection'
  message: string
  calendar_url?: string
}

function qualifyLead(formData: ApplicationData): QualificationResult {
  // Use the same qualification logic as the frontend
  const budgetScore = formData.budget === '$10K+, flexible timeline' ? 3 :
                     formData.budget === '$5-10K, need it within 2 weeks' ? 3 :
                     formData.budget === '$2-5K, need it within 1 month' ? 2 : 1
  
  const hasUnderstanding = formData.readiness.includes('understanding')
  const hasFeedbackReadiness = formData.readiness.includes('feedback')
  const readinessScore = hasUnderstanding && hasFeedbackReadiness ? 3 : hasUnderstanding ? 2 : 1
  
  const prdScore = formData.prdOutput.length >= 500 ? 2 : 1
  
  // Marketing readiness scoring
  const hasFirst10Plan = (formData.first10Users?.trim().length || 0) > 10
  const hasFirst100Plan = (formData.first100Users?.trim().length || 0) > 10
  const hasMarketingChannels = (formData.marketingChannels?.split(',').filter(v => v !== '').length || 0) >= 2
  const isMarketingReady = formData.marketingExperience === 'experienced' || formData.marketingExperience === 'some-experience'
  
  const marketingScore = (hasFirst10Plan ? 1 : 0) + (hasFirst100Plan ? 1 : 0) + (hasMarketingChannels ? 1 : 0) + (isMarketingReady ? 1 : 0)
  const totalScore = budgetScore + readinessScore + prdScore + marketingScore
  
  // Debug logging
  console.log('=== API QUALIFICATION DEBUG ===')
  console.log('Budget:', formData.budget, '→ Score:', budgetScore)
  console.log('Readiness:', formData.readiness, '→ hasUnderstanding:', hasUnderstanding, 'hasFeedback:', hasFeedbackReadiness, '→ Score:', readinessScore)
  console.log('PRD length:', formData.prdOutput.length, '→ Score:', prdScore)
  console.log('Marketing Score:', marketingScore)
  console.log('TOTAL SCORE:', totalScore, '/ Requirements: ≥9 (highly), ≥7 (qualified)')
  
  if (totalScore >= 9 && budgetScore >= 3 && marketingScore >= 3) {
    console.log('→ HIGHLY QUALIFIED')
    return {
      qualification: 'highly_qualified',
      next_action: 'calendar_booking',
      message: "Perfect! You're exactly the type of founder we love working with. Book your discovery call below.",
      calendar_url: process.env.CALENDLY_URL || 'https://calendly.com/mymvp/discovery-call'
    }
  } else if (totalScore >= 7 && budgetScore >= 2 && marketingScore >= 2) {
    console.log('→ QUALIFIED')
    return {
      qualification: 'qualified',
      next_action: 'manual_review',
      message: "Great application! We'll review your details and respond within 24 hours with next steps."
    }
  } else {
    console.log('→ UNQUALIFIED')
    return {
      qualification: 'unqualified',
      next_action: 'rejection',
      message: "Thanks for your interest. Based on your responses, we may not be the right fit at this time. We'll notify you if we expand our services to match your needs."
    }
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
      product_name: applicationData.productName,
      prd_output: applicationData.prdOutput,
      project_type: applicationData.projectType,
      budget: applicationData.budget,
      readiness: applicationData.readiness,
      technical_prefs: applicationData.technicalPrefs || null,
      custom_requirements: applicationData.customRequirements || null,
      first_10_users: applicationData.first10Users || null,
      first_100_users: applicationData.first100Users || null,
      marketing_channels: applicationData.marketingChannels || null,
      marketing_budget: applicationData.marketingBudget || null,
      marketing_experience: applicationData.marketingExperience || null,
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
      product_name: applicationData.productName,
      project_type: applicationData.projectType,
      qualification_level: qualification.qualification,
      message: qualification.message,
      calendar_url: qualification.calendar_url || '',
      prd_length: applicationData.prdOutput.length,
      budget: applicationData.budget
    }

    // Send internal notification email
    const adminEmailVariables = {
      name: applicationData.name,
      email: applicationData.email,
      product_name: applicationData.productName,
      project_type: applicationData.projectType,
      qualification_level: qualification.qualification,
      prd_output: applicationData.prdOutput.substring(0, 2000) + (applicationData.prdOutput.length > 2000 ? '...' : ''),
      budget: applicationData.budget,
      readiness: applicationData.readiness,
      technical_prefs: applicationData.technicalPrefs || 'None specified',
      custom_requirements: applicationData.customRequirements || 'None specified',
      first_10_users: applicationData.first10Users || 'Not provided',
      first_100_users: applicationData.first100Users || 'Not provided',
      marketing_channels: applicationData.marketingChannels || 'Not provided',
      marketing_experience: applicationData.marketingExperience || 'Not specified',
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
      product_name: applicationData.productName,
      project_type: applicationData.projectType,
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