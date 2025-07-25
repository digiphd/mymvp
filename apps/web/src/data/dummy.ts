export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'developer' | 'admin';
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
  timezone?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  customerId: string;
  assignedDeveloperId?: string;
  title: string;
  description: string;
  type: 'poc' | 'mvp';
  status: 'planning' | 'assigned' | 'building' | 'testing' | 'review' | 'delivered' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  priceCents: number;
  developerBudgetCents?: number;
  startDate?: string;
  deliveryDate?: string;
  previewUrl?: string;
  repoUrl?: string;
  requirementsDoc?: string;
  technicalRequirements?: {
    stack: string[];
    apis: string[];
    integrations: string[];
  };
  estimatedHours?: number;
  actualHours: number;
  createdAt: string;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  assignedDeveloperId?: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  estimatedHours?: number;
  actualHours: number;
  dueDate?: string;
  dependencies?: string[];
  labels?: string[];
  createdBy: string;
  createdAt: string;
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  authorId: string;
  title: string;
  content: string;
  type: 'status_update' | 'milestone' | 'issue' | 'delivery' | 'task_completed' | 'dev_note';
  isVisibleToCustomer: boolean;
  taskId?: string;
  hoursLogged?: number;
  attachments?: string[];
  createdAt: string;
}

export interface Message {
  id: string;
  projectId: string;
  senderId: string;
  content: string;
  messageType: 'general' | 'technical' | 'feedback' | 'question';
  isInternal: boolean;
  attachments?: string[];
  createdAt: string;
}

// Dummy Users
export const dummyUsers: User[] = [
  {
    id: 'user-1',
    email: 'john@startup.com',
    name: 'John Smith',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'user-2',
    email: 'sarah@techcorp.com',
    name: 'Sarah Johnson',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b25fd0a2?w=150&h=150&fit=crop&crop=face',
    isActive: true,
    createdAt: '2024-02-01T09:30:00Z'
  },
  {
    id: 'dev-1',
    email: 'alex@mymvp.io',
    name: 'Alex Chen',
    role: 'developer',
    bio: 'Full-stack developer specializing in React and Node.js',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    hourlyRate: 8500,
    timezone: 'America/Los_Angeles',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isActive: true,
    createdAt: '2023-12-01T08:00:00Z'
  },
  {
    id: 'dev-2',
    email: 'maria@mymvp.io',
    name: 'Maria Rodriguez',
    role: 'developer',
    bio: 'Senior developer with expertise in modern web technologies',
    skills: ['React', 'Python', 'Django', 'MongoDB', 'Docker'],
    hourlyRate: 9000,
    timezone: 'America/New_York',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    isActive: true,
    createdAt: '2023-11-15T07:30:00Z'
  },
  {
    id: 'admin-1',
    email: 'roger@mymvp.io',
    name: 'Roger Admin',
    role: 'admin',
    avatarUrl: '/roger_profile.jpg',
    isActive: true,
    createdAt: '2023-10-01T06:00:00Z'
  }
];

