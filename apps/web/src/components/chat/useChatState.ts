'use client'

import { useState, useCallback } from 'react'

export interface ChatSession {
  id: string
  messages: any[]
  requirements?: any
  isAnonymous: boolean
  createdAt: Date
}

export function useChatState() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)

  const openChat = useCallback(() => {
    setIsOpen(true)
    
    // Create new session if none exists
    if (!currentSession) {
      setCurrentSession({
        id: crypto.randomUUID(),
        messages: [],
        isAnonymous: true,
        createdAt: new Date()
      })
    }
  }, [currentSession])

  const closeChat = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggleChat = useCallback(() => {
    if (isOpen) {
      closeChat()
    } else {
      openChat()
    }
  }, [isOpen, closeChat, openChat])

  const updateSession = useCallback((updates: Partial<ChatSession>) => {
    setCurrentSession(prev => prev ? { ...prev, ...updates } : null)
  }, [])

  return {
    isOpen,
    currentSession,
    openChat,
    closeChat,
    toggleChat,
    updateSession
  }
}
