'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ArrowRight, CheckCircle, Zap } from 'lucide-react'

interface FormData {
  // Step 1: Technical Vision
  productDescription: string
  technicalRequirements: string
  aiFeatures: string
  
  // Step 2: Growth Readiness
  currentAudience: string
  marketingStrategy: string
  customerAcquisition: string
  
  // Step 3: Partnership Fit
  previousLaunches: string
  teamComposition: string
  budget: string
  timeline: string
  
  // Step 4: Contact & Agreement
  name: string
  email: string
  company: string
  agreeToTerms: boolean
}

const steps = [
  { id: 1, title: 'Technical Vision', subtitle: 'AI product requirements and complexity' },
  { id: 2, title: 'Growth Readiness', subtitle: 'Marketing and distribution strategies' },
  { id: 3, title: 'Partnership Fit', subtitle: 'Budget allocation and timeline' },
  { id: 4, title: 'Partnership Agreement', subtitle: 'Contact details and collaboration' }
]

export default function ApplicationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    productDescription: '',
    technicalRequirements: '',
    aiFeatures: '',
    currentAudience: '',
    marketingStrategy: '',
    customerAcquisition: '',
    previousLaunches: '',
    teamComposition: '',
    budget: '',
    timeline: '',
    name: '',
    email: '',
    company: '',
    agreeToTerms: false
  })

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        alert('Application submitted successfully! Check your email for confirmation. We\'ll be in touch within 24 hours.')
        // Optionally redirect to a success page
        window.location.href = '/'
      } else {
        alert('Failed to submit application. Please try again or contact support.')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Failed to submit application. Please try again or contact support.')
    }
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
            <span className="text-blue-600 font-semibold">myMVP Application</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Transform Your Vision
          </h1>
          <p className="text-gray-600 text-lg">
            Premium partnership qualification for AI-powered MVP development
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center ${step.id !== 4 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    step.id
                  )}
                </div>
                {step.id !== 4 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Step {currentStep}: {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600">{steps[currentStep - 1].subtitle}</p>
          </div>
        </div>

        {/* Form Steps */}
        <Card className="p-8 bg-white border border-gray-200 shadow-lg">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div>
                  <Label htmlFor="productDescription" className="text-gray-900 text-lg font-semibold">
                    Product Description
                  </Label>
                  <Textarea
                    id="productDescription"
                    placeholder="Describe your AI product vision, target market, and core value proposition..."
                    value={formData.productDescription}
                    onChange={(e) => updateFormData('productDescription', e.target.value)}
                    className="mt-2 min-h-[120px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="technicalRequirements" className="text-gray-900 text-lg font-semibold">
                    Technical Requirements
                  </Label>
                  <Textarea
                    id="technicalRequirements"
                    placeholder="What technical architecture, integrations, and scalability requirements do you have?"
                    value={formData.technicalRequirements}
                    onChange={(e) => updateFormData('technicalRequirements', e.target.value)}
                    className="mt-2 min-h-[120px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="aiFeatures" className="text-gray-900 text-lg font-semibold">
                    AI/ML Features
                  </Label>
                  <Textarea
                    id="aiFeatures"
                    placeholder="What AI/ML capabilities do you need? (NLP, computer vision, recommendations, etc.)"
                    value={formData.aiFeatures}
                    onChange={(e) => updateFormData('aiFeatures', e.target.value)}
                    className="mt-2 min-h-[120px]"
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div>
                  <Label htmlFor="currentAudience" className="text-gray-900 text-lg font-semibold">
                    Current Audience Size
                  </Label>
                  <Input
                    id="currentAudience"
                    placeholder="e.g., 10K email subscribers, 50K social media followers"
                    value={formData.currentAudience}
                    onChange={(e) => updateFormData('currentAudience', e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="marketingStrategy" className="text-gray-900 text-lg font-semibold">
                    Marketing & Distribution Strategy
                  </Label>
                  <Textarea
                    id="marketingStrategy"
                    placeholder="How do you plan to acquire and retain customers? What channels will you use?"
                    value={formData.marketingStrategy}
                    onChange={(e) => updateFormData('marketingStrategy', e.target.value)}
                    className="mt-2 min-h-[120px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="customerAcquisition" className="text-gray-900 text-lg font-semibold">
                    Customer Acquisition Experience
                  </Label>
                  <Textarea
                    id="customerAcquisition"
                    placeholder="What's your experience with customer acquisition, growth metrics, and product launches?"
                    value={formData.customerAcquisition}
                    onChange={(e) => updateFormData('customerAcquisition', e.target.value)}
                    className="mt-2 min-h-[120px]"
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div>
                  <Label htmlFor="previousLaunches" className="text-gray-900 text-lg font-semibold">
                    Previous Product Launches
                  </Label>
                  <Textarea
                    id="previousLaunches"
                    placeholder="Tell us about your previous product launches, what you learned, and the results..."
                    value={formData.previousLaunches}
                    onChange={(e) => updateFormData('previousLaunches', e.target.value)}
                    className="mt-2 min-h-[120px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="teamComposition" className="text-gray-900 text-lg font-semibold">
                    Team Composition
                  </Label>
                  <Textarea
                    id="teamComposition"
                    placeholder="Who's on your team? What are their roles and capabilities?"
                    value={formData.teamComposition}
                    onChange={(e) => updateFormData('teamComposition', e.target.value)}
                    className="mt-2 min-h-[120px]"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="budget" className="text-gray-900 text-lg font-semibold">
                      Budget Range
                    </Label>
                    <select
                      className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-md text-gray-900"
                      value={formData.budget}
                      onChange={(e) => updateFormData('budget', e.target.value)}
                    >
                      <option value="">Select budget range</option>
                      <option value="50k-100k">$50K - $100K</option>
                      <option value="100k-250k">$100K - $250K</option>
                      <option value="250k-500k">$250K - $500K</option>
                      <option value="500k+">$500K+</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="timeline" className="text-gray-900 text-lg font-semibold">
                      Timeline Urgency
                    </Label>
                    <select
                      className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-md text-gray-900"
                      value={formData.timeline}
                      onChange={(e) => updateFormData('timeline', e.target.value)}
                    >
                      <option value="">Select timeline</option>
                      <option value="immediate">Immediate (start now)</option>
                      <option value="1-month">Within 1 month</option>
                      <option value="3-months">Within 3 months</option>
                      <option value="flexible">Flexible timeline</option>
                    </select>
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
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-900 text-lg font-semibold">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-gray-900 text-lg font-semibold">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="company" className="text-gray-900 text-lg font-semibold">
                    Company/Organization
                  </Label>
                  <Input
                    id="company"
                    placeholder="Your company name"
                    value={formData.company}
                    onChange={(e) => updateFormData('company', e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">Partnership Agreement</h3>
                  <div className="space-y-3 text-gray-600">
                    <p>• myMVP handles all technical execution and development</p>
                    <p>• Founder remains responsible for growth, marketing, and customer acquisition</p>
                    <p>• Success metrics and milestones will be clearly defined</p>
                    <p>• Regular communication and collaboration throughout the process</p>
                  </div>
                  
                  <div className="flex items-start space-x-3 mt-6">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={(e) => updateFormData('agreeToTerms', e.target.checked)}
                      className="mt-1"
                    />
                    <Label htmlFor="agreeToTerms" className="text-gray-900">
                      I agree to the partnership terms and understand my responsibilities for growth and marketing
                    </Label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!formData.agreeToTerms}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Submit Application
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
        </div>
      </div>
      <Footer />
    </>
  )
}