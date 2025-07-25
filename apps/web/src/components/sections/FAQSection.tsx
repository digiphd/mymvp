'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqCategories = [
  {
    title: "Pre-Project Questions",
    faqs: [
      {
        question: "How can you build quality applications so fast?",
        answer: "AI-powered development handles repetitive coding tasks while our developers focus on your unique requirements. We use proven frameworks and standardized processes refined over dozens of projects."
      },
      {
        question: "What types of applications can you build?",
        answer: "Micro-SaaS applications with user authentication, payments, and 3-5 core features. Think task management, analytics dashboards, booking systems, or content platforms. Complex enterprise integrations fall outside our scope."
      },
      {
        question: "Can you sign an NDA?",
        answer: "Yes, we sign NDAs before discussing your project details."
      },
      {
        question: "What technologies do you use?",
        answer: "Next.js 15 with TypeScript and App Router for frontend. Express.js API with Supabase PostgreSQL database. Vercel for hosting. This stack handles authentication, payments, and real-time features out of the box."
      },
      {
        question: "Do you work with international clients?",
        answer: "Yes. We invoice in USD and accept international wire transfers. All communication happens via email and video calls."
      },
      {
        question: "What if I'm not technical—can I still work with you?",
        answer: "Yes. We handle all technical aspects and provide clear documentation. However, you'll need someone technical for ongoing maintenance and future development."
      }
    ]
  },
  {
    title: "Project Delivery Questions",
    faqs: [
      {
        question: "What happens if you can't deliver in 14 days?",
        answer: "We aim for 14-day delivery but work in 2-week sprints. If your project requires additional development time, we complete it within 28 days total at no extra cost. We communicate timeline expectations clearly during our initial consultation."
      },
      {
        question: "What if I need changes during the 14-day build?",
        answer: "Minor adjustments to the agreed scope are included. Major changes or additional features are handled as separate projects to maintain our timeline."
      },
      {
        question: "How do you handle project scope creep?",
        answer: "We define exact scope during our initial call and stick to it. Any requests outside the agreed scope are quoted separately as new work."
      }
    ]
  },
  {
    title: "Post-Delivery Questions",
    faqs: [
      {
        question: "Who owns the code and intellectual property?",
        answer: "You own everything. Complete source code, database, and all intellectual property transfer to you on delivery day."
      },
      {
        question: "Do you provide ongoing hosting?",
        answer: "We offer two options: (1) Managed hosting service for $127/month plus infrastructure costs (Vercel Pro $20/month, Supabase Pro $25/month) where we handle everything, or (2) We set up hosting on your accounts and you manage it yourself with our documentation."
      },
      {
        question: "What if something breaks after delivery?",
        answer: "Critical bugs within 7 days of delivery are fixed free. After that, our Technical Support package ($247/month) covers ongoing maintenance and bug fixes."
      },
      {
        question: "How do ongoing iterations work toward product-market fit?",
        answer: "Quick iteration cycles are critical for finding product-market fit - you need to rapidly test, measure, and improve based on real user behavior. We're currently exploring the best pricing model for post-MVP iterations to ensure it aligns with your success. We can discuss specific options and pricing during your discovery call, as we have a few promising approaches we're evaluating."
      },
      {
        question: "Can I take the code to another developer team?",
        answer: "Absolutely. You get complete source code ownership and technical documentation. Any developer can take over from where we left off."
      },
      {
        question: "Do you handle marketing or user acquisition?",
        answer: "No. We build the application. Marketing, user acquisition, and launch strategy are entirely your responsibility."
      },
      {
        question: "Can you integrate with my existing systems?",
        answer: "Simple API integrations (Stripe, email services, analytics) are possible. Complex enterprise integrations fall outside our beta scope - we'll refer you to specialists."
      }
    ]
  },
  {
    title: "Pricing and Payment Questions",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer: "We invoice via Xero and accept international wire transfers. Payment is required before we start work."
      },
      {
        question: "Are there any hidden costs?",
        answer: "No. Our pricing is transparent. The only ongoing costs are optional hosting ($127/month) and support services ($247/month) if you choose them."
      },
    ]
  },
  {
    title: "Beta Program Questions",
    faqs: [
      {
        question: "What does \"beta launch special\" mean?",
        answer: "We're fine-tuning our processes and looking for collaborative founders who understand we're perfecting our system together. In exchange, you get significant savings on our standard pricing."
      },
      {
        question: "How many projects do you take on each month?",
        answer: "We limit projects to ensure quality and maintain our 14-day delivery promise. Current availability is shown on our pricing page."
      },
      {
        question: "What makes a good beta client?",
        answer: "Founders who are responsive to feedback, communicate quickly, understand the building process, and are excited about trying new approaches to rapid development."
      }
    ]
  }
]

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (categoryIndex: number, faqIndex: number) => {
    const itemId = `${categoryIndex}-${faqIndex}`
    if (openItems.includes(itemId)) {
      setOpenItems(openItems.filter(item => item !== itemId))
    } else {
      setOpenItems([...openItems, itemId])
    }
  }

  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about our process, guarantees, and deliverables
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                {category.title}
              </h3>
              
              <div className="space-y-2">
                {category.faqs.map((faq, faqIndex) => {
                  const itemId = `${categoryIndex}-${faqIndex}`
                  return (
                    <Card 
                      key={faqIndex}
                      className="bg-white border border-gray-200 hover:border-blue-300 transition-all duration-200 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(categoryIndex, faqIndex)}
                        className="w-full px-4 py-4 sm:py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px]"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-base sm:text-lg font-semibold text-gray-900 pr-4">
                            {faq.question}
                          </h4>
                          <div className="flex-shrink-0">
                            {openItems.includes(itemId) ? (
                              <ChevronUp className="w-5 h-5 text-blue-600" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {openItems.includes(itemId) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="px-4 pb-2">
                              <div className="border-t border-gray-100 pt-2">
                                <p className="text-gray-600 text-base leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-blue-600 rounded-2xl p-8 max-w-2xl mx-auto text-white">
            <h3 className="text-2xl font-bold mb-4">
              Still Have Questions?
            </h3>
            <p className="mb-6 opacity-90">
              Get all your questions answered in a 15-minute consultation call.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/apply'}
                className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Start Application
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = 'mailto:hello@mymvp.io'}
                className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Email Us
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}