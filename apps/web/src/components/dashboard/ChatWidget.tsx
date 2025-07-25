'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  Zap,
  Heart,
  Rocket,
  Coffee,
  Code
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ChatMessage {
  id: string
  sender: 'customer' | 'developer' | 'system'
  content: string
  timestamp: string
  type?: 'message' | 'milestone' | 'celebration'
}

interface ChatWidgetProps {
  projectId?: string
  developer?: {
    name: string
    avatar: string
  }
}

const demoMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'developer',
    content: "Hey! 👋 Just wanted to let you know I've started working on your analytics dashboard. The authentication system is looking great!",
    timestamp: '2 hours ago',
    type: 'message'
  },
  {
    id: '2',
    sender: 'system',
    content: "🎉 Milestone reached: User Authentication Complete!",
    timestamp: '1 hour ago',
    type: 'celebration'
  },
  {
    id: '3',
    sender: 'customer',
    content: "This is amazing! The login flow is exactly what I envisioned. Quick question - can we add Google OAuth too?",
    timestamp: '45 minutes ago',
    type: 'message'
  },
  {
    id: '4',
    sender: 'developer',
    content: "Absolutely! Google OAuth is actually already on my roadmap for today. Should have it ready in a couple hours 🚀",
    timestamp: '30 minutes ago',
    type: 'message'
  }
]

export default function ChatWidget({ projectId, developer = { name: "Alex Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" } }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(demoMessages)
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: 'customer',
        content: newMessage,
        timestamp: 'Just now',
        type: 'message'
      }
      
      setMessages(prev => [...prev, message])
      setNewMessage('')
      
      // Simulate developer typing response
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const responses = [
          "Got it! Working on that now 💪",
          "Great suggestion! I'll implement that right away ⚡",
          "Perfect timing - I was just about to ask about that! 🎯",
          "Love the feedback! This will make the app even better 🌟"
        ]
        const response: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'developer',
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: 'Just now',
          type: 'message'
        }
        setMessages(prev => [...prev, response])
      }, 2000)
    }
  }

  const getMessageIcon = (message: ChatMessage) => {
    if (message.type === 'celebration') return <Sparkles className="h-4 w-4 text-yellow-400" />
    if (message.sender === 'developer') return <Code className="h-4 w-4 text-blue-500" />
    return null
  }

  const getMessageStyle = (message: ChatMessage) => {
    if (message.type === 'celebration') {
      return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
    }
    if (message.sender === 'developer') {
      return "bg-blue-500 text-white"
    }
    return "bg-white dark:bg-gray-700 border"
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
          size="sm"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <MessageCircle className="h-6 w-6" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)]"
          >
            <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg pb-3">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-white">
                      <AvatarImage src={developer.avatar} alt={developer.name} />
                      <AvatarFallback>{developer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{developer.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">
                        Your Developer
                      </Badge>
                      <div className="flex items-center space-x-1 text-xs text-blue-100">
                        <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Online</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-3">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.sender === 'customer' ? 'order-2' : 'order-1'}`}>
                        <div className={`rounded-2xl px-4 py-2 ${getMessageStyle(message)}`}>
                          <div className="flex items-start space-x-2">
                            {getMessageIcon(message)}
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                        <div className={`text-xs text-muted-foreground mt-1 ${
                          message.sender === 'customer' ? 'text-right' : 'text-left'
                        }`}>
                          {message.timestamp}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-200 dark:bg-gray-600 rounded-2xl px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t bg-gray-50 dark:bg-gray-700/50 rounded-b-lg">
                  <div className="flex space-x-2">
                    <Textarea
                      placeholder="Ask about your project..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 min-h-[2.5rem] max-h-20 resize-none"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex space-x-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-6 px-2"
                      onClick={() => setNewMessage("How's the progress looking?")}
                    >
                      <Rocket className="h-3 w-3 mr-1" />
                      Progress?
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-6 px-2"
                      onClick={() => setNewMessage("The work looks amazing! 🎉")}
                    >
                      <Heart className="h-3 w-3 mr-1" />
                      Praise
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-6 px-2"
                      onClick={() => setNewMessage("Can we schedule a quick call?")}
                    >
                      <Coffee className="h-3 w-3 mr-1" />
                      Call?
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}