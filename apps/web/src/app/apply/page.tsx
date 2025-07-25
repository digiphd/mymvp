'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Copy, 
  CheckCircle, 
  Zap, 
  ArrowRight,
  ArrowLeft, 
  FileText, 
  Clock,
  AlertCircle,
  ExternalLink,
  Calendar
} from 'lucide-react'

// PRD Generation Prompt
const PRD_PROMPT = `You are an expert product manager who has shipped 100+ successful SaaS MVPs. I need you to create a comprehensive Product Requirements Document (PRD) for my web application that can be built in 14 days by a skilled AI development team.

My Business Concept: [REPLACE WITH YOUR 2-3 SENTENCE BUSINESS DESCRIPTION]

TECHNICAL SPECIFICATIONS (DO NOT CHANGE):
• Frontend: Next.js/Vite.js + Tailwind CSS + shadcn/ui components
• Payments: Stripe integration
• Analytics: PostHog
• Standard features included: Authentication, login/logout, password reset, payment gateway, user management

CRITICAL CONSTRAINTS:
• Maximum 2 unique features (beyond standard auth/payment features)
• Must be buildable in 14 days by AI development team
• Simple subscription model: Free → Premium → Pro (or consumption-based)
• Focus on solving ONE specific problem exceptionally well

BEFORE WRITING THE PRD, ask me these 2 questions:

1. Who is your primary target customer and what specific problem does this solve for them?
2. What are the 2 most essential features that would make someone pay for this solution?

After I answer, use your expertise to:
• Research similar successful products for competitive pricing insights
• Identify secondary customer segments based on the problem/solution
• Determine optimal application entities and data structure
• Recommend appropriate pricing strategy (subscription vs usage-based)
• Analyze market positioning and feature differentiation

Then generate a comprehensive PRD with these exact sections:

## 1. EXECUTIVE SUMMARY
- Product Vision & Mission
- Target Market Analysis
- Competitive Landscape Overview
- Business Model Recommendation

## 2. CUSTOMER PERSONAS & MARKET ANALYSIS
- Primary Customer Avatar (detailed)
- Secondary Customer Segments
- Market Size & Opportunity
- User Journey Mapping

## 3. PRODUCT SPECIFICATIONS
- Core Value Proposition
- Feature Prioritization Matrix
- User Stories & Acceptance Criteria
- MVP Feature Set (limited to 2 unique features)

## 4. TECHNICAL ARCHITECTURE
- Data Model & Entities
- Integration Requirements
- Performance & Growth Requirements
- Security & Compliance Requirements

## 5. MONETIZATION STRATEGY
- Pricing Model Recommendation
- Competitive Pricing Analysis
- Revenue Projections
- Pricing Tiers & Feature Allocation

## 6. GO-TO-MARKET STRATEGY
- Launch Strategy
- Marketing Channels
- Customer Acquisition Plan
- Success Metrics & KPIs

## 7. FIRST 10 USERS STRATEGY
- Identify your network of people who know, like, and trust you
- Target users willing to provide feedback despite bugs/imperfections
- PostHog analytics setup for tracking user behavior and iterations
- Quick feedback loops for rapid problem-solving improvements

## 8. DEVELOPMENT ROADMAP
- 14-Day Build Timeline
- Feature Delivery Schedule
- Risk Assessment
- Post-Launch Iteration Plan

IMPORTANT:
• Use your knowledge to fill gaps and make informed recommendations
• Research competitors to suggest realistic pricing and positioning
• Base all recommendations on proven SaaS success patterns
• Make this developer-ready with specific, actionable requirements
• Focus on the frontend user patterns. The backend will be defined from this by the development team, including the API pathways, endpoints, and database schema.

Now ask me the 2 key questions, then write the complete PRD with your expert recommendations.`

interface FormData {
  // Contact Information
  name: string
  email: string
  productName: string
  
  // PRD Output
  prdOutput: string
  
  // Budget and Timeline
  budget: string
  
  // Project Readiness
  readiness: string
  
  // Technical Preferences
  technicalPrefs: string
  customRequirements: string
  
  // Marketing Strategy
  first10Users: string
  first100Users: string
  marketingChannels: string
  marketingBudget: string
  marketingExperience: string
  
  // Project Type
  projectType: string
}

