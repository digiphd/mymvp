import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { streamText, tool } from 'ai'
import { z } from 'zod'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Choose model based on environment variable
const getModel = () => {
  const provider = process.env.AI_PROVIDER || 'openai'
  
  if (provider === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
    return anthropic('claude-3-5-sonnet-20241022')
  }
  
  return openai('gpt-4o-mini') // Default to OpenAI
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = streamText({
      model: getModel(),
      messages,
      system: `You are an AI assistant for MyMVP.io, a premium AI-powered MVP development service. 

Your goal is to collect project requirements from potential clients through natural conversation. You should:

1. **Be conversational and engaging** - Don't feel like a form
2. **Ask follow-up questions** to understand their vision better
3. **Collect key information**:
   - Product/idea description
   - Target audience
   - Key features they envision
   - Budget range ($5K-$15K for POC, $15K-$50K for full MVP)
   - Timeline expectations
   - Technical requirements or preferences

4. **Show expertise** by:
   - Asking smart technical questions
   - Suggesting improvements or alternatives
   - Highlighting potential challenges early

5. **Build confidence** by referencing MyMVP.io's approach:
   - AI-native development from day one
   - Focus on 3 core features (Auth + Payments + Unique Value)
   - 85% faster to market
   - Real user feedback over endless planning

6. **Qualify the lead** - Are they ready to take action or just exploring?

Keep responses concise but helpful. When you have enough information, suggest they sign up to get a custom proposal.`,
      tools: {
        collectRequirements: tool({
          description: 'Collect and structure project requirements from the conversation',
          parameters: z.object({
            productDescription: z.string().describe('Clear description of their product/idea'),
            targetAudience: z.string().describe('Who will use this product'),
            keyFeatures: z.array(z.string()).describe('Main features they want'),
            budgetRange: z.enum(['under-5k', '5k-15k', '15k-50k', 'over-50k']).describe('Budget range'),
            timeline: z.string().describe('When they want to launch'),
            technicalRequirements: z.string().optional().describe('Any specific technical needs'),
            readinessScore: z.number().min(1).max(10).describe('How ready are they to proceed (1-10)')
          }),
          execute: async (requirements) => {
            // This would normally save to database
            console.log('Requirements collected:', requirements)
            return { success: true, message: 'Requirements collected successfully' }
          }
        })
      },
      maxSteps: 5
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
