'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

const pocFeatures = [
  'Working frontend code with realistic data (No Figma)',
  'AI-generated UI design and user flows',
  'Fully functional user interface and interactions',
  'Mobile-responsive React/Next.js application',
  'Demo-ready for presentations and investor meetings',
  'No backend logic - frontend only with mock data'
]

const mvpFeatures = [
  'Professional full-stack application',
  'Auth + Payments + Up to 3 core features',
  'AI-native architecture from day one',
  'Production deployment and hosting setup',
  '30 days of bug fixes and technical support',
  'Complete code ownership and documentation',
  'Built for growth and expansion'
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-6">
        {/* Beta Program Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg">
            <span className="font-semibold text-lg">🚀 Beta Program - First 10 Clients</span>
          </div>
          <p className="text-gray-600 mt-3 text-lg">
            Special pricing while we perfect our process together
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            <span className="text-blue-600">Two Ways</span> to Start
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the path that fits your current needs and budget
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Proof of Concept */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Proof of Concept</h3>
                <div className="mb-2">
                  <div className="text-lg text-gray-500 line-through">$1,997 USD</div>
                  <div className="text-4xl font-bold text-gray-900">$997 USD</div>
                  <div className="text-sm text-green-600 font-semibold">Save $1,000 - Beta Launch Special</div>
                </div>
                <p className="text-gray-600">Working frontend code - no design mockups, just functional interfaces</p>
                <div className="mt-4 inline-flex items-center bg-gray-100 px-4 py-2 rounded-full border">
                  <span className="text-gray-700 font-semibold">7-day delivery</span>
                </div>
              </div>
            
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">What's Included:</h4>
                <div className="space-y-3">
                  {pocFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-3"
                    >
                      <div className="p-1 bg-gray-100 rounded-full border border-gray-300 mt-0.5 flex-shrink-0">
                        <Check className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-gray-600 text-sm sm:text-base">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Pivot Option */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h5 className="font-semibold text-blue-900 mb-2">Easy Pivot to Full MVP</h5>
                <p className="text-sm text-blue-800">
                  Love your proof of concept? Get a <strong>discount to upgrade</strong> to the full MVP once your frontend is complete.
                </p>
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-8 py-4 text-lg w-full shadow-lg"
                  onClick={() => window.location.href = '/apply'}
                >
                  Apply for PoC
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Full MVP */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                MOST POPULAR
              </span>
            </div>
            
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-300 shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-blue-600 mb-2">Full MVP</h3>
                <div className="mb-2">
                  <div className="text-lg text-gray-500 line-through">$11,500 USD</div>
                  <div className="text-4xl font-bold text-gray-900">$7,600 USD</div>
                  <div className="text-sm text-green-600 font-semibold">Save $3,900 - Beta Launch Special</div>
                </div>
                <p className="text-gray-600">Working application ready for real users</p>
                <div className="mt-4 inline-flex items-center bg-blue-100 px-4 py-2 rounded-full border border-blue-200">
                  <span className="text-blue-700 font-semibold">14-day delivery</span>
                </div>
              </div>
              
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">What's Included:</h4>
                <div className="space-y-3">
                  {mvpFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-3"
                    >
                      <div className="p-1 bg-blue-50 rounded-full border border-blue-200 mt-0.5 flex-shrink-0">
                        <Check className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-gray-600 text-sm sm:text-base">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>


              <div className="text-center">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 text-lg w-full shadow-lg"
                  onClick={() => window.location.href = '/apply'}
                >
                  Apply to Work With Us
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}