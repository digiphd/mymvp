'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { TrendingUp, Users, Megaphone, Target, Video, MessageSquare } from 'lucide-react'

export default function LaunchPrepSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            While We Build, You Prepare to Launch
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            <em>We only work with relentless founders</em>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Card className="p-8 bg-red-50 border-red-200 border-2">
            <h3 className="text-2xl font-bold text-red-800 mb-4">
              Building Doesn't Mean They'll Come
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Getting your first 100 users requires shameless promotion, relentless hustle, and putting yourself out there in ways that feel uncomfortable. Product-market fit comes months later, but your launch success starts now.
            </p>
            <p className="text-gray-700 leading-relaxed font-semibold">
              Here's what you should be doing during our 14-day build:
            </p>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 bg-white border border-gray-200 h-full">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 text-blue-600 mr-3" />
                <h4 className="text-xl font-bold text-gray-900">Start Building Your Audience Now</h4>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li>• Launch a waitlist and start collecting emails</li>
                <li>• Put your face out there - TikTok, LinkedIn, Twitter</li>
                <li>• Build a personal brand so people know, like, and trust you</li>
                <li>• Create a forgiving community to launch to</li>
              </ul>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 bg-white border border-gray-200 h-full">
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 text-blue-600 mr-3" />
                <h4 className="text-xl font-bold text-gray-900">Plan Your Launch Strategy</h4>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li>• Create video content and media assets</li>
                <li>• Research your target audience and where they hang out</li>
                <li>• Plan your influencer outreach and partnerships</li>
                <li>• Design your paid marketing campaigns</li>
              </ul>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Card className="p-8 bg-orange-50 border-orange-200 border-2">
            <div className="flex items-center mb-4">
              <Megaphone className="w-8 h-8 text-orange-600 mr-3" />
              <h3 className="text-2xl font-bold text-orange-800">Prepare to Be Shameless</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              VCs aren't looking for perfect products - they're looking for founders who will do whatever it takes:
            </p>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li>• Post daily about your journey</li>
              <li>• Reach out to potential users directly</li>
              <li>• Do the "cringe" things others won't do</li>
              <li>• Separate yourself from the noise with volume and authenticity</li>
            </ul>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 bg-gray-900 text-white text-center">
            <p className="text-xl leading-relaxed mb-4">
              <strong>We only work with founders who understand that building is 10% of success. The other 90% is relentless marketing, shameless promotion, and refusing to give up.</strong>
            </p>
            <p className="text-lg text-blue-300 mb-4">
              We minimize your time, cost, and risk during building - so you can maximize revenue-generating activities.
            </p>
            <p className="text-lg text-gray-300">
              If you're looking for a "build it and they will come" solution, we're not the right fit.
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}