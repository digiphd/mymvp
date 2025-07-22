'use client'

import { useChat } from '@ai-sdk/react'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Send, Bot, User, Loader2, X, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatWidgetProps {
  isOpen: boolean
  onToggle: () => void
  onSignUpSuggested?: () => void
}

export default function ChatWidget({ isOpen, onToggle, onSignUpSuggested }: ChatWidgetProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    maxSteps: 5,
    onFinish: () => {
      setIsTyping(false)
    }
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isLoading) {
      setIsTyping(true)
    }
  }, [isLoading])

  // Send initial message when chat opens for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add initial bot message
      const welcomeMessage = {
        id: 'welcome',
        role: 'assistant' as const,
        content: "Hi! I'm here to help you define your MVP requirements. What's your product idea? 🚀"
      }
      // This will be handled by the actual chat hook in a real implementation
      // For now, we'll let the first user message trigger the conversation
    }
  }, [isOpen, messages.length])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return
    
    handleSubmit(e)
    setIsTyping(true)
  }

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={onToggle}
            size="lg"
            className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </motion.div>
      )}

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]"
          >
            <Card className="w-full h-full flex flex-col shadow-2xl border-0 bg-white">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold">MyMVP Assistant</h3>
                    <p className="text-xs text-blue-100">Define your requirements</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="text-white hover:bg-blue-800 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-gray-500 py-8"
                  >
                    <Bot className="h-12 w-12 mx-auto mb-3 text-blue-600" />
                    <p className="text-sm">
                      👋 Hi! I'm here to help you define your MVP requirements.
                      <br />
                      What's your product idea?
                    </p>
                  </motion.div>
                )}

                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      'flex gap-3',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                    
                    <div
                      className={cn(
                        'max-w-[75%] rounded-lg px-3 py-2 text-sm',
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border shadow-sm'
                      )}
                    >
                      {message.parts?.map((part, i) => {
                        switch (part.type) {
                          case 'text':
                            return (
                              <div key={`${message.id}-${i}`} className="whitespace-pre-wrap">
                                {part.text}
                              </div>
                            )
                          case 'tool-invocation':
                            return (
                              <div key={`${message.id}-${i}`} className="mt-2 p-2 bg-blue-50 rounded text-xs">
                                <div className="font-medium text-blue-800">Requirements Collected</div>
                                <div className="text-blue-600">Ready for your custom proposal!</div>
                              </div>
                            )
                          default:
                            return null
                        }
                      })}
                    </div>

                    {message.role === 'user' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="bg-white border shadow-sm rounded-lg px-3 py-2 flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-white">
                <form onSubmit={onSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Describe your product idea..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isLoading || !input.trim()}
                    className="px-3"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
