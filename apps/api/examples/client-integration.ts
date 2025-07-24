// MyMVP API Client Integration Example
// This shows how to integrate the API with your frontend application

interface ApplicationFormData {
  name: string
  email: string
  company: string
  prd_content: string
  budget_timeline: 'under_2k' | '2k_1month' | '5k_2weeks' | '10k_flexible' | 'exploring'
  project_readiness: 'ready_collaboration' | 'hands_off' | 'marketing_too'
  technical_preferences?: string
}

interface ApiResponse {
  status: 'success' | 'error'
  qualification?: 'highly_qualified' | 'qualified' | 'unqualified'
  message: string
  next_action?: 'calendar_booking' | 'manual_review' | 'rejection'
  calendar_url?: string
  errors?: Array<{
    field: string
    message: string
  }>
}

class MyMVPApiClient {
  private baseUrl: string
  private apiKey: string

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  async submitApplication(data: ApplicationFormData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        },
        body: JSON.stringify(data)
      })

      const result: ApiResponse = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Application submission failed')
      }

      return result
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`)
      return await response.json()
    } catch (error) {
      console.error('Health check failed:', error)
      throw error
    }
  }
}

// Usage Example in React Component
export const useMyMVPApi = () => {
  const apiClient = new MyMVPApiClient(
    process.env.NEXT_PUBLIC_API_URL || 'https://api.mymvp.io',
    process.env.NEXT_PUBLIC_API_KEY || ''
  )

  const submitApplication = async (formData: ApplicationFormData) => {
    try {
      const result = await apiClient.submitApplication(formData)
      
      // Handle different qualification levels
      switch (result.qualification) {
        case 'highly_qualified':
          // Show calendar booking widget
          if (result.calendar_url) {
            window.open(result.calendar_url, '_blank')
          }
          break
          
        case 'qualified':
          // Show manual review message
          console.log('Application under review')
          break
          
        case 'unqualified':
          // Show polite rejection
          console.log('Application not qualified')
          break
      }
      
      return result
    } catch (error) {
      console.error('Application submission failed:', error)
      throw error
    }
  }

  return { submitApplication }
}

// Example form validation (before sending to API)
export const validateApplicationForm = (data: Partial<ApplicationFormData>): string[] => {
  const errors: string[] = []

  if (!data.name || data.name.length < 2) {
    errors.push('Name must be at least 2 characters long')
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Please provide a valid email address')
  }

  if (!data.company || data.company.length < 2) {
    errors.push('Company name must be at least 2 characters long')
  }

  if (!data.prd_content || data.prd_content.length < 500) {
    errors.push('PRD content must be at least 500 characters long')
  }

  if (!data.budget_timeline) {
    errors.push('Please select a budget and timeline')
  }

  if (!data.project_readiness) {
    errors.push('Please indicate your project readiness')
  }

  return errors
}

// Example usage in Next.js API route (if you need a proxy)
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const apiClient = new MyMVPApiClient(
      process.env.MYMVP_API_URL!,
      process.env.MYMVP_API_KEY!
    )

    const result = await apiClient.submitApplication(req.body)
    res.status(200).json(result)
  } catch (error: any) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message || 'Internal server error' 
    })
  }
}

// Environment variables needed in frontend
/*
Add to your .env.local:

NEXT_PUBLIC_API_URL=https://api.mymvp.io
NEXT_PUBLIC_API_KEY=your-frontend-api-key

For server-side API routes:
MYMVP_API_URL=https://api.mymvp.io
MYMVP_API_KEY=your-server-api-key
*/