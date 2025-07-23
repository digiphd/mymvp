'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Package, Server, Wrench, Zap, Users, XCircle } from 'lucide-react'

export default function PostDeliverySection() {
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
            What Happens <span className="text-blue-600">After</span> Delivery
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            <em>Clear handoff and ongoing relationship</em>
          </p>
        </motion.div>

        {/* Day 14 Handoff */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Card className="p-8 bg-blue-50 border-blue-200 border-2">
            <div className="flex items-center mb-6">
              <Package className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-2xl font-bold text-blue-800">Day 14: Complete Handoff</h3>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">You Get Everything:</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Complete source code ownership</li>
                <li>• Technical documentation</li>
                <li>• Database access and credentials</li>
                <li>• Deployment guides and setup instructions</li>
                <li>• Build your own dev team - we don't lock you in</li>
                <li>• <strong>You own it all</strong></li>
              </ul>
            </div>
          </Card>
        </motion.div>

        {/* Ongoing Support Options */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Ongoing Support (Optional)</h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Managed Hosting */}
            <Card className="p-6 bg-white border border-gray-200">
              <div className="text-center mb-4">
                <Server className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">Managed Hosting</h4>
                <div className="text-2xl font-bold text-blue-600">$127/month</div>
                <div className="text-sm text-gray-500">Hosting + infrastructure management</div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Vercel Pro hosting (you pay $20/month direct)</li>
                <li>• Supabase Pro database (you pay $25/month direct)</li>
                <li>• SSL certificates and domain management</li>
                <li>• Performance monitoring and alerts</li>
                <li>• Automated backups and disaster recovery</li>
                <li>• 99.9% uptime guarantee</li>
              </ul>
            </Card>

            {/* Technical Support */}
            <Card className="p-6 bg-white border border-gray-200">
              <div className="text-center mb-4">
                <Wrench className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">Technical Support</h4>
                <div className="text-2xl font-bold text-blue-600">$247/month</div>
                <div className="text-sm text-gray-500">Hosting + development support</div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• All managed hosting benefits above</li>
                <li>• Security updates and patches</li>
                <li>• Package updates and dependency management</li>
                <li>• Bug fixes and performance optimization</li>
                <li>• Priority technical support (same-day response)</li>
                <li>• Monthly performance reports</li>
              </ul>
            </Card>

            {/* Quick Iterations */}
            <Card className="p-6 bg-white border border-gray-200">
              <div className="text-center mb-4">
                <Zap className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">Quick Iteration Development</h4>
                <div className="text-2xl font-bold text-blue-600">$197/hour</div>
                <div className="text-sm text-gray-500 italic">The path to product-market fit</div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• New features based on user data</li>
                <li>• A/B testing implementations</li>
                <li>• User flow optimizations</li>
                <li>• Performance improvements</li>
                <li>• Upfront estimates provided</li>
                <li>• 3-5 day delivery per iteration</li>
              </ul>
            </Card>
          </div>

          <Card className="p-6 bg-green-50 border-green-200">
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Getting to product-market fit requires rapid iteration</strong> based on real user behavior. Quick feedback cycles are critical - you need to identify bottlenecks, spot unused features, and build what users actually need.
            </p>
          </Card>
        </motion.div>

        {/* Independence Option */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Card className="p-8 bg-white border border-gray-200">
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Full Independence</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>• Take your code to any developer team</li>
              <li>• Host wherever you want</li>
              <li>• We don't lock you in</li>
            </ul>
          </Card>
        </motion.div>

        {/* What We Don't Do */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 bg-red-50 border-red-200 border-2">
            <div className="flex items-center mb-6">
              <XCircle className="w-8 h-8 text-red-600 mr-3" />
              <h3 className="text-2xl font-bold text-red-800">We Don't Do:</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>• Unlimited revisions or scope creep</li>
              <li>• Free work after delivery</li>
              <li>• Marketing or user acquisition</li>
              <li>• Ongoing commitments without clear agreements</li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}