// Dummy Projects
export const dummyProjects: Project[] = [
  {
    id: 'proj-1',
    customerId: 'user-1',
    assignedDeveloperId: 'dev-1',
    title: 'SaaS Analytics Dashboard',
    description: 'A comprehensive analytics dashboard for tracking user engagement and business metrics.',
    type: 'mvp',
    status: 'building',
    priority: 'high',
    priceCents: 1200000,
    developerBudgetCents: 600000,
    startDate: '2024-07-01',
    deliveryDate: '2024-07-15',
    previewUrl: 'https://mymvp.io',
    repoUrl: 'https://github.com/mymvp/analytics-dashboard',
    requirementsDoc: `## Target Users
Primary: Early-stage SaaS founders (5-50 employees)
Secondary: Product managers at established companies

## Core User Stories
- As a founder, I want to see user engagement metrics so I can understand product-market fit
- As a product manager, I want to track revenue trends so I can make data-driven decisions
- As a team lead, I want custom reports so I can share insights with stakeholders

## Key Features
1. **Real-time Analytics Dashboard**
   - Daily/weekly/monthly user activity charts
   - Revenue tracking with growth indicators
   - Conversion funnel visualization

2. **Custom Report Builder**
   - Drag-and-drop interface for creating reports
   - Export to PDF/CSV functionality
   - Scheduled report delivery via email

3. **User Management**
   - Role-based access (Admin, Viewer, Editor)
   - Team collaboration features
   - Audit logs for data changes

## UI/UX Requirements
- Clean, modern interface similar to Stripe Dashboard
- Mobile-responsive design for on-the-go access  
- Dark/light theme support
- Accessibility compliance (WCAG 2.1 AA)

## Technical Specifications
- Sub-second loading times for all charts
- Real-time data updates via WebSocket
- API-first architecture for future integrations
- 99.9% uptime requirement`,
    technicalRequirements: {
      stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Chart.js'],
      apis: ['Stripe API', 'Google Analytics API'],
      integrations: ['Stripe', 'Google Analytics', 'Sendgrid']
    },
    estimatedHours: 80,
    actualHours: 45,
    createdAt: '2024-06-28T10:00:00Z'
  },
  {
    id: 'proj-2',
    customerId: 'user-2',
    assignedDeveloperId: 'dev-2',
    title: 'E-commerce Mobile App',
    description: 'React Native mobile app for online shopping with payment integration.',
    type: 'mvp',
    status: 'testing',
    priority: 'medium',
    priceCents: 1500000,
    developerBudgetCents: 750000,
    startDate: '2024-06-15',
    deliveryDate: '2024-06-29',
    previewUrl: 'https://vercel.com',
    requirementsDoc: `## Target Market
Primary: Fashion-conscious millennials (ages 25-40)
Secondary: Busy professionals seeking convenient shopping

## User Personas
**"Trendy Sarah"** - 28, Marketing Manager
- Shops during commute and lunch breaks
- Values quick checkout and saved payment methods
- Follows fashion influencers for product discovery

**"Busy Mike"** - 35, Entrepreneur  
- Limited time for shopping
- Prefers curated recommendations
- Needs reliable delivery tracking

## Core Features
1. **Product Catalog & Search**
   - Category-based browsing
   - Visual search with image upload
   - Smart filters (size, color, price, brand)
   - Wishlist and favorites

2. **Shopping Cart & Checkout**
   - Guest checkout option
   - Multiple payment methods (Apple Pay, Google Pay, Cards)
   - Shipping calculator with multiple options
   - Order confirmation and tracking

3. **User Account Management**
   - Social login (Google, Apple, Facebook)
   - Order history and reorder functionality
   - Address book management
   - Push notifications for deals and updates

## Design Requirements
- Instagram-inspired visual layout
- Smooth animations and transitions
- One-handed usage optimization
- Offline browsing capability

## Business Requirements
- Commission-based vendor system
- Inventory management integration
- Analytics dashboard for vendors
- Customer support chat integration`,
    technicalRequirements: {
      stack: ['React Native', 'TypeScript', 'Firebase', 'Stripe'],
      apis: ['Stripe API', 'Firebase API'],
      integrations: ['Stripe', 'Firebase', 'Push Notifications']
    },
    estimatedHours: 100,
    actualHours: 92,
    createdAt: '2024-06-10T14:30:00Z'
  },
  {
    id: 'proj-3',
    customerId: 'user-1',
    title: 'AI Content Generator',
    description: 'AI-powered tool for generating marketing content and blog posts.',
    type: 'poc',
    status: 'planning',
    priority: 'medium',
    priceCents: 800000,
    startDate: '2024-07-20',
    deliveryDate: '2024-08-03',
    technicalRequirements: {
      stack: ['Next.js', 'TypeScript', 'OpenAI API'],
      apis: ['OpenAI API'],
      integrations: ['OpenAI', 'Stripe']
    },
    estimatedHours: 60,
    actualHours: 0,
    createdAt: '2024-07-18T16:20:00Z'
  }
];

// Dummy Tasks
export const dummyTasks: ProjectTask[] = [
  {
    id: 'task-1',
    projectId: 'proj-1',
    assignedDeveloperId: 'dev-1',
    title: 'Setup authentication system',
    description: 'Implement JWT-based authentication with role-based access control',
    status: 'completed',
    priority: 'high',
    estimatedHours: 12,
    actualHours: 10,
    labels: ['backend', 'auth'],
    createdBy: 'admin-1',
    createdAt: '2024-07-01T10:00:00Z'
  },
  {
    id: 'task-2',
    projectId: 'proj-1',
    assignedDeveloperId: 'dev-1',
    title: 'Build dashboard UI components',
    description: 'Create reusable chart components and data visualization',
    status: 'in_progress',
    priority: 'high',
    estimatedHours: 20,
    actualHours: 15,
    labels: ['frontend', 'ui'],
    createdBy: 'admin-1',
    createdAt: '2024-07-02T09:00:00Z'
  },
  {
    id: 'task-3',
    projectId: 'proj-1',
    assignedDeveloperId: 'dev-1',
    title: 'Integrate analytics APIs',
    description: 'Connect Google Analytics and custom tracking APIs',
    status: 'todo',
    priority: 'medium',
    estimatedHours: 16,
    actualHours: 0,
    labels: ['backend', 'integration'],
    createdBy: 'admin-1',
    createdAt: '2024-07-01T11:00:00Z'
  },
  {
    id: 'task-4',
    projectId: 'proj-2',
    assignedDeveloperId: 'dev-2',
    title: 'Shopping cart functionality',
    description: 'Implement add to cart, remove items, and checkout flow',
    status: 'review',
    priority: 'high',
    estimatedHours: 18,
    actualHours: 20,
    labels: ['frontend', 'ecommerce'],
    createdBy: 'admin-1',
    createdAt: '2024-06-16T14:00:00Z'
  },
  {
    id: 'task-5',
    projectId: 'proj-2',
    assignedDeveloperId: 'dev-2',
    title: 'Payment integration testing',
    description: 'Test Stripe payment integration with various scenarios',
    status: 'in_progress',
    priority: 'high',
    estimatedHours: 8,
    actualHours: 6,
    labels: ['testing', 'payments'],
    createdBy: 'admin-1',
    createdAt: '2024-06-25T10:00:00Z'
  }
];

