'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MessageSquare, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function FloatingChatButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past hero section
      const scrollY = window.scrollY
      const showAfter = window.innerHeight * 0.5 // Show after scrolling halfway through viewport
      setIsVisible(scrollY > showAfter)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 100 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20 
          }}
          className="fixed bottom-6 right-6 z-50"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Button
            onClick={() => router.push('/chat')}
            className="h-14 px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full group"
            size="lg"
          >
            <MessageSquare className="w-5 h-5 mr-2 group-hover:animate-pulse" />
            <AnimatePresence mode="wait">
              {isHovered ? (
                <motion.span
                  key="expanded"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  Define Requirements
                </motion.span>
              ) : (
                <motion.span
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Chat
                </motion.span>
              )}
            </AnimatePresence>
          </Button>

          {/* Pulse animation for attention */}
          <div className="absolute inset-0 rounded-full bg-blue-600 opacity-20 animate-ping"></div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
