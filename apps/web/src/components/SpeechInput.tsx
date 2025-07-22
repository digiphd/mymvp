'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Volume2 } from 'lucide-react'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { motion, AnimatePresence } from 'framer-motion'

interface SpeechInputProps {
  onTranscript: (text: string) => void
  disabled?: boolean
  placeholder?: string
}

export function SpeechInput({ onTranscript, disabled = false, placeholder = "Click microphone to speak..." }: SpeechInputProps) {
  const [accumulatedText, setAccumulatedText] = useState('')
  
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error,
  } = useSpeechRecognition({
    onTranscript: (newText) => {
      const trimmedText = newText.trim()
      if (trimmedText) {
        setAccumulatedText(prev => {
          const combined = prev + (prev ? ' ' : '') + trimmedText
          onTranscript(combined)
          return combined
        })
      }
    },
    continuous: true,
    interimResults: true,
  })

  const handleToggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      resetTranscript()
      setAccumulatedText('')
      startListening()
    }
  }

  const handleClear = () => {
    stopListening()
    resetTranscript()
    setAccumulatedText('')
    onTranscript('')
  }

  if (!isSupported) {
    return (
      <div className="text-sm text-gray-500 text-center p-2">
        <Volume2 className="w-4 h-4 mx-auto mb-1 opacity-50" />
        Speech recognition not supported in this browser
      </div>
    )
  }

  const displayText = accumulatedText + (accumulatedText && interimTranscript ? ' ' : '') + interimTranscript
  const hasContent = accumulatedText || interimTranscript

  return (
    <div className="space-y-3">
      {/* Microphone Button */}
      <div className="flex items-center justify-center space-x-2">
        <Button
          type="button"
          variant={isListening ? "destructive" : "outline"}
          size="sm"
          onClick={handleToggleListening}
          disabled={disabled}
          className={`
            transition-all duration-200
            ${isListening 
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
              : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
            }
          `}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Start Speaking
            </>
          )}
        </Button>

        {hasContent && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Status Indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center justify-center space-x-2 text-sm text-blue-600"
          >
            <div className="flex space-x-1">
              <div className="w-1 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-1 h-4 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-4 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span>Listening...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcript Display */}
      <AnimatePresence>
        {hasContent && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-3"
          >
            <div className="text-sm text-gray-700">
              <span className="font-medium text-blue-700">Transcript:</span>
              <div className="mt-1">
                {accumulatedText && (
                  <span className="text-gray-900">{accumulatedText}</span>
                )}
                {interimTranscript && (
                  <span className="text-gray-500 italic">
                    {accumulatedText ? ' ' : ''}{interimTranscript}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3"
          >
            <div className="text-sm text-red-700">
              <span className="font-medium">Error:</span> {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Placeholder Text */}
      {!hasContent && !isListening && (
        <div className="text-center text-sm text-gray-400 italic">
          {placeholder}
        </div>
      )}
    </div>
  )
}
