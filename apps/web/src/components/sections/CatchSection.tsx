'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Users, MessageSquareText, Clock, ArrowRight } from 'lucide-react'

export default function CatchSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            What's the <span className="text-blue-600">Catch</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're honest about what it takes to deliver at this speed and cost
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 bg-amber-50 border-amber-200 border-2 mb-8">
              <div className="flex items-start space-x-4">
                <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-amber-800 mb-4">
                    Initial Beta Customers Only
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    We are still fine-tuning our processes. As you can imagine, to deliver at this much speed at this cost requires a fine-tuned production line and standard operating procedures end-to-end.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>We're looking for people who are wanting to enjoy the journey and willing to provide feedback.</strong> They need to be people who are open to experimentation and responsive to our feedback because one of the biggest delays is the response from the client in providing feedback.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 bg-white border border-gray-200 h-full">
                <div className="text-center">
                  <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Open to Experimentation
                  </h4>
                  <p className="text-gray-600 text-sm">
                    You're excited about trying new approaches and understand we're perfecting our process together
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 bg-white border border-gray-200 h-full">
                <div className="text-center">
                  <MessageSquareText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Responsive Communication
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Quick feedback and responses are crucial - delays in communication directly impact our 14-day timeline
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 bg-white border border-gray-200 h-full">
                <div className="text-center">
                  <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Enjoy the Journey
                  </h4>
                  <p className="text-gray-600 text-sm">
                    You're excited about the building process and understand that innovation requires iteration
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold text-blue-600 mb-4">
              Limited Spots Available
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We only take on a limited number of projects each month to ensure quality and maintain our 14-day delivery promise. 
              <strong className="text-blue-600"> Current availability: 3 spots remaining this month.</strong>
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 text-lg group shadow-lg"
                onClick={() => window.location.href = '/apply'}
              >
                Apply to Work With Us
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}