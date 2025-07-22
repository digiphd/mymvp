export * from './types'

// Utility functions
export const createApiResponse = <T>(data: T): { success: boolean; data: T; timestamp: Date } => ({
  success: true,
  data,
  timestamp: new Date()
})

export const createApiError = (error: string): { success: boolean; error: string; timestamp: Date } => ({
  success: false,
  error,
  timestamp: new Date()
})
