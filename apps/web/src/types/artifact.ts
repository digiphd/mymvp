export interface Artifact {
  id: string
  title: string
  type: 'prd' | 'proposal' | 'specification'
  status: 'draft' | 'complete' | 'reviewed'
  lastUpdated: Date
  content: ProductRequirementsDocument
}

export interface ProductRequirementsDocument {
  projectName: string
  overview: {
    description: string
    problem: string
    solution: string
    targetAudience: string
  }
  objectives: {
    primary: string[]
    secondary: string[]
    successMetrics: string[]
  }
  features: {
    core: FeatureItem[]
    nice_to_have: FeatureItem[]
  }
  userStories: UserStory[]
  technicalRequirements: {
    frontend: string[]
    backend: string[]
    database: string[]
    integrations: string[]
  }
  timeline: {
    phase1: TimelinePhase
    phase2?: TimelinePhase
    phase3?: TimelinePhase
  }
  budget: {
    estimatedCost: string
    breakdown: BudgetBreakdown[]
  }
  risks: RiskItem[]
  assumptions: string[]
  constraints: string[]
}

export interface FeatureItem {
  id: string
  name: string
  description: string
  priority: 'high' | 'medium' | 'low'
  complexity: 'simple' | 'medium' | 'complex'
  estimatedHours?: number
}

export interface UserStory {
  id: string
  as: string // "As a [user type]"
  want: string // "I want [functionality]"
  so: string // "So that [benefit]"
  acceptanceCriteria: string[]
}

export interface TimelinePhase {
  name: string
  duration: string
  deliverables: string[]
  milestones: string[]
}

export interface BudgetBreakdown {
  category: string
  amount: string
  description: string
}

export interface RiskItem {
  id: string
  risk: string
  impact: 'low' | 'medium' | 'high'
  probability: 'low' | 'medium' | 'high'
  mitigation: string
}

// Empty artifact template
export const createEmptyArtifact = (): Artifact => ({
  id: `prd-${Date.now()}`,
  title: 'Product Requirements Document',
  type: 'prd',
  status: 'draft',
  lastUpdated: new Date(),
  content: emptyPRD
})

// Empty PRD template
export const emptyPRD: ProductRequirementsDocument = {
  projectName: '',
  overview: {
    description: '',
    problem: '',
    solution: '',
    targetAudience: ''
  },
  objectives: {
    primary: [],
    secondary: [],
    successMetrics: []
  },
  features: {
    core: [],
    nice_to_have: []
  },
  userStories: [],
  technicalRequirements: {
    frontend: [],
    backend: [],
    database: [],
    integrations: []
  },
  timeline: {
    phase1: {
      name: '',
      duration: '',
      deliverables: [],
      milestones: []
    }
  },
  budget: {
    estimatedCost: '',
    breakdown: []
  },
  risks: [],
  assumptions: [],
  constraints: []
}
