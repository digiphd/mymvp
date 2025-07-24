'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Zap, Code, Palette, Rocket, Database, Shield, Smartphone, TestTube } from 'lucide-react'

const processPhases = [
  {
    days: "Days 1-2",
    title: "Requirements & Frontend Design",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-600",
    icon: Palette,
    tasks: [
      "Requirements capture and analysis",
      "Feature prioritization and scope definition",
      "AI-generated UI design and user flows",
      "Interactive frontend prototype (PoC)",
      "Customer feedback and design approval"
    ]
  },
  {
    days: "Days 3-8", 
    title: "Backend Development",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-600",
    icon: Code,
    tasks: [
      "Database schema and API design",
      "Backend API development",
      "Database implementation",
      "Authentication system",
      "Payment integration",
      "Core feature development"
    ]
  },
  {
    days: "Days 9-12",
    title: "Integration & Polish", 
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-600",
    icon: Zap,
    tasks: [
      "Frontend/backend integration",
      "Mobile responsive design",
      "User flow optimization",
      "Performance optimization",
      "Bug fixes and refinements"
    ]
  },
  {
    days: "Days 13-14",
    title: "Testing & Launch",
    color: "from-orange-500 to-orange-600", 
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-600",
    icon: Rocket,
    tasks: [
      "Quality assurance testing",
      "Final performance optimization",
      "Production deployment",
      "Documentation and handover"
    ]
  }
]

const dailyMilestones = [
  { day: 1, icon: Zap, task: "Project kickoff & requirements" },
  { day: 2, icon: Palette, task: "Frontend PoC & customer feedback" },
  { day: 3, icon: Database, task: "Database schema & API design" },
  { day: 4, icon: Shield, task: "Authentication system" },
  { day: 5, icon: Code, task: "Core features development" },
  { day: 6, icon: Code, task: "Payment integration" },
  { day: 7, icon: Code, task: "Backend API completion" },
  { day: 8, icon: TestTube, task: "Backend testing" },
  { day: 9, icon: Code, task: "Frontend/backend integration" },
  { day: 10, icon: Smartphone, task: "Mobile responsive design" },
  { day: 11, icon: Palette, task: "User flow optimization" },
  { day: 12, icon: Zap, task: "Performance optimization" },
  { day: 13, icon: TestTube, task: "QA testing & bug fixes" },
  { day: 14, icon: Rocket, task: "Production deployment" }
]

export default function ProcessSection() {
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
            Our <span className="text-blue-600">14-Day</span> Process
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            How we transform your idea into a working MVP in two weeks
          </p>
        </motion.div>

        {/* Process Phases */}
        <div className="relative mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {processPhases.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className={`p-4 sm:p-6 ${phase.bgColor} ${phase.borderColor} border-2 hover:shadow-lg transition-all duration-300 h-full relative z-10`}>
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${phase.color} flex items-center justify-center`}>
                      <phase.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className={`text-sm font-semibold ${phase.textColor} mb-2`}>
                      {phase.days}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {phase.title}
                    </h3>
                  </div>
                  
                  <ul className="space-y-3">
                    {phase.tasks.map((task, taskIndex) => (
                      <motion.li
                        key={taskIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index * 0.1) + (taskIndex * 0.1), duration: 0.4 }}
                        viewport={{ once: true }}
                        className="flex items-center text-sm text-gray-700"
                      >
                        <div className={`w-2 h-2 rounded-full ${phase.color} bg-gradient-to-r mr-3 flex-shrink-0`}></div>
                        {task}
                      </motion.li>
                    ))}
                  </ul>
                </Card>

                {/* Arrow connecting to next phase */}
                {index < processPhases.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (index + 1) * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="hidden lg:block absolute top-1/2 left-full transform -translate-y-1/2 translate-x-4 z-20"
                  >
                    <div className="flex items-center">
                      <div className="w-4 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                      <div className="w-0 h-0 border-l-[8px] border-l-blue-600 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"></div>
                    </div>
                  </motion.div>
                )}

                {/* Mobile arrows (vertical for smaller screens) */}
                {index < processPhases.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (index + 1) * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="hidden sm:block lg:hidden absolute top-full left-1/2 transform -translate-x-1/2 translate-y-4 z-20"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-0.5 h-8 bg-gradient-to-b from-blue-400 to-blue-600"></div>
                      <div className="w-0 h-0 border-t-[8px] border-t-blue-600 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent"></div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>


        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">
              Ready to Start Your 14-Day Journey?
            </h3>
            <p className="text-gray-600 mb-6">
              While your competition spends months planning, you could be launching in two weeks.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => window.location.href = '/apply'}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition-all duration-200"
              >
                Start My MVP Today
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}