'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface UseSpeechRecognitionProps {
  onTranscript?: (transcript: string) => void
  onError?: (error: string) => void
  continuous?: boolean
  interimResults?: boolean
}

interface SpeechRecognitionHook {
  isListening: boolean
  transcript: string
  interimTranscript: string
  isSupported: boolean
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
  error: string | null
}

export function useSpeechRecognition({
  onTranscript,
  onError,
  continuous = true,
  interimResults = true,
}: UseSpeechRecognitionProps = {}): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }

    setIsSupported(true)
    
    const recognition = new SpeechRecognition()
    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interimTranscript += result[0].transcript
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript)
        onTranscript?.(finalTranscript)
        setInterimTranscript('')
      } else {
        setInterimTranscript(interimTranscript)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errorMessage = `Speech recognition error: ${event.error}`
      setError(errorMessage)
      onError?.(errorMessage)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimTranscript('')
      
      // Auto-restart if we were listening and there's no error
      if (continuous && !error && isListening) {
        // Small delay to prevent rapid restarts
        timeoutRef.current = setTimeout(() => {
          if (recognitionRef.current && !error) {
            try {
              recognitionRef.current.start()
            } catch (e) {
              // Recognition might already be running
            }
          }
        }, 100)
      }
    }

    recognitionRef.current = recognition

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [continuous, interimResults, onTranscript, onError, error, isListening])

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported) return

    try {
      setError(null)
      recognitionRef.current.start()
    } catch (e) {
      const errorMessage = 'Failed to start speech recognition'
      setError(errorMessage)
      onError?.(errorMessage)
    }
  }, [isSupported, onError])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    recognitionRef.current.stop()
    setIsListening(false)
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
    setError(null)
  }, [])

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error,
  }
}

// Type declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
  length: number
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionEvent {
  resultIndex: number
  results: SpeechRecognitionResult[]
}

interface SpeechRecognitionErrorEvent {
  error: string
  message: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
  start(): void
  stop(): void
  abort(): void
}
