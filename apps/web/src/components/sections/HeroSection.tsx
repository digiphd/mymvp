'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Sparkles } from 'lucide-react'
import MVPMockup from '@/components/MVPMockup'
import { useRouter } from 'next/navigation'

export default function HeroSection() {
  const router = useRouter()
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-16 pb-16">
      <div className="container mx-auto px-6">
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center justify-center lg:justify-start mb-6"
            >
              <Zap className="w-8 h-8 text-blue-600 mr-3" />
              <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">
                AI-Powered Development
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900 cursor-default"
            >
              <span className="text-blue-600">Validation-Ready</span> Micro-SaaS in 14 Days
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-600 mb-4 leading-relaxed"
            >
              Ready for{' '}
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="text-blue-600 font-semibold cursor-default"
              >
                real customers, real payments, real validation
              </motion.span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mb-8"
            >
              <div className="inline-flex items-center bg-blue-50 border border-blue-200 rounded-full px-4 py-2">
                <span className="text-blue-700 font-semibold text-sm">
                  🎯 Focused on startup phase: 0 → 1 users
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center lg:justify-start space-x-1 sm:space-x-2 md:space-x-4 text-base sm:text-lg md:text-xl font-bold overflow-x-auto">
                <motion.span 
                  whileHover={{ scale: 1.1 }}
                  className="bg-blue-600 text-white px-2 sm:px-3 py-2 rounded-lg cursor-default text-sm sm:text-base flex-shrink-0"
                >
                  Build
                </motion.span>
                <span className="text-blue-600">→</span>
                <motion.span 
                  whileHover={{ scale: 1.1 }}
                  className="bg-green-600 text-white px-2 sm:px-3 py-2 rounded-lg cursor-default text-sm sm:text-base flex-shrink-0"
                >
                  Test
                </motion.span>
                <span className="text-green-600">→</span>
                <motion.span 
                  whileHover={{ scale: 1.1 }}
                  className="bg-purple-600 text-white px-2 sm:px-3 py-2 rounded-lg cursor-default text-sm sm:text-base flex-shrink-0"
                >
                  Learn
                </motion.span>
                <span className="text-purple-600">→</span>
                <motion.span 
                  whileHover={{ scale: 1.1 }}
                  className="bg-orange-600 text-white px-2 sm:px-3 py-2 rounded-lg cursor-default text-sm sm:text-base flex-shrink-0"
                >
                  Iterate
                </motion.span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center lg:items-start"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-6 text-lg group shadow-lg transition-all duration-200"
                  onClick={() => router.push('/apply')}
                >
                  <Sparkles className="mr-2 w-5 h-5" />
                  Apply to Work With Us
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-6 text-lg transition-all duration-200 shadow-lg"
                  onClick={() => {
                    const element = document.querySelector('#how-it-works')
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }}
                >
                  See How It Works
                </Button>
              </motion.div>
            </motion.div>

          </motion.div>

          {/* Right Column - MVP Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            <MVPMockup />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-blue-600 rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-blue-600 rounded-full mt-2"></div>
        </motion.div>
      </div>
    </section>
  )
}