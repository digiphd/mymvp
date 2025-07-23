'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Target, Users, Rocket, TrendingUp } from 'lucide-react'

const principles = [
  {
    icon: Target,
    title: "Less is Exponentially More",
    description: "From 47 features to 3 core features - we perfect the art of ruthless feature elimination.",
    stat: "3 Core Features",
    detail: "Auth + Payments + Your Unique Value"
  },
  {
    icon: Users,
    title: "Real Users > Focus Groups",
    description: "Market research is the new procrastination. 2 weeks of building trumps 6 months of asking.",
    stat: "2 Weeks",
    detail: "Real user data vs months of surveys"
  },
  {
    icon: Rocket,
    title: "Build → Test → Learn",
    description: "Your users don't need a dashboard on day one. Perfect is the enemy of shipped.",
    stat: "Day 1",
    detail: "Launch with core value, iterate with data"
  },
  {
    icon: TrendingUp,
    title: "We Say NO So You Say YES",
    description: "Ideas are cheap, execution data is expensive. We build focused products, not feature museums.",
    stat: "85% Faster",
    detail: "Time to market with focused scope"
  }
]

export default function PhilosophySection() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-100 to-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            What Makes a <span className="text-blue-600">Great</span> MVP
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            The controversial truth about validation and why building beats researching
          </p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-4xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-blue-600 mb-4">The Validation Myth</h3>
            <p className="text-lg text-gray-700">
              "Stop researching, start building. Surveys lie, users don't. Your 47-feature creation isn't an MVP, it's a monster."
            </p>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {principles.map((principle, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 h-full">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <principle.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{principle.title}</h3>
                    <div className="text-3xl font-bold text-blue-600 mb-1">{principle.stat}</div>
                    <div className="text-sm text-gray-500 mb-4">{principle.detail}</div>
                  </div>
                </div>
                
                <p className="text-gray-600 leading-relaxed">{principle.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-blue-600 mb-4">
              The Winning Formula
            </h3>
            <div className="text-2xl font-bold text-gray-900 mb-6">
              Auth + Payments + 1-3 Core Features + Relentless Marketing = Success
            </div>
            <p className="text-gray-600 mb-8 text-lg">
              We say NO so your MVP can say YES to success. Building is 10% of success - the other 90% is relentless marketing. While your competition is still surveying, you're already scaling.
            </p>
            
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-6 shadow-lg"
              onClick={() => window.location.href = '/apply'}
            >
              Experience the Difference
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}