'use client'

import { motion } from 'framer-motion'
import { Code, Database, Zap, Shield, Globe, CheckCircle } from 'lucide-react'

export default function StackSection() {
  const stackItems = [
    {
      icon: Code,
      title: "Next.js 15",
      description: "React framework with TypeScript, App Router, and Server Components",
      color: "blue"
    },
    {
      icon: Database,
      title: "Supabase",
      description: "PostgreSQL database with real-time features and authentication",
      color: "green"
    },
    {
      icon: Zap,
      title: "Express API",
      description: "Node.js backend with REST APIs and middleware integration",
      color: "yellow"
    }
  ]

  const features = [
    "✅ Built-in authentication and user management",
    "✅ Stripe payment integration out of the box",
    "✅ Real-time database with PostgreSQL",
    "✅ Responsive design with Tailwind CSS",
    "✅ API-first architecture for mobile expansion",
    "✅ Enterprise-grade security and compliance"
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            One Stack.<br />
            <span className="text-blue-600">Zero Confusion.</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We use the same proven technology stack for every project. No experiments, no debates, 
            no "what framework should we use?" meetings. Just reliable, scalable applications.
          </p>
        </motion.div>

        {/* Stack Overview */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {stackItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`w-12 h-12 rounded-lg mb-6 flex items-center justify-center ${
                item.color === 'blue' ? 'bg-blue-100' :
                item.color === 'green' ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                <item.icon className={`w-6 h-6 ${
                  item.color === 'blue' ? 'text-blue-600' :
                  item.color === 'green' ? 'text-green-600' : 'text-yellow-600'
                }`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Why This Stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Why We Standardized on This Stack
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Technology choice paralysis kills speed. We standardized on this proven stack 
                to deliver enterprise-grade capabilities with startup velocity.
              </p>
              
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex items-center text-gray-700"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{feature.replace('✅ ', '')}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-8 text-white"
              >
                <div className="flex items-center mb-6">
                  <Shield className="w-8 h-8 mr-3" />
                  <h4 className="text-xl font-bold">Enterprise Ready</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Performance</span>
                    <div className="flex space-x-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-2 h-2 bg-white rounded-full" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Security</span>
                    <div className="flex space-x-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-2 h-2 bg-white rounded-full" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Scalability</span>
                    <div className="flex space-x-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-2 h-2 bg-white rounded-full" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Developer Experience</span>
                    <div className="flex space-x-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-2 h-2 bg-white rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                viewport={{ once: true }}
                className="absolute -bottom-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
              >
                <Globe className="w-4 h-4 inline mr-2" />
                Production Ready
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 text-lg">
            <strong>No framework debates.</strong> No technology experiments. 
            <br />Just battle-tested tools that ship fast and scale forever.
          </p>
        </motion.div>
      </div>
    </section>
  )
}