'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Code, Zap, Users, Target, ArrowRight } from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              About my<span className="text-blue-600">MVP</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Built by a Founder, for Founders
            </p>
          </motion.div>

          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 md:p-12 shadow-lg border border-blue-100 mb-12"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="flex-shrink-0">
                <Image
                  src="/roger_profile.jpg"
                  alt="Roger Chappel - Founder of myMVP"
                  width={200}
                  height={200}
                  className="rounded-xl shadow-lg"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Hi, I'm Roger Chappel
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  I built myMVP because I've been exactly where you are right now.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  As a backend developer and solo founder, I've experienced the frustration of having great ideas but getting stuck in endless development cycles. I've watched brilliant founders waste months in "discovery phases" with agencies who promise MVPs and deliver mockups. I've seen incredible concepts die because traditional development takes too long and costs too much.
                </p>
                <p className="text-gray-600 leading-relaxed mt-4 font-semibold">
                  That's why myMVP exists.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Why Different Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Why I Do This Differently</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-6">
                After years of building applications the slow way, I discovered that AI-powered development could compress months of work into weeks - but only if you have the right process and ruthlessly focus on what matters.
              </p>
              <p className="mb-6">
                I built myMVP on a simple principle: <strong>founders need working applications to validate ideas, not perfect products to win design awards.</strong> While agencies get lost in feature creep and stakeholder meetings, I build functional applications with payments, authentication, and your core value proposition.
              </p>
              <p className="mb-6">
                My approach is different because I understand the founder journey. I know that building is only 10% of success - the other 90% is relentless marketing, user acquisition, and iterating based on real data. That's why I minimize your time spent on development so you can maximize time spent on what actually grows your business.
              </p>
            </div>
          </motion.div>

          {/* Key Principles */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid md:grid-cols-2 gap-8 mb-12"
          >
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Speed Over Perfection</h3>
              </div>
              <p className="text-gray-600">
                Working applications beat perfect mockups. Get to market fast, then iterate based on real user feedback.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Focus on Core Value</h3>
              </div>
              <p className="text-gray-600">
                Authentication + Payments + Your unique value. Skip the feature bloat and build what actually matters.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center mb-4">
                <Code className="w-8 h-8 text-purple-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Proven Technology</h3>
              </div>
              <p className="text-gray-600">
                Next.js, Express, Supabase - the same stack powering Netflix, GitHub, and successful startups.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 text-orange-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Founder Understanding</h3>
              </div>
              <p className="text-gray-600">
                I've been in your shoes. I know the urgency, the constraints, and what really moves the needle.
              </p>
            </div>
          </motion.div>

          {/* Technical Foundation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="bg-gray-50 rounded-xl p-8 mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">The Technical Foundation</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              I use Next.js, Express, and Supabase exclusively - not because I can't work with other technologies, but because this stack allows me to deliver production-ready applications in 14 days while ensuring they're built for growth.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This isn't about cutting corners. It's about using proven, industry-standard technologies that power companies like Netflix, GitHub, and countless successful startups. <strong>Fast to build, built for growth.</strong>
            </p>
          </motion.div>

          {/* Beyond the Code */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Beyond the Code</h2>
            <div className="text-gray-700 leading-relaxed space-y-6">
              <p>
                When you work with myMVP, you're not just getting an application - you're getting a founder who understands the urgency of getting to market quickly. I communicate daily during development, provide complete code ownership, and stick around to help you iterate based on real user feedback.
              </p>
              <p>
                I only work with a limited number of clients each month because I believe in doing fewer projects exceptionally well rather than many projects adequately.
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-center bg-blue-600 rounded-xl p-8 text-white"
          >
            <h3 className="text-2xl font-bold mb-4">
              Ready to stop planning and start building?
            </h3>
            <p className="text-blue-100 mb-6 text-lg">
              Let's turn your idea into a working application in 14 days.
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-4 text-lg group"
              onClick={() => window.location.href = '/apply'}
            >
              Apply to Work With Me
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  )
}