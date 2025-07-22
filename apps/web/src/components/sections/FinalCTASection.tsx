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
            Ready to Stop Planning and Start Building?
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
              Build My MVP
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-2xl mx-auto"
          >
            <p className="text-lg font-semibold text-blue-600">
              "Every day you wait is another day your competition gets closer to your idea."
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}