import { z } from 'zod'

// User types
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type User = z.infer<typeof UserSchema>

// Chat types
export const ChatMessageSchema = z.object({
  id: z.string(),
  userId: z.string().optional(), // Optional for anonymous chats
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.date(),
  metadata: z.record(z.string(), z.any()).optional()
})

export type ChatMessage = z.infer<typeof ChatMessageSchema>

export const ChatSessionSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  messages: z.array(ChatMessageSchema),
  status: z.enum(['active', 'completed', 'abandoned']),
  requirements: z.record(z.string(), z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type ChatSession = z.infer<typeof ChatSessionSchema>

// Project requirements types
export const ProjectRequirementsSchema = z.object({
  productDescription: z.string(),
  targetAudience: z.string(),
  technicalRequirements: z.string().optional(),
  budget: z.string(),
  timeline: z.string(),
  additionalNotes: z.string().optional()
})

export type ProjectRequirements = z.infer<typeof ProjectRequirementsSchema>

// API Response types
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  timestamp: z.date()
})

export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  timestamp: Date
}