interface QualificationResult {
  status: 'highly_qualified' | 'qualified' | 'unqualified'
  message: string
  showCalendar?: boolean
}

export default function ApplicationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  
  // Helper functions to change step and scroll to top
  const goToStep = (step: number) => {
    setCurrentStep(step)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const nextStep = () => {
    setCurrentStep(prev => prev + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const prevStep = () => {
    setCurrentStep(prev => prev - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    productName: '',
    prdOutput: '',
    budget: '',
    readiness: '',
    technicalPrefs: '',
    customRequirements: '',
    first10Users: '',
    first100Users: '',
    marketingChannels: '',
    marketingBudget: '',
    marketingExperience: '',
    projectType: 'full-mvp'
  })
  const [copySuccess, setCopySuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [qualificationResult, setQualificationResult] = useState<QualificationResult | null>(null)

  // Auto-save form data to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('mvp-application-form')
    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('mvp-application-form', JSON.stringify(formData))
  }, [formData])

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(PRD_PROMPT)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const validatePRD = (prd: string) => {
    return prd.length >= 500
  }

  const qualifyApplicant = (): QualificationResult => {
    const budgetScore = formData.budget === '$10K+, flexible timeline' ? 3 :
                       formData.budget === '$5-10K, need it within 2 weeks' ? 3 :
                       formData.budget === '$2-5K, need it within 1 month' ? 2 : 1

    const hasUnderstanding = formData.readiness.includes('understanding')
    const hasFeedbackReadiness = formData.readiness.includes('feedback')
    const readinessScore = hasUnderstanding && hasFeedbackReadiness ? 3 : hasUnderstanding ? 2 : 1
    const prdScore = validatePRD(formData.prdOutput) ? 2 : 1

    // Marketing readiness scoring
    const hasFirst10Plan = formData.first10Users.trim().length > 10
    const hasFirst100Plan = formData.first100Users.trim().length > 10
    const hasMarketingChannels = formData.marketingChannels.split(',').filter(v => v !== '').length >= 2
    const isMarketingReady = formData.marketingExperience === 'experienced' || formData.marketingExperience === 'some-experience'
    
    const marketingScore = (hasFirst10Plan ? 1 : 0) + (hasFirst100Plan ? 1 : 0) + (hasMarketingChannels ? 1 : 0) + (isMarketingReady ? 1 : 0)

    const totalScore = budgetScore + readinessScore + prdScore + marketingScore


    if (totalScore >= 9 && budgetScore >= 3 && marketingScore >= 3) {
      return {
        status: 'highly_qualified',
        message: "Perfect! You're exactly the type of founder we love working with. Book your discovery call below.",
        showCalendar: true
      }
    } else if (totalScore >= 7 && budgetScore >= 2 && marketingScore >= 2) {
      return {
        status: 'qualified',
        message: "Great application! We'll review your details and respond within 24 hours with next steps."
      }
    } else {
      return {
        status: 'unqualified',
        message: "Thanks for your interest. Based on your responses, we may not be the right fit at this time. We'll notify you if we expand our services to match your needs."
      }
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Qualify the applicant
    const result = qualifyApplicant()
    setQualificationResult(result)

    try {
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          qualification: result.status,
          submittedAt: new Date().toISOString()
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit application')
      }

      // Clear form data from localStorage on success
      localStorage.removeItem('mvp-application-form')
      
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Failed to submit application. Please try again or contact support.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStep1Valid = () => {
    return true // Step 1 is just instructions, always valid
  }

  const isStep2Valid = () => {
    return formData.name.trim() !== '' && 
           formData.email.trim() !== '' && 
           formData.productName.trim() !== '' &&
           formData.prdOutput.trim().length >= 500 &&
           formData.projectType !== ''
  }

  const isStep3Valid = () => {
    const hasUnderstanding = formData.readiness.includes('understanding')
    const hasCollaboration = formData.readiness.includes('feedback') || formData.readiness.includes('marketing')
    
    return formData.budget !== '' &&
           hasUnderstanding &&
           hasCollaboration
  }

  const isStep4Valid = () => {
    return formData.first10Users.trim() !== '' &&
           formData.first100Users.trim() !== '' &&
           formData.marketingChannels !== '' &&
           formData.marketingExperience !== ''
  }

  if (qualificationResult) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 pt-24">
          <div className="container mx-auto px-6 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Card className="p-8 bg-white border border-gray-200 shadow-lg">
                <div className="mb-6">
                  {qualificationResult.status === 'highly_qualified' && (
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  )}
                  {qualificationResult.status === 'qualified' && (
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                  )}
                  {qualificationResult.status === 'unqualified' && (
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                </div>

                <h2 className="text-3xl font-bold mb-4 text-gray-900">
                  {qualificationResult.status === 'highly_qualified' && 'Congratulations!'}
                  {qualificationResult.status === 'qualified' && 'Application Received'}
                  {qualificationResult.status === 'unqualified' && 'Thank You'}
                </h2>

                <p className="text-lg text-gray-600 mb-8">
                  {qualificationResult.message}
                </p>

                {qualificationResult.showCalendar && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-green-800 mb-4">
                      Book Your Discovery Call
                    </h3>
                    <p className="text-green-700 mb-6">
                      Let's discuss your project and how we can bring your vision to life in 14 days.
                    </p>
                    {/* Calendly Embed Placeholder */}
                    <div className="bg-white border-2 border-dashed border-green-300 rounded-lg p-8 text-center">
                      <Calendar className="w-12 h-12 text-green-600 mx-auto mb-4" />
                      <p className="text-green-600 font-semibold mb-2">Calendly Integration</p>
                      <p className="text-sm text-gray-600">Discovery call booking widget will be embedded here</p>
                      <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white">
                        Book Discovery Call
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {qualificationResult.status === 'unqualified' && (
                  <div className="space-y-6">
                    {/* Application Review Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-blue-800 mb-4">
                        Review Your Application
                      </h3>
                      <p className="text-blue-700 text-sm mb-4">
                        See which areas might need improvement to better match our requirements.
                      </p>
                      
                      {/* Simple Feedback Indicators */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between bg-white rounded-lg p-3 border">
                          <span className="text-gray-700 font-medium">Budget & Timeline</span>
                          <span className={`text-sm font-semibold ${
                            (() => {
                              const budgetScore = formData.budget === '$10K+, flexible timeline' ? 3 :
                                                 formData.budget === '$5-10K, need it within 2 weeks' ? 3 :
                                                 formData.budget === '$2-5K, need it within 1 month' ? 2 : 1;
                              return budgetScore >= 3 ? 'text-green-600' : budgetScore >= 2 ? 'text-orange-600' : 'text-red-600';
                            })()
                          }`}>
                            {(() => {
                              const budgetScore = formData.budget === '$10K+, flexible timeline' ? 3 :
                                                 formData.budget === '$5-10K, need it within 2 weeks' ? 3 :
                                                 formData.budget === '$2-5K, need it within 1 month' ? 2 : 1;
                              return budgetScore >= 3 ? 'Looks good' : budgetScore >= 2 ? 'Needs some work' : 'Needs improvement';
                            })()}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between bg-white rounded-lg p-3 border">
                          <span className="text-gray-700 font-medium">Project Readiness</span>
                          <span className={`text-sm font-semibold ${
                            (() => {
                              const hasUnderstanding = formData.readiness.includes('understanding');
                              const hasFeedbackReadiness = formData.readiness.includes('feedback');
                              const readinessScore = hasUnderstanding && hasFeedbackReadiness ? 3 : hasUnderstanding ? 2 : 1;
                              return readinessScore >= 3 ? 'text-green-600' : readinessScore >= 2 ? 'text-orange-600' : 'text-red-600';
                            })()
                          }`}>
                            {(() => {
                              const hasUnderstanding = formData.readiness.includes('understanding');
                              const hasFeedbackReadiness = formData.readiness.includes('feedback');
                              const readinessScore = hasUnderstanding && hasFeedbackReadiness ? 3 : hasUnderstanding ? 2 : 1;
                              return readinessScore >= 3 ? 'Looks good' : readinessScore >= 2 ? 'Needs some work' : 'Needs improvement';
                            })()}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between bg-white rounded-lg p-3 border">
                          <span className="text-gray-700 font-medium">PRD Content</span>
                          <span className={`text-sm font-semibold ${
                            formData.prdOutput.length >= 500 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formData.prdOutput.length >= 500 ? 'Looks good' : 'Needs improvement'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between bg-white rounded-lg p-3 border">
                          <span className="text-gray-700 font-medium">Marketing Strategy</span>
                          <span className={`text-sm font-semibold ${
                            (() => {
                              const hasFirst10Plan = formData.first10Users.trim().length > 10;
                              const hasFirst100Plan = formData.first100Users.trim().length > 10;
                              const hasMarketingChannels = formData.marketingChannels.split(',').filter(v => v !== '').length >= 2;
                              const isMarketingReady = formData.marketingExperience === 'experienced' || formData.marketingExperience === 'some-experience';
                              const marketingScore = (hasFirst10Plan ? 1 : 0) + (hasFirst100Plan ? 1 : 0) + (hasMarketingChannels ? 1 : 0) + (isMarketingReady ? 1 : 0);
                              return marketingScore >= 3 ? 'text-green-600' : marketingScore >= 2 ? 'text-orange-600' : 'text-red-600';
                            })()
                          }`}>
                            {(() => {
                              const hasFirst10Plan = formData.first10Users.trim().length > 10;
                              const hasFirst100Plan = formData.first100Users.trim().length > 10;
                              const hasMarketingChannels = formData.marketingChannels.split(',').filter(v => v !== '').length >= 2;
                              const isMarketingReady = formData.marketingExperience === 'experienced' || formData.marketingExperience === 'some-experience';
                              const marketingScore = (hasFirst10Plan ? 1 : 0) + (hasFirst100Plan ? 1 : 0) + (hasMarketingChannels ? 1 : 0) + (isMarketingReady ? 1 : 0);
                              return marketingScore >= 3 ? 'Looks good' : marketingScore >= 2 ? 'Needs some work' : 'Needs improvement';
                            })()}
                          </span>
                        </div>
                      </div>
                      
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                        onClick={() => {
                          setQualificationResult(null);
                          goToStep(1);
                        }}
                      >
                        Review Your Application
                      </Button>
                    </div>
                    
                    {/* Stay Connected Section */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Stay Connected
                      </h3>
                      <p className="text-gray-700 text-sm mb-4">
                        We'll keep you updated on new services and opportunities that might be a better fit.
                      </p>
                      <Button 
                        variant="outline" 
                        className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        onClick={() => window.location.href = '/'}
                      >
                        Return to Homepage
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 pt-24">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-blue-600 mr-3" />
              <span className="font-semibold">my<span className="text-blue-600">MVP</span> Application</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Apply to Work With my<span className="text-blue-600">MVP</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Let's see if we're a good fit to bring your vision to life
            </p>
            
            {/* Total Time Indicator */}
            <div className="flex items-center justify-center mt-4">
              <Clock className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-gray-600 text-sm">Total time: 9-12 minutes</span>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-4 px-4">
              <div className="flex items-center max-w-sm sm:max-w-none">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${
                    currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {currentStep > 1 ? <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" /> : '1'}
                </div>
                <div className={`w-6 sm:w-12 h-1 mx-1 sm:mx-2 ${currentStep > 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${
                    currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {currentStep > 2 ? <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" /> : '2'}
                </div>
                <div className={`w-6 sm:w-12 h-1 mx-1 sm:mx-2 ${currentStep > 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${
                    currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {currentStep > 3 ? <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" /> : '3'}
                </div>
                <div className={`w-6 sm:w-12 h-1 mx-1 sm:mx-2 ${currentStep > 3 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${
                    currentStep >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  4
                </div>
              </div>
            </div>
            <div className="text-center px-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                <span className="block sm:inline">Step {currentStep} of 4:</span>{' '}
                <span className="block sm:inline">
                  {currentStep === 1 ? 'Create Your PRD with AI' :
                   currentStep === 2 ? (
                     <>
                       Contact & PRD - my<span className="text-blue-600">MVP</span>
                     </>
                   ) :
                   currentStep === 3 ? 'Project Budget & Readiness' :
                   'Marketing Strategy & User Acquisition'
                  }
                </span>
                <span className="text-sm font-normal text-gray-500 block sm:inline sm:ml-2">
                  ({
                    currentStep === 1 ? '5-7 min' :
                    currentStep === 2 ? '1-2 min' :
                    currentStep === 3 ? '1-2 min' :
                    '2-3 min'
                  })
                </span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-2">
                {currentStep === 1 ? 'Use our AI-powered prompt to generate comprehensive requirements' :
                 currentStep === 2 ? 'Share your details and paste your completed PRD' :
                 currentStep === 3 ? 'Tell us about your budget and project readiness' :
                 'Help us understand your marketing approach and user acquisition plan'
                }
              </p>
            </div>
          </div>

          {/* Form Steps */}
          <Card className="p-4 sm:p-8 bg-white border border-gray-200 shadow-lg">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Step 1: Create Your{' '}
                      <span 
                        className="relative group cursor-help border-b border-dotted border-gray-400"
                        title="Product Requirements Document - A detailed blueprint that outlines exactly what your product should do, who it's for, and how it should work"
                      >
                        PRD
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                          Product Requirements Document
                        </div>
                      </span>
                      {' '}with AI
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Copy this prompt, add your business idea, and work with ChatGPT to create detailed requirements 
                      that will help us build what you need out of the gate.
                    </p>
                  </div>

                  {/* Prompt Display Box */}
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">AI PRD Generation Prompt</h4>
                      <Button
                        onClick={copyToClipboard}
                        className="bg-blue-600 hover:bg-blue-700 text-white border-0"
                      >
                        {copySuccess ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Prompt
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="bg-white border border-gray-300 rounded p-4 max-h-64 overflow-y-auto">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                        {PRD_PROMPT}
                      </pre>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-800 mb-4">
                      <FileText className="w-5 h-5 inline mr-2" />
                      How to Complete Your PRD
                    </h4>
                    <ol className="space-y-3 text-blue-700">
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">1</span>
                        Copy the prompt above
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">2</span>
                        Open ChatGPT (or Claude)
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">3</span>
                        <div>
                          Paste the prompt and replace the placeholder text
                          <div className="text-xs text-blue-600 mt-1 font-mono bg-blue-100 px-2 py-1 rounded">
                            [REPLACE WITH YOUR 2-3 SENTENCE BUSINESS DESCRIPTION]
                          </div>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">4</span>
                        Answer the AI's questions thoroughly
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">5</span>
                        Copy the complete PRD output
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">6</span>
                        Paste it in Step 2
                      </li>
                    </ol>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-8"
                >
                  {/* Header Section */}
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">
                      Contact Details & PRD
                    </h3>
                    <p className="text-lg text-gray-600 mb-8">
                      Share your contact information and paste your completed PRD.
                    </p>
                    
                    {/* Privacy Notice */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-lg p-6 mx-auto max-w-2xl">
                      <div className="flex items-center justify-center mb-3">
                        <span className="text-2xl mr-3">🔒</span>
                        <h4 className="text-blue-900 font-bold text-lg">Your Information is Safe & Confidential</h4>
                      </div>
                      <p className="text-blue-800 leading-relaxed">
                        We're builders, not idea thieves. Your concepts are completely confidential - we're here to help you succeed, 
                        not compete with you. Protected under our{' '}
                        <a href="/privacy" className="underline font-semibold hover:text-blue-900">Privacy Policy</a>.
                      </p>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-lg">1</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">Contact Information</h4>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => updateFormData('name', e.target.value)}
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-gray-900 bg-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-gray-900 bg-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="productName" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Product Name *
                        </Label>
                        <Input
                          id="productName"
                          placeholder="Your product name"
                          value={formData.productName}
                          onChange={(e) => updateFormData('productName', e.target.value)}
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-gray-900 bg-white"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* PRD Section */}
                  <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-lg">2</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">Product Requirements Document</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <Label htmlFor="prdOutput" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Paste your complete PRD from ChatGPT/Claude *
                      </Label>
                      
                      <div className="relative">
                        <Textarea
                          id="prdOutput"
                          placeholder="Paste the complete PRD output from ChatGPT here..."
                          value={formData.prdOutput}
                          onChange={(e) => updateFormData('prdOutput', e.target.value)}
                          className="min-h-[240px] text-gray-900 bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg resize-none font-mono text-sm leading-relaxed"
                          required
                        />
                        {formData.prdOutput && (
                          <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded border text-xs text-gray-500">
                            {formData.prdOutput.length} chars
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          Minimum 500 characters required
                        </span>
                        {formData.prdOutput.length >= 500 && validatePRD(formData.prdOutput) && (
                          <span className="text-green-600 font-semibold flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            PRD looks complete
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Project Type Selection */}
                  <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-lg">3</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">What Are You Looking For?</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Choose your project type *
                      </Label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="cursor-pointer">
                          <div className={`border-2 rounded-xl p-4 sm:p-6 transition-all ${
                            formData.projectType === 'proof-of-concept' 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className="flex items-start space-x-3">
                              <input
                                type="radio"
                                name="projectType"
                                value="proof-of-concept"
                                checked={formData.projectType === 'proof-of-concept'}
                                onChange={(e) => updateFormData('projectType', e.target.value)}
                                className="mt-1 w-4 h-4 text-blue-600"
                              />
                              <div className="flex-1">
                                <div className="font-bold text-lg text-gray-900 mb-2">Proof of Concept</div>
                                <div className="text-sm text-gray-600 mb-3">
                                  Working frontend code - no design mockups, just functional interfaces
                                </div>
                                <div className="text-sm text-gray-500">
                                  • 7-day delivery<br/>
                                  • Frontend only with mock data<br/>
                                  • Demo-ready for investor meetings<br/>
                                  • No backend - perfect for pitching
                                </div>
                              </div>
                            </div>
                          </div>
                        </label>
                        
                        <label className="cursor-pointer">
                          <div className={`border-2 rounded-xl p-4 sm:p-6 transition-all ${
                            formData.projectType === 'full-mvp' 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className="flex items-start space-x-3">
                              <input
                                type="radio"
                                name="projectType"
                                value="full-mvp"
                                checked={formData.projectType === 'full-mvp'}
                                onChange={(e) => updateFormData('projectType', e.target.value)}
                                className="mt-1 w-4 h-4 text-green-600"
                              />
                              <div className="flex-1">
                                <div className="font-bold text-lg text-gray-900 mb-2">Full MVP</div>
                                <div className="text-sm text-gray-600 mb-3">
                                  Working application ready for real users
                                </div>
                                <div className="text-sm text-gray-500">
                                  • 14-day delivery<br/>
                                  • Auth + Payments + Up to 3 core features<br/>
                                  • Production deployment & hosting<br/>
                                  • 30 days of iterations included
                                </div>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-8"
                >
                  {/* Header Section */}
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">
                      Project Budget & Readiness
                    </h3>
                    <p className="text-lg text-gray-600 mb-8">
                      Help us understand your budget and project expectations.
                    </p>
                  </div>

                  {/* Budget Selection */}
                  <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-lg">1</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">Budget and Timeline</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        What's your budget for a Full MVP? *
                      </Label>
                      <p className="text-sm text-gray-600 mb-2">
                        This helps us understand your investment appetite. If you selected Proof of Concept above, you can always upgrade later.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { value: 'under-2k', label: 'Under $2K', desc: 'Exploring options', color: 'gray' },
                          { value: '$2-5K, need it within 1 month', label: '$2-5K', desc: 'Within 1 month', color: 'orange' },
                          { value: '$5-10K, need it within 2 weeks', label: '$5-10K', desc: 'Within 2 weeks', color: 'blue' },
                          { value: '$10K+, flexible timeline', label: '$10K+', desc: 'Flexible timeline', color: 'green' },
                        ].map((option) => (
                          <label key={option.value} className="cursor-pointer">
                            <div className={`border-2 rounded-lg p-4 transition-all ${
                              formData.budget === option.value 
                                ? `border-${option.color}-500 bg-${option.color}-50` 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}>
                              <div className="flex items-center space-x-3">
                                <input
                                  type="radio"
                                  name="budget"
                                  value={option.value}
                                  checked={formData.budget === option.value}
                                  onChange={(e) => updateFormData('budget', e.target.value)}
                                  className="w-4 h-4"
                                />
                                <div>
                                  <div className="font-semibold text-gray-900">{option.label}</div>
                                  <div className="text-sm text-gray-500">{option.desc}</div>
                                </div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Project Readiness Assessment */}
                  <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-lg">2</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">Project Readiness Assessment</h4>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Understanding Checkbox */}
                      <div className="space-y-4">
                        <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Success Mindset *
                        </Label>
                        
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                          <label className="flex items-start space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.readiness.includes('understanding')}
                              onChange={(e) => {
                                const currentReadiness = formData.readiness.split(',').filter(v => v !== 'understanding')
                                if (e.target.checked) {
                                  currentReadiness.push('understanding')
                                }
                                updateFormData('readiness', currentReadiness.join(','))
                              }}
                              className="mt-1 w-5 h-5 text-blue-600"
                            />
                            <span className="text-blue-800 leading-relaxed font-medium">
                              <strong>I understand that building is only 10% of success</strong> - the other 90% is marketing, user acquisition, and rapid iteration.
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Collaboration Style */}
                      <div className="space-y-4">
                        <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Collaboration Style *
                        </Label>
                        
                        <div className="space-y-3">
                          <label className="cursor-pointer">
                            <div className={`border-2 rounded-lg p-4 transition-all ${
                              formData.readiness.includes('feedback') 
                                ? 'border-green-500 bg-green-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}>
                              <div className="flex items-start space-x-3">
                                <input
                                  type="radio"
                                  name="collaboration"
                                  value="feedback"
                                  checked={formData.readiness.includes('feedback')}
                                  onChange={(e) => {
                                    const readinessArray = formData.readiness.split(',').filter(v => v !== 'feedback' && v !== 'marketing')
                                    if (e.target.checked) {
                                      readinessArray.push('feedback')
                                    }
                                    updateFormData('readiness', readinessArray.join(','))
                                  }}
                                  className="mt-1 w-4 h-4"
                                />
                                <span className="text-gray-800 font-medium">
                                  I'm committed to responsive feedback and quick communication
                                </span>
                              </div>
                            </div>
                          </label>
                          
                          <label className="cursor-pointer">
                            <div className={`border-2 rounded-lg p-4 transition-all ${
                              formData.readiness.includes('marketing') 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}>
                              <div className="flex items-start space-x-3">
                                <input
                                  type="radio"
                                  name="collaboration"
                                  value="marketing"
                                  checked={formData.readiness.includes('marketing')}
                                  onChange={(e) => {
                                    const readinessArray = formData.readiness.split(',').filter(v => v !== 'feedback' && v !== 'marketing')
                                    if (e.target.checked) {
                                      readinessArray.push('marketing')
                                    }
                                    updateFormData('readiness', readinessArray.join(','))
                                  }}
                                  className="mt-1 w-4 h-4"
                                />
                                <span className="text-gray-800 font-medium">
                                  I prefer not to be contacted during development
                                </span>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Technical Preferences */}
                  <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-lg">3</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">Technical Requirements</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Any specific technical requirements? (Optional)
                      </Label>
                      
                      <div className="relative">
                        <select
                          id="technicalPrefs"
                          className="w-full h-12 pl-4 pr-10 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500 appearance-none cursor-pointer"
                          value={formData.technicalPrefs}
                          onChange={(e) => updateFormData('technicalPrefs', e.target.value)}
                        >
                          <option value="">Select any specific requirements</option>
                          <option value="recommended-stack">No specific requirements - use your recommended stack ✅</option>
                          <option value="single-integration">Single third-party integration (CRM like HubSpot, marketing tool, etc.)</option>
                          <option value="custom-auth">Custom authentication/login requirements (beyond standard email/password)</option>
                          <option value="existing-systems">Must integrate with existing systems (internal tools, databases, etc.)</option>
                          <option value="other">Other specific requirements (describe below)</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      
                      {formData.technicalPrefs === 'other' && (
                        <Textarea
                          placeholder="Please describe any specific integrations, compliance requirements, or technical needs..."
                          value={formData.customRequirements}
                          onChange={(e) => updateFormData('customRequirements', e.target.value)}
                          className="mt-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-8"
                >
                  {/* Header Section */}
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">
                      Marketing Strategy & User Acquisition
                    </h3>
                    <p className="text-lg text-gray-600 mb-8">
                      Help us understand your marketing approach and readiness to acquire users.
                    </p>
                  </div>

                  {/* First 10 Users Strategy */}
                  <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-lg">1</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">Your First 10 Users</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <Label htmlFor="first10Users" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        How will you get your first 10 users? *
                      </Label>
                      <Input
                        id="first10Users"
                        placeholder="e.g., Reach out to people in my network, post in relevant communities, cold outreach..."
                        value={formData.first10Users}
                        onChange={(e) => updateFormData('first10Users', e.target.value)}
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-gray-900 bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* First 100 Users Strategy */}
                  <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-lg">2</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">Scaling to 100 Users</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <Label htmlFor="first100Users" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        How will you scale from 10 to 100 users? *
                      </Label>
                      <Input
                        id="first100Users"
                        placeholder="e.g., Content marketing, paid ads, referral program, partnerships, SEO strategy..."
                        value={formData.first100Users}
                        onChange={(e) => updateFormData('first100Users', e.target.value)}
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-gray-900 bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Marketing Channels */}
                  <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-lg">3</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">Marketing Channels</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Which marketing channels do you plan to focus on? *
                      </Label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { value: 'social-media', label: 'Social Media (Twitter, LinkedIn, etc.)' },
                          { value: 'content-marketing', label: 'Content Marketing (Blog, YouTube)' },
                          { value: 'paid-ads', label: 'Paid Advertising (Google, Facebook)' },
                          { value: 'email-marketing', label: 'Email Marketing' },
                          { value: 'partnerships', label: 'Partnerships & Collaborations' },
                          { value: 'seo', label: 'SEO & Organic Search' },
                          { value: 'community', label: 'Community Building' },
                          { value: 'referrals', label: 'Referral Program' },
                        ].map((option) => (
                          <label key={option.value} className="cursor-pointer">
                            <div className={`border-2 rounded-lg p-3 transition-all ${
                              formData.marketingChannels.includes(option.value)
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}>
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  value={option.value}
                                  checked={formData.marketingChannels.includes(option.value)}
                                  onChange={(e) => {
                                    const currentChannels = formData.marketingChannels.split(',').filter(v => v !== '')
                                    if (e.target.checked) {
                                      currentChannels.push(option.value)
                                    } else {
                                      const index = currentChannels.indexOf(option.value)
                                      if (index > -1) currentChannels.splice(index, 1)
                                    }
                                    updateFormData('marketingChannels', currentChannels.join(','))
                                  }}
                                  className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-gray-800 font-medium">{option.label}</span>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Marketing Experience */}
                  <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-lg">4</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">Marketing Experience</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        What's your marketing experience level? *
                      </Label>
                      
                      <div className="space-y-3">
                        {[
                          { value: 'experienced', label: 'Experienced', desc: 'I have successfully marketed products/services before' },
                          { value: 'some-experience', label: 'Some Experience', desc: 'I have basic marketing knowledge and have tried some tactics' },
                          { value: 'beginner', label: 'Beginner', desc: 'I am new to marketing but willing to learn and execute' },
                          { value: 'need-help', label: 'Need Guidance', desc: 'I need significant help developing a marketing strategy' },
                        ].map((option) => (
                          <label key={option.value} className="cursor-pointer">
                            <div className={`border-2 rounded-lg p-4 transition-all ${
                              formData.marketingExperience === option.value 
                                ? 'border-green-500 bg-green-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}>
                              <div className="flex items-start space-x-3">
                                <input
                                  type="radio"
                                  name="marketingExperience"
                                  value={option.value}
                                  checked={formData.marketingExperience === option.value}
                                  onChange={(e) => updateFormData('marketingExperience', e.target.value)}
                                  className="mt-1 w-4 h-4"
                                />
                                <div>
                                  <div className="font-semibold text-gray-900">{option.label}</div>
                                  <div className="text-sm text-gray-600">{option.desc}</div>
                                </div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
              {/* Back Button */}
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="bg-white border-blue-600 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              
              {/* Forward/Submit Button */}
              <div className={currentStep === 1 ? "w-full flex justify-end" : "w-full sm:w-auto sm:ml-auto"}>
                {currentStep === 1 && (
                  <Button
                    onClick={() => goToStep(2)}
                    disabled={!isStep1Valid()}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                  >
                    <span className="hidden sm:inline">Continue to Contact & PRD</span>
                    <span className="sm:hidden">Continue</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}

                {currentStep === 2 && (
                  <Button
                    onClick={() => goToStep(3)}
                    disabled={!isStep2Valid()}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                  >
                    <span className="hidden sm:inline">Continue to Budget & Readiness</span>
                    <span className="sm:hidden">Continue</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}

                {currentStep === 3 && (
                  <Button
                    onClick={() => goToStep(4)}
                    disabled={!isStep3Valid()}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                  >
                    <span className="hidden sm:inline">Continue to Marketing Strategy</span>
                    <span className="sm:hidden">Continue</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}

                {currentStep === 4 && (
                  <Button
                    onClick={handleSubmit}
                    disabled={!isStep4Valid() || isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  )
}