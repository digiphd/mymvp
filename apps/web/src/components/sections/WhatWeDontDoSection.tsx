'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { X, Clock, Layers, Code, Search, Users, Smartphone, Building, Bitcoin, Shield, Grid3x3, CreditCard, Megaphone, Target } from 'lucide-react'

const dontDoCategories = [
  {
    title: "Development Approach",
    items: [
      {
        icon: Clock,
        title: 'Endless "Discovery" Phases',
        description: "While agencies spend months planning, we're shipping. Your idea doesn't need a 50-page discovery document."
      },
      {
        icon: Search,
        title: 'Technology Experiments',
        description: "No debates about React vs Vue vs Angular. We use proven stacks that work, grow with you, and ship fast."
      },
      {
        icon: Users,
        title: 'Old-Paradigm Development',
        description: "Manual coding for every feature is inefficient. We use AI-native development to ship faster while maintaining quality."
      },
      {
        icon: X,
        title: 'Custom Everything from Scratch',
        description: "Why reinvent authentication when proven solutions exist? We use best-in-class tools and focus on your unique value."
      }
    ]
  },
  {
    title: "Platform & Technology Limitations",
    items: [
      {
        icon: Layers,
        title: 'WordPress with 47 Plugins',
        description: "WordPress breaks. Plugins conflict. Updates fail. We build real web applications, not digital house of cards."
      },
      {
        icon: Code,
        title: 'No-Code "Solutions"',
        description: "No-code platforms hit walls fast. You'll outgrow them in months, then need a real application anyway."
      },
      {
        icon: Smartphone,
        title: 'Mobile Apps (Native iOS/Android)',
        description: "We build responsive web applications that work perfectly on mobile browsers. Native app stores are a different business. Although our APIs can be used with these using OAuth2.0 flows."
      },
      {
        icon: Bitcoin,
        title: 'Crypto/Blockchain Applications',
        description: "Blockchain development requires specialized expertise we don't offer. We stick to proven web technologies."
      }
    ]
  },
  {
    title: "Complex Integrations & Compliance",
    items: [
      {
        icon: Building,
        title: 'Complex Business System Integrations',
        description: "No Salesforce, SAP, or legacy system integrations. We focus on modern web applications with clean APIs."
      },
      {
        icon: Shield,
        title: 'Fintech Requiring Banking Compliance',
        description: "FDIC compliance and banking regulations are beyond our scope. We handle standard payment processing only."
      },
      {
        icon: Grid3x3,
        title: 'Multi-Tenant Platforms',
        description: "Complex multi-tenant architectures with role-based access belong with specialists. We build focused single-tenant applications."
      },
      {
        icon: CreditCard,
        title: 'Custom Payment Processors',
        description: "We integrate with Stripe and Polar.sh. Custom payment processing requires specialized compliance expertise."
      }
    ]
  },
  {
    title: "Marketing & Strategy",
    items: [
      {
        icon: Megaphone,
        title: 'Marketing or User Acquisition',
        description: "We build the application. Getting customers, content creation, and paid advertising are entirely your responsibility."
      },
      {
        icon: Target,
        title: 'Go-to-Market Strategy',
        description: "Product-market fit comes from talking to users, not building features. We handle the tech, you handle the market."
      }
    ]
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

        <div className="max-w-7xl mx-auto space-y-16">
          {dontDoCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                {category.title}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: itemIndex * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <Card className="p-6 bg-white border border-red-200 hover:border-red-300 hover:shadow-lg transition-all duration-300 h-full">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200 relative">
                          <item.icon className="w-6 h-6 text-red-600" />
                          <X className="w-4 h-4 text-red-500 absolute -top-1 -right-1 bg-white rounded-full" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 flex-1">{item.title}</h4>
                      </div>
                      
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}