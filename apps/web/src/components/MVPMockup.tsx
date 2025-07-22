'use client'

import { motion } from 'framer-motion'
import { BarChart3, Users, TrendingUp, DollarSign } from 'lucide-react'

export default function MVPMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="max-w-4xl mx-auto mt-16"
    >
      {/* Apple Window Frame */}
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden hover:shadow-3xl transition-shadow duration-300">
        {/* Window Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="text-sm text-gray-600 font-medium">MyMVP Analytics Dashboard</div>
          <div className="w-12"></div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 bg-white">
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-blue-50 p-4 rounded-lg border border-blue-100 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 mb-1">Active Users</p>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="text-xl font-bold text-gray-900"
                  >
                    2,847
                  </motion.p>
                </div>
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600">+12%</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-green-50 p-4 rounded-lg border border-green-100 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 mb-1">Revenue</p>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="text-xl font-bold text-gray-900"
                  >
                    $18.2k
                  </motion.p>
                </div>
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600">+24%</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-purple-50 p-4 rounded-lg border border-purple-100 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 mb-1">Conversions</p>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.5 }}
                    className="text-xl font-bold text-gray-900"
                  >
                    3.2%
                  </motion.p>
                </div>
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600">+8%</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-orange-50 p-4 rounded-lg border border-orange-100 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 mb-1">Retention</p>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6, duration: 0.5 }}
                    className="text-xl font-bold text-gray-900"
                  >
                    89%
                  </motion.p>
                </div>
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600">+5%</span>
              </div>
            </motion.div>
          </div>

          {/* Chart Placeholder */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Growth Analytics</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-sm text-gray-600">Revenue</span>
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="text-sm text-gray-600">Users</span>
              </div>
            </div>
            
            {/* Animated Chart Bars */}
            <div className="flex items-end justify-between h-32 space-x-2">
              {[65, 45, 80, 55, 90, 75, 95, 70, 85, 60, 100, 80].map((height, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 2 + index * 0.1, duration: 0.5 }}
                  className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t max-w-8 hover:from-blue-600 hover:to-blue-500 transition-colors cursor-pointer"
                />
              ))}
            </div>
            
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
        className="absolute -bottom-4 -right-4 bg-green-500 text-white px-3 py-2 rounded-full text-sm font-semibold shadow-lg"
      >
        ✨ Built in 14 days
      </motion.div>
    </motion.div>
  )
}