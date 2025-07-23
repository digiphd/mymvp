'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { X, Clock, Layers, Code, Search, Users } from 'lucide-react'

const dontDoItems = [
  {
    icon: Clock,
    title: 'Endless "Discovery" Phases',
    description: "While agencies spend months planning, we're shipping. Your idea doesn't need a 50-page discovery document."
  },
  {
    icon: Layers,
    title: 'WordPress with 47 Plugins',
    description: "WordPress breaks. Plugins conflict. Updates fail. We build real web applications, not digital house of cards."
  },
  {
    icon: Code,
    title: 'No-Code "Solutions"',
    description: "Bubble and Webflow hit walls fast. You'll outgrow them in months, then need a real application anyway."
  },
  {
    icon: Users,
    title: 'Old-Paradigm Development',
    description: "Manual coding for every feature is inefficient. We use AI-native development to ship faster while maintaining quality."
  },
  {
    icon: Search,
    title: 'Technology Experiments',
    description: "No debates about React vs Vue vs Angular. We use proven stacks that work, scale, and ship fast."
  },
  {
    icon: X,
    title: 'Custom Everything from Scratch',
    description: "Why reinvent authentication when Auth0 exists? We use best-in-class tools and focus on your unique value."
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
            What We <span className="text-blue-600">Don't</span> Do
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