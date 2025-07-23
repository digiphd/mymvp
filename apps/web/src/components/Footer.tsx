'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Mail, Twitter, Linkedin, Github, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Image 
                  src="/logo.png" 
                  alt="myMVP Logo" 
                  width={32} 
                  height={32}
                  className="w-8 h-8"
                />
                <div className="text-2xl font-bold">
                  <span className="text-white">my</span>
                  <span className="text-blue-400">MVP</span>
                </div>
              </div>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                AI-powered development systems that turn your vision into a functional MVP in 14 days. 
                Stop planning, start building.
              </p>
              
              {/* CTA in Footer */}
              <motion.div whileHover={{ scale: 1.02 }}>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 group"
                  onClick={() => window.location.href = '/apply'}
                >
                  Apply to Work With Us
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Navigation Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-4 text-white">Navigation</h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => scrollToSection('#how-it-works')}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('#what-we-dont-do')}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                  >
                    What We Don't Do
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('#pricing')}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('#contact')}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Company Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/apply" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                    Apply Now
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                    About Us
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Contact & Social Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 pt-8 mt-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Contact Info */}
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <a href="mailto:hello@mymvp.io" className="text-gray-300 hover:text-blue-400 transition-colors">
                    hello@mymvp.io
                  </a>
                </div>
                <div className="text-gray-500">|</div>
                <div className="text-gray-300">Ready to build in 14 days</div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm mr-2">Follow us:</span>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://twitter.com/mymvp"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors duration-200"
              >
                <Twitter className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://linkedin.com/company/mymvp"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors duration-200"
              >
                <Linkedin className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com/mymvp"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors duration-200"
              >
                <Github className="w-4 h-4" />
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div>
              © {currentYear} myMVP. All rights reserved.
            </div>
            <div className="mt-2 md:mt-0">
              <span className="mr-4">Built with AI in 14 days</span>
              <span className="text-blue-400">•</span>
              <span className="ml-4">Your competition is still planning</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}