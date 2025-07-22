'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { X, Clock, Layers, Code, Search, Users } from 'lucide-react'

const dontDoItems = [
  {
    icon: Clock,
    title: '6-Month "Discovery" Phases',
    description: "We don't believe in endless planning meetings. You know your idea - we build it fast."
  },
  {
    icon: Layers,
    title: 'Build 47-Feature Monsters',
    description: "Your MVP isn't a museum. We say NO to feature bloat so your product can say YES to success."
  },
  {
    icon: Code,
    title: 'Promise MVPs, Deliver Mockups',
    description: "While agencies deliver prototypes, we deliver working applications with solid backends."
  },
  {
    icon: Users,
    title: 'Manual Coding Processes',
    description: "We don't hack code manually. Our AI-orchestrated systems deliver working applications at startup speed."
  },
  {
    icon: Search,
    title: 'Research Instead of Building',
    description: "Market research is the new procrastination. We build real products with real user data in 2 weeks."
  },
  {
    icon: X,
    title: 'Disappear After Launch',
    description: "We stick around to help you iterate based on real user feedback and growth data."
  }
]

export default function WhatWeDontDoSection() {
  return (
    <section id="what-we-dont-do" className="py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            What We Don't Do
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {dontDoItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 bg-white border border-red-200 hover:border-red-300 hover:shadow-lg transition-all duration-300 h-full">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200 relative">
                    <item.icon className="w-6 h-6 text-red-600" />
                    <X className="w-4 h-4 text-red-500 absolute -top-1 -right-1 bg-white rounded-full" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 flex-1">{item.title}</h3>
                </div>
                
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}