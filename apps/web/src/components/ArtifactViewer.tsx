'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Download, 
  Copy, 
  ChevronDown, 
  ChevronRight,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { Artifact, FeatureItem, UserStory, RiskItem, BudgetBreakdown } from '@/types/artifact'

interface ArtifactViewerProps {
  artifact: Artifact | null
  className?: string
}

export function ArtifactViewer({ artifact, className = '' }: ArtifactViewerProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']))

  if (!artifact) {
    return (
      <div className={`bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${className}`}>
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">PRD Artifact</h3>
        <p className="text-gray-500">
          Your Product Requirements Document will appear here as we build it together through our conversation.
        </p>
      </div>
    )
  }

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const { content } = artifact

  const statusColors: Record<'draft' | 'complete' | 'reviewed', string> = {
    draft: 'bg-yellow-100 text-yellow-800',
    complete: 'bg-green-100 text-green-800',
    reviewed: 'bg-blue-100 text-blue-800'
  }

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  }

  const riskColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  }

  return (
    <div className={`bg-white border rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-blue-600" />
            <div>
              <h2 className="font-semibold text-gray-900">{artifact.title}</h2>
              <p className="text-sm text-gray-500">
                Last updated: {artifact.lastUpdated.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[artifact.status]}`}>
              {artifact.status}
            </span>
            <Button variant="ghost" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Project Name */}
        {content.projectName && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{content.projectName}</h1>
          </div>
        )}

        {/* Overview Section */}
        <Section
          title="Overview"
          isExpanded={expandedSections.has('overview')}
          onToggle={() => toggleSection('overview')}
        >
          {content.overview.description && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-700">{content.overview.description}</p>
            </div>
          )}
          {content.overview.problem && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Problem Statement</h4>
              <p className="text-gray-700">{content.overview.problem}</p>
            </div>
          )}
          {content.overview.solution && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Proposed Solution</h4>
              <p className="text-gray-700">{content.overview.solution}</p>
            </div>
          )}
          {content.overview.targetAudience && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Target Audience</h4>
              <p className="text-gray-700">{content.overview.targetAudience}</p>
            </div>
          )}
        </Section>

        {/* Objectives Section */}
        {(content.objectives.primary.length > 0 || content.objectives.secondary.length > 0) && (
          <Section
            title="Objectives"
            isExpanded={expandedSections.has('objectives')}
            onToggle={() => toggleSection('objectives')}
          >
            {content.objectives.primary.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Primary Objectives</h4>
                <ul className="list-disc list-inside space-y-1">
                  {content.objectives.primary.map((objective: string, index: number) => (
                    <li key={index} className="text-gray-700">{objective}</li>
                  ))}
                </ul>
              </div>
            )}
            {content.objectives.secondary.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Secondary Objectives</h4>
                <ul className="list-disc list-inside space-y-1">
                  {content.objectives.secondary.map((objective: string, index: number) => (
                    <li key={index} className="text-gray-700">{objective}</li>
                  ))}
                </ul>
              </div>
            )}
            {content.objectives.successMetrics.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Success Metrics</h4>
                <ul className="list-disc list-inside space-y-1">
                  {content.objectives.successMetrics.map((metric: string, index: number) => (
                    <li key={index} className="text-gray-700">{metric}</li>
                  ))}
                </ul>
              </div>
            )}
          </Section>
        )}

        {/* Features Section */}
        {(content.features.core.length > 0 || content.features.nice_to_have.length > 0) && (
          <Section
            title="Features"
            isExpanded={expandedSections.has('features')}
            onToggle={() => toggleSection('features')}
          >
            {content.features.core.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Core Features</h4>
                <div className="space-y-2">
                  {content.features.core.map((feature: FeatureItem) => (
                    <FeatureCard key={feature.id} feature={feature} />
                  ))}
                </div>
              </div>
            )}
            {content.features.nice_to_have.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Nice-to-Have Features</h4>
                <div className="space-y-2">
                  {content.features.nice_to_have.map((feature: FeatureItem) => (
                    <FeatureCard key={feature.id} feature={feature} />
                  ))}
                </div>
              </div>
            )}
          </Section>
        )}

        {/* User Stories Section */}
        {content.userStories.length > 0 && (
          <Section
            title="User Stories"
            isExpanded={expandedSections.has('userStories')}
            onToggle={() => toggleSection('userStories')}
          >
            <div className="space-y-3">
              {content.userStories.map((story: UserStory) => (
                <UserStoryCard key={story.id} story={story} />
              ))}
            </div>
          </Section>
        )}

        {/* Technical Requirements */}
        {Object.values(content.technicalRequirements).some((arr: string[]) => arr.length > 0) && (
          <Section
            title="Technical Requirements"
            isExpanded={expandedSections.has('technical')}
            onToggle={() => toggleSection('technical')}
          >
            {content.technicalRequirements.frontend.length > 0 && (
              <TechSection title="Frontend" items={content.technicalRequirements.frontend} />
            )}
            {content.technicalRequirements.backend.length > 0 && (
              <TechSection title="Backend" items={content.technicalRequirements.backend} />
            )}
            {content.technicalRequirements.database.length > 0 && (
              <TechSection title="Database" items={content.technicalRequirements.database} />
            )}
            {content.technicalRequirements.integrations.length > 0 && (
              <TechSection title="Integrations" items={content.technicalRequirements.integrations} />
            )}
          </Section>
        )}

        {/* Timeline */}
        {content.timeline.phase1.name && (
          <Section
            title="Timeline"
            isExpanded={expandedSections.has('timeline')}
            onToggle={() => toggleSection('timeline')}
          >
            <div className="space-y-3">
              <PhaseCard phase={content.timeline.phase1} />
              {content.timeline.phase2 && <PhaseCard phase={content.timeline.phase2} />}
              {content.timeline.phase3 && <PhaseCard phase={content.timeline.phase3} />}
            </div>
          </Section>
        )}

        {/* Budget */}
        {content.budget.estimatedCost && (
          <Section
            title="Budget"
            isExpanded={expandedSections.has('budget')}
            onToggle={() => toggleSection('budget')}
          >
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Estimated Cost</h4>
              <p className="text-2xl font-bold text-green-600">{content.budget.estimatedCost}</p>
            </div>
            {content.budget.breakdown.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Breakdown</h4>
                <div className="space-y-2">
                  {content.budget.breakdown.map((item: BudgetBreakdown, index: number) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <span className="font-medium">{item.category}</span>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <span className="font-semibold">{item.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Section>
        )}

        {/* Risks */}
        {content.risks.length > 0 && (
          <Section
            title="Risks & Mitigation"
            isExpanded={expandedSections.has('risks')}
            onToggle={() => toggleSection('risks')}
          >
            <div className="space-y-2">
              {content.risks.map((risk: RiskItem) => (
                <RiskCard key={risk.id} risk={risk} />
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  )
}

// Helper Components
function Section({ title, children, isExpanded, onToggle }: {
  title: string
  children: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
      >
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-500" />
        )}
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 border-t border-gray-200">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FeatureCard({ feature }: { feature: FeatureItem }) {
  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  }

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
      <div className="flex items-start justify-between mb-2">
        <h5 className="font-medium text-gray-900">{feature.name}</h5>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[feature.priority]}`}>
          {feature.priority}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <span>Complexity: {feature.complexity}</span>
        {feature.estimatedHours && <span>• {feature.estimatedHours}h</span>}
      </div>
    </div>
  )
}

function UserStoryCard({ story }: { story: UserStory }) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-blue-50">
      <p className="text-sm text-gray-700 mb-2">
        <span className="font-medium">As a</span> {story.as}, <span className="font-medium">I want</span> {story.want}, <span className="font-medium">so that</span> {story.so}
      </p>
      {story.acceptanceCriteria.length > 0 && (
        <div>
          <h6 className="text-xs font-medium text-gray-600 mb-1">Acceptance Criteria:</h6>
          <ul className="text-xs text-gray-600 list-disc list-inside">
            {story.acceptanceCriteria.map((criteria, index) => (
              <li key={index}>{criteria}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function TechSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mb-4">
      <h5 className="font-medium text-gray-900 mb-2">{title}</h5>
      <ul className="list-disc list-inside space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-sm text-gray-700">{item}</li>
        ))}
      </ul>
    </div>
  )
}

function PhaseCard({ phase }: { phase: any }) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
      <div className="flex items-center space-x-2 mb-2">
        <Clock className="h-4 w-4 text-blue-600" />
        <h5 className="font-medium text-gray-900">{phase.name}</h5>
        <span className="text-sm text-gray-500">({phase.duration})</span>
      </div>
      {phase.deliverables.length > 0 && (
        <div className="mb-2">
          <h6 className="text-sm font-medium text-gray-700">Deliverables:</h6>
          <ul className="text-sm text-gray-600 list-disc list-inside">
            {phase.deliverables.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {phase.milestones.length > 0 && (
        <div>
          <h6 className="text-sm font-medium text-gray-700">Milestones:</h6>
          <ul className="text-sm text-gray-600 list-disc list-inside">
            {phase.milestones.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function RiskCard({ risk }: { risk: RiskItem }) {
  const riskColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  }

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-red-50">
      <div className="flex items-start justify-between mb-2">
        <h5 className="font-medium text-gray-900">{risk.risk}</h5>
        <div className="flex space-x-1">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${riskColors[risk.impact]}`}>
            {risk.impact} impact
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${riskColors[risk.probability]}`}>
            {risk.probability} probability
          </span>
        </div>
      </div>
      <div>
        <h6 className="text-sm font-medium text-gray-700">Mitigation:</h6>
        <p className="text-sm text-gray-600">{risk.mitigation}</p>
      </div>
    </div>
  )
}
