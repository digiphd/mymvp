'use client'

import { motion } from 'framer-motion'

export default function RetroAssemblyLine() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-100 rounded-lg"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-orange-600 font-medium">AI Assembly Pipeline</p>
        <p className="text-sm text-orange-500 mt-1">Building components...</p>
      </div>
    </motion.div>
  )
}
