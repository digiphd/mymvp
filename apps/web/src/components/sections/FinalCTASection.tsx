'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function FinalCTASection() {
  const router = useRouter()

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            Ready to Stop Planning and Start <span className="text-blue-600">Building</span>?
          </h2>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Ready to transform your vision into reality? Get started with your MVP application today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-6 text-lg group shadow-lg"
              onClick={() => router.push('/apply')}
            >
              <Sparkles className="mr-2 w-5 h-5" />
              Apply to Work With Us
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center space-x-2 md:space-x-4 text-base md:text-lg font-bold">
              <motion.span 
                whileHover={{ scale: 1.1 }}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg cursor-default"
              >
                Build
              </motion.span>
              <span className="text-blue-600">→</span>
              <motion.span 
                whileHover={{ scale: 1.1 }}
                className="bg-green-600 text-white px-3 py-2 rounded-lg cursor-default"
              >
                Test
              </motion.span>
              <span className="text-green-600">→</span>
              <motion.span 
                whileHover={{ scale: 1.1 }}
                className="bg-purple-600 text-white px-3 py-2 rounded-lg cursor-default"
              >
                Learn
              </motion.span>
              <span className="text-purple-600">→</span>
              <motion.span 
                whileHover={{ scale: 1.1 }}
                className="bg-orange-600 text-white px-3 py-2 rounded-lg cursor-default"
              >
                Iterate
              </motion.span>
            </div>
            <p className="text-sm text-gray-600 mt-3 text-center">
              The path to product-market fit
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}