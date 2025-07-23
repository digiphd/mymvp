'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Clock, FileText, Users, Code, TestTube, Rocket, ArrowDown, Zap } from 'lucide-react'
import Image from 'next/image'

const oldWaySteps = [
  { icon: FileText, title: "Discovery Phase", desc: "6-8 weeks of meetings", duration: "6-8 weeks" },
  { icon: Users, title: "Requirements Gathering", desc: "Endless stakeholder interviews", duration: "3-4 weeks" },
  { icon: FileText, title: "Technical Specification", desc: "200-page documentation", duration: "2-3 weeks" },
  { icon: Code, title: "Backend Development", desc: "Manual coding from scratch", duration: "8-12 weeks" },
  { icon: Code, title: "Frontend Development", desc: "Custom UI components", duration: "6-10 weeks" },
  { icon: TestTube, title: "Testing Phase", desc: "QA and bug fixes", duration: "4-6 weeks" },
  { icon: Rocket, title: "Deployment", desc: "Infrastructure setup", duration: "2-3 weeks" },
  { icon: Clock, title: "Launch", desc: "Finally ready for users", duration: "6+ months total" }
]

const newWaySteps = [
  { icon: Zap, title: "AI Discovery", desc: "1-day requirements capture", duration: "1 day" },
  { icon: Code, title: "Frontend First", desc: "AI-generated UI with rapid feedback cycles - get customer approval", duration: "3 days" },
  { icon: Code, title: "Backend Build", desc: "Full-stack integration with authentication, payments, and core features", duration: "7 days" },
  { icon: TestTube, title: "Quality Assurance", desc: "Automated testing", duration: "2 days" },
  { icon: Rocket, title: "Launch Ready", desc: "Production deployment", duration: "1 day" }
]

export default function ComparisonSection() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            The Old Way vs The <span className="text-blue-600">New Way</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            While traditional agencies promise MVPs and deliver mockups, we deliver working applications
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          {/* Old Way - 8 Steps */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-red-600 mb-2">Traditional Agencies</h3>
              <p className="text-gray-500 text-lg">The Old Way - 8 Long Steps</p>
              <div className="mt-4 inline-flex items-center bg-red-50 px-4 py-2 rounded-full border border-red-200">
                <Clock className="w-4 h-4 text-red-600 mr-2" />
                <span className="text-red-600 font-semibold">6+ Months Total</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {oldWaySteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <Card className="p-6 bg-white border-red-100 hover:border-red-200 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center border-2 border-red-200">
                          <step.icon className="w-5 h-5 text-red-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">{step.title}</h4>
                          <span className="text-sm text-red-600 font-medium bg-red-50 px-2 py-1 rounded">
                            {step.duration}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{step.desc}</p>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Connection Line */}
                  {index < oldWaySteps.length - 1 && (
                    <div className="absolute left-6 top-20 w-0.5 h-4 bg-red-200"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* New Way - 4 Steps */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute top-4 right-4 z-10">
              <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                RECOMMENDED
              </span>
            </div>
            
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-2">
                <Image 
                  src="/logo.png" 
                  alt="myMVP Logo" 
                  width={32} 
                  height={32}
                  className="w-8 h-8 mr-3"
                />
                <h3 className="text-3xl font-bold">
                  <span className="text-black">my</span>
                  <span className="text-blue-600">MVP</span>
                </h3>
              </div>
              <p className="text-gray-500 text-lg">The New Way - 5 Smart Steps</p>
              <div className="mt-4 inline-flex items-center bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                <Zap className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-blue-600 font-semibold">14 Days Total</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {newWaySteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <Card className="p-8 bg-gradient-to-r from-blue-50 to-white border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                          <step.icon className="w-7 h-7 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xl font-bold text-gray-900">{step.title}</h4>
                          <span className="text-lg text-blue-600 font-bold bg-blue-100 px-3 py-1 rounded-full">
                            {step.duration}
                          </span>
                        </div>
                        <p className="text-gray-600">{step.desc}</p>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Connection Line */}
                  {index < newWaySteps.length - 1 && (
                    <div className="absolute left-8 top-24 w-0.5 h-6 bg-blue-300"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}