// Dummy Updates
export const dummyUpdates: ProjectUpdate[] = [
  {
    id: 'update-1',
    projectId: 'proj-1',
    authorId: 'dev-1',
    title: 'Authentication System Complete',
    content: 'Successfully implemented JWT authentication with role-based access control. Users can now sign up, log in, and access features based on their roles.',
    type: 'milestone',
    isVisibleToCustomer: true,
    taskId: 'task-1',
    hoursLogged: 10,
    createdAt: '2024-07-05T16:30:00Z'
  },
  {
    id: 'update-2',
    projectId: 'proj-1',
    authorId: 'dev-1',
    title: 'Dashboard UI Progress',
    content: 'Working on the chart components. Have completed the revenue chart and user engagement graphs. Working on the custom reports section next.',
    type: 'status_update',
    isVisibleToCustomer: true,
    taskId: 'task-2',
    hoursLogged: 8,
    createdAt: '2024-07-10T14:20:00Z'
  },
  {
    id: 'update-3',
    projectId: 'proj-2',
    authorId: 'dev-2',
    title: 'Shopping Cart Ready for Review',
    content: 'Shopping cart functionality is complete and ready for testing. All edge cases have been handled including inventory validation.',
    type: 'task_completed',
    isVisibleToCustomer: true,
    taskId: 'task-4',
    hoursLogged: 20,
    createdAt: '2024-06-28T11:45:00Z'
  }
];

// Dummy Messages
export const dummyMessages: Message[] = [
  {
    id: 'msg-1',
    projectId: 'proj-1',
    senderId: 'user-1',
    content: 'Hi Alex! The authentication flow looks great. One question - can we add social login options like Google and GitHub?',
    messageType: 'question',
    isInternal: false,
    createdAt: '2024-07-06T09:15:00Z'
  },
  {
    id: 'msg-2',
    projectId: 'proj-1',
    senderId: 'dev-1',
    content: 'Absolutely! I can add Google and GitHub OAuth. It will take about 4 additional hours. Should I proceed?',
    messageType: 'technical',
    isInternal: false,
    createdAt: '2024-07-06T10:30:00Z'
  },
  {
    id: 'msg-3',
    projectId: 'proj-1',
    senderId: 'user-1',
    content: 'Yes, please go ahead. That would be perfect for our users.',
    messageType: 'general',
    isInternal: false,
    createdAt: '2024-07-06T11:00:00Z'
  },
  {
    id: 'msg-4',
    projectId: 'proj-2',
    senderId: 'admin-1',
    content: 'Customer is happy with the shopping cart. Moving to payment testing phase.',
    messageType: 'general',
    isInternal: true,
    createdAt: '2024-06-28T15:20:00Z'
  }
];

// Helper functions
export const getUserById = (id: string): User | undefined => 
  dummyUsers.find(user => user.id === id);

export const getProjectsByCustomerId = (customerId: string): Project[] =>
  dummyProjects.filter(project => project.customerId === customerId);

export const getProjectsByDeveloperId = (developerId: string): Project[] =>
  dummyProjects.filter(project => project.assignedDeveloperId === developerId);

export const getTasksByProjectId = (projectId: string): ProjectTask[] =>
  dummyTasks.filter(task => task.projectId === projectId);

export const getUpdatesByProjectId = (projectId: string): ProjectUpdate[] =>
  dummyUpdates.filter(update => update.projectId === projectId);

export const getMessagesByProjectId = (projectId: string): Message[] =>
  dummyMessages.filter(message => message.projectId === projectId);

export const getCurrentUser = (): User => dummyUsers[0]; // Default to customer for demo