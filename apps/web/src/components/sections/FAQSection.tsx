'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    question: "How can you build quality applications so fast?",
    answer: "We use AI-accelerated development combined with proven frameworks and pre-built components. Instead of coding everything from scratch, our AI systems generate architecture, boilerplate code, and integrations, while our engineers focus on your unique business logic. This isn't about cutting corners—it's about eliminating redundant work that agencies typically charge you for."
  },
  {
    question: "What if I need changes after the 14 days?",
    answer: "Every project includes 30 days of iterations based on user feedback at no additional cost. For changes beyond the original scope or after 30 days, we offer ongoing development at $150/hour or fixed-price quotes for larger feature additions. You own the code, so you can also work with any developer you choose."
  },
  {
    question: "Do I own all the code and intellectual property?",
    answer: "Yes, absolutely. Upon final payment, you receive complete ownership of all custom code, databases, designs, and documentation created specifically for your project. We only retain rights to our proprietary development methodologies and any open-source components (which you can use freely under their respective licenses)."
  },
  {
    question: "What technologies do you use?",
    answer: "We use modern, battle-tested technologies: Next.js 14 with TypeScript for frontend, Node.js/Python for backend APIs, PostgreSQL or MongoDB for databases, and AWS/Vercel for hosting. All applications include authentication (Auth0/NextAuth), payment processing (Stripe), and are mobile-responsive by default. We choose technologies based on your specific needs and scaling requirements."
  },
  {
    question: "Can you sign an NDA?",
    answer: "Absolutely. We sign NDAs as a standard part of our process before any project discussions begin. Your business ideas, technical specifications, and proprietary information are completely protected. We've worked with Fortune 500 companies and early-stage startups—confidentiality is non-negotiable."
  },
  {
    question: "What types of applications can you build?",
    answer: "We specialize in SaaS applications, marketplaces, internal tools, and data-driven applications. Examples include: project management tools, e-commerce platforms, booking systems, CRM software, analytics dashboards, and API-driven applications. If it involves user authentication, payments, and core business logic, we can build it."
  },
  {
    question: "Do you provide ongoing support and maintenance?",
    answer: "Yes, we offer optional maintenance plans starting at $500/month including security updates, bug fixes, performance monitoring, and 99.9% uptime guarantee. However, because you own the code, you're never locked in—you can maintain it yourself or work with any developer team."
  },
  {
    question: "How do you handle project scope creep?",
    answer: "We define scope very clearly during the discovery phase and stick to it. That's how we deliver in 14 days. If you want to add features during development, we'll provide a time and cost estimate, then either adjust the timeline or save additional features for the post-launch iteration period."
  },
  {
    question: "What happens if you can't deliver in 14 days?",
    answer: "If we don't deliver a working MVP that meets the agreed specifications within 14 days, you don't pay. Period. In our 3+ years of operation, we've never missed a deadline when the client provides required information on schedule."
  },
  {
    question: "Can you integrate with existing systems or APIs?",
    answer: "Yes, we regularly integrate with CRMs (Salesforce, HubSpot), payment processors (Stripe, PayPal), communication tools (Slack, email services), analytics platforms, and custom APIs. Integration complexity is assessed during the discovery phase and included in the project timeline."
  },
  {
    question: "Do you work with international clients?",
    answer: "Yes, we work with clients globally. All communication is in English, and we accommodate different time zones for project kickoff calls and daily updates. Payment is processed in USD through secure international payment systems."
  },
  {
    question: "What if I'm not technical—can I still work with you?",
    answer: "Absolutely. Most of our clients are non-technical founders. We translate your business requirements into technical specifications, provide regular updates in plain English, and deliver comprehensive documentation. You don't need to understand code—you just need to understand your business."
  }
]

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    if (openItems.includes(index)) {
      setOpenItems(openItems.filter(item => item !== index))
    } else {
      setOpenItems([...openItems, index])
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
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about our process, guarantees, and deliverables
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <Card className="bg-white border border-gray-200 hover:border-blue-300 transition-all duration-200 overflow-hidden">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openItems.includes(index) ? (
                        <ChevronUp className="w-5 h-5 text-blue-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>
                
                <AnimatePresence>
                  {openItems.includes(index) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6">
                        <div className="border-t border-gray-100 pt-4">
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
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