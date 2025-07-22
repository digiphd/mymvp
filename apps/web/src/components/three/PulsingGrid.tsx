'use client'

import { motion } from 'framer-motion'

export default function PulsingGrid() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-green-600 font-medium">AI Grid Processing</p>
        <p className="text-sm text-green-500 mt-1">Analyzing system patterns...</p>
      </div>
    </motion.div>
  )
}
