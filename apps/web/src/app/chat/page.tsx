'use client'

import { useChat } from '@ai-sdk/react'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  ArrowLeft, 
  Sparkles,
  CheckCircle,
  MessageSquare,
  Zap,
  Users,
  Target,
  DollarSign,
  Clock,
  Lightbulb,
  Building,
  Mic
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { SpeechInput } from '@/components/SpeechInput'

export default function ChatPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [showSpeechInput, setShowSpeechInput] = useState(false)

  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    isLoading,
    stop 
  } = useChat({
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

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus()
  }, [])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return
    
    if (!hasStarted) {
      setHasStarted(true)
    }
    
    handleSubmit(e)
    setIsTyping(true)
  }

  const handleQuickStart = (prompt: string) => {
    if (!hasStarted) {
      setHasStarted(true)
    }
    
    // Simulate typing the prompt
    const event = new Event('submit', { bubbles: true })
    const form = document.querySelector('form')
    
    // Set the input value and trigger submit
    const inputElement = inputRef.current
    if (inputElement && form) {
      inputElement.value = prompt
      handleInputChange({ target: { value: prompt } } as any)
      setTimeout(() => {
        form.dispatchEvent(event)
      }, 100)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Image 
                src="/logo.png" 
                alt="MyMVP Logo" 
                width={32} 
                height={32}
                className="w-8 h-8 rounded-lg"
              />
              <div>
                <h1 className="font-semibold text-gray-900">MVP Requirements Chat</h1>
                <p className="text-sm text-gray-500">Define your project with AI assistance</p>
              </div>
            </div>
          </div>
          
          {messages.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <MessageSquare className="h-4 w-4" />
              <span>{messages.length} messages</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {/* Welcome State */}
        {!hasStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-6">
              <Image 
                src="/logo.png" 
                alt="MyMVP Logo" 
                width={64} 
                height={64}
                className="w-16 h-16 rounded-xl shadow-lg"
              />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Define Your MVP Requirements
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              I'm your AI requirements specialist. Through our conversation, I'll help you transform your idea into 
              a detailed, actionable MVP specification that developers can build from day one.
              <span className="block mt-2 text-blue-600 font-medium">
                💬 Type or speak your requirements - I support voice input!
              </span>
            </p>

            {/* Process Overview */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Conversation</h3>
                <p className="text-sm text-gray-600">10-15 minutes of focused questions about your vision</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
                <p className="text-sm text-gray-600">Structured specification with features, scope, and timeline</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Proposal</h3>
                <p className="text-sm text-gray-600">Custom development proposal ready to review</p>
              </div>
            </div>

            {/* Quick Start Options */}
            <div className="max-w-4xl mx-auto mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Choose your starting point:</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card 
                  className="p-5 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-300 group bg-white"
                  onClick={() => handleQuickStart("I have a new SaaS idea that I want to validate and build as an MVP. Can you help me define the core features and scope?")}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Lightbulb className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="bg-blue-600 text-white px-3 py-1 rounded-md mb-2">
                        <h3 className="font-semibold text-sm">New SaaS Idea</h3>
                      </div>
                      <p className="text-sm text-gray-500">Start with a software concept</p>
                    </div>
                  </div>
                </Card>

                <Card 
                  className="p-5 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-green-300 group bg-white"
                  onClick={() => handleQuickStart("I run an existing business and want to build a mobile app to better serve my customers. What should I consider for the MVP?")}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Building className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="bg-green-600 text-white px-3 py-1 rounded-md mb-2">
                        <h3 className="font-semibold text-sm">Existing Business</h3>
                      </div>
                      <p className="text-sm text-gray-500">Add digital capabilities</p>
                    </div>
                  </div>
                </Card>

                <Card 
                  className="p-5 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-purple-300 group bg-white"
                  onClick={() => handleQuickStart("I want to create a marketplace platform connecting buyers and sellers. How do I approach this as an MVP?")}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="bg-purple-600 text-white px-3 py-1 rounded-md mb-2">
                        <h3 className="font-semibold text-sm">Marketplace</h3>
                      </div>
                      <p className="text-sm text-gray-500">Two-sided platform</p>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <Card 
                  className="p-5 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-amber-300 group bg-white"
                  onClick={() => handleQuickStart("I need to modernize a legacy system or process with a new web application. Where should I start with the MVP?")}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="text-left">
                      <div className="bg-amber-600 text-white px-3 py-1 rounded-md mb-2 inline-block">
                        <h3 className="font-semibold text-sm">Legacy Modernization</h3>
                      </div>
                      <p className="text-sm text-gray-500">Update existing processes</p>
                    </div>
                  </div>
                </Card>

                <Card 
                  className="p-5 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-emerald-300 group bg-white"
                  onClick={() => handleQuickStart("I have a specific problem I want to solve with technology, but I'm not sure about the best approach for an MVP.")}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                      <Target className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <div className="bg-emerald-600 text-white px-3 py-1 rounded-md mb-2 inline-block">
                        <h3 className="font-semibold text-sm">Problem-First</h3>
                      </div>
                      <p className="text-sm text-gray-500">Start with the challenge</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 max-w-3xl mx-auto">
              <h4 className="font-semibold text-blue-900 mb-2">💡 What makes this different?</h4>
              <p className="text-blue-800 text-sm leading-relaxed">
                Unlike traditional requirement gathering, I use AI to dig deeper, ask the right follow-up questions, 
                and help you think through edge cases you might miss. The result is a specification that's actually buildable.
              </p>
            </div>

            <p className="text-sm text-gray-500 mt-8">
              Ready to start? Choose an option above or type your own message below.
            </p>
          </motion.div>
        )}

        {/* Messages */}
        {hasStarted && (
          <div className="space-y-6 pb-6">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'flex gap-4',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
                
                <div
                  className={cn(
                    'max-w-3xl rounded-2xl px-4 py-3',
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border shadow-sm'
                  )}
                >
                  {message.parts?.map((part, i) => {
                    switch (part.type) {
                      case 'text':
                        return (
                          <div key={`${message.id}-${i}`} className="prose prose-sm max-w-none">
                            {part.text.split('\n').map((line, lineIndex) => (
                              <p key={lineIndex} className={cn(
                                lineIndex > 0 && 'mt-2',
                                message.role === 'user' ? 'text-white' : 'text-gray-800'
                              )}>
                                {line}
                              </p>
                            ))}
                          </div>
                        )
                      case 'tool-invocation':
                        return (
                          <div key={`${message.id}-${i}`} className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center space-x-2 text-blue-800 font-medium text-sm">
                              <CheckCircle className="h-4 w-4" />
                              <span>Requirements Collected</span>
                            </div>
                            <p className="text-blue-600 text-sm mt-1">
                              Great! I've structured your requirements. Ready to generate your custom proposal?
                            </p>
                          </div>
                        )
                      default:
                        return null
                    }
                  })}
                </div>

                {message.role === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 justify-start"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="bg-white border shadow-sm rounded-2xl px-4 py-3 flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-sm text-gray-500">AI is thinking...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Speech Input Toggle */}
          <div className="flex justify-center mb-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowSpeechInput(!showSpeechInput)}
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Mic className="w-4 h-4 mr-2" />
              {showSpeechInput ? 'Hide' : 'Use'} Voice Input
            </Button>
          </div>

          {/* Speech Input Component */}
          {showSpeechInput && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
              <SpeechInput
                onTranscript={(text) => {
                  handleInputChange({ target: { value: text } } as any)
                }}
                disabled={isLoading}
                placeholder="Click microphone and speak your requirements..."
              />
            </div>
          )}

          <form onSubmit={onSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                placeholder={hasStarted ? "Continue the conversation..." : "Describe your product idea or ask a question..."}
                className="pr-12 py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                disabled={isLoading}
              />
              {isLoading && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={stop}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                >
                  <div className="w-4 h-4 border-2 border-gray-400 rounded-sm" />
                </Button>
              )}
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !input.trim()}
              className="px-6 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Send
                </>
              )}
            </Button>
          </form>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            This AI assistant will help you define clear MVP requirements and provide a custom proposal
            {showSpeechInput && (
              <span className="block mt-1 text-blue-600">
                💡 Voice input works best in Chrome, Safari, and Edge browsers
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
