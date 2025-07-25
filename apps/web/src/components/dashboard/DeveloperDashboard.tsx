'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Clock, 
  User, 
  MessageSquare, 
  CheckCircle,
  AlertCircle,
  Calendar,
  Play,
  Pause,
  Users,
  Target,
  TrendingUp,
  Code
} from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Logo } from "@/components/ui/logo"
import { 
  dummyProjects, 
  dummyTasks,
  getUserById, 
  getProjectsByDeveloperId, 
  getTasksByProjectId,
  getCurrentUser,
  Project,
  ProjectTask
} from "@/data/dummy"

const statusColors = {
  planning: 'secondary',
  assigned: 'info',
  building: 'warning',
  testing: 'info',
  review: 'warning',
  delivered: 'success',
  cancelled: 'destructive'
} as const

const taskStatusColors = {
  todo: 'secondary',
  in_progress: 'warning',
  review: 'info',
  completed: 'success',
  blocked: 'destructive'
} as const

const priorityColors = {
  low: 'secondary',
  medium: 'info',
  high: 'warning',
} as const

// Mock developer user - in reality this would come from auth
const currentDeveloper = {
  id: 'dev-1',
  email: 'alex@mymvp.io',
  name: 'Alex Chen',
  role: 'developer' as const,
  bio: 'Full-stack developer specializing in React and Node.js',
  skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
  hourlyRate: 8500,
  timezone: 'America/Los_Angeles',
  avatarUrl: '/avatars/alex.jpg',
  isActive: true,
  createdAt: '2023-12-01T08:00:00Z'
}

export default function DeveloperDashboard() {
  const [isAvailable, setIsAvailable] = React.useState(true)
  
  const developerProjects = getProjectsByDeveloperId(currentDeveloper.id)
  const activeProjects = developerProjects.filter(p => ['assigned', 'building', 'testing', 'review'].includes(p.status))
  
  // Get all tasks for developer's projects
  const allTasks = developerProjects.flatMap(project => 
    getTasksByProjectId(project.id).filter(task => task.assignedDeveloperId === currentDeveloper.id)
  )
  
  const todaysTasks = allTasks.filter(task => 
    task.status === 'in_progress' || 
    (task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString())
  )
  
  const overdueTasks = allTasks.filter(task => 
    task.dueDate && 
    new Date(task.dueDate) < new Date() && 
    task.status !== 'completed'
  )
  
  const completedThisWeek = allTasks.filter(task => {
    if (task.status !== 'completed') return false
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return new Date(task.createdAt) > weekAgo
  })

  const totalHoursThisWeek = allTasks.reduce((sum, task) => sum + task.actualHours, 0)
  const estimatedHoursThisWeek = allTasks
    .filter(task => task.status === 'in_progress' || task.status === 'todo')
    .reduce((sum, task) => sum + (task.estimatedHours || 0), 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo linkHref="/" />
              <span className="text-muted-foreground">Developer Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <Button
                  variant={isAvailable ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setIsAvailable(!isAvailable)}
                  className="flex items-center space-x-2"
                >
                  {isAvailable ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                  <span>{isAvailable ? 'Available' : 'Busy'}</span>
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">Welcome back, {currentDeveloper.name}</span>
              <Avatar>
                <AvatarImage src={currentDeveloper.avatarUrl} alt={currentDeveloper.name} />
                <AvatarFallback>{currentDeveloper.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">Logout</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Manage your projects and track your progress</p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects.length}</div>
              <p className="text-xs text-muted-foreground">
                Currently assigned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaysTasks.length}</div>
              <p className="text-xs text-muted-foreground">
                {overdueTasks.length > 0 && (
                  <span className="text-red-500">{overdueTasks.length} overdue</span>
                )}
                {overdueTasks.length === 0 && "On schedule"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours This Week</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHoursThisWeek}h</div>
              <p className="text-xs text-muted-foreground">
                {estimatedHoursThisWeek}h remaining
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedThisWeek.length}</div>
              <p className="text-xs text-muted-foreground">
                Tasks this week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Active Projects */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Projects</CardTitle>
                <CardDescription>Projects currently assigned to you</CardDescription>
              </CardHeader>
              <CardContent>
                {activeProjects.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No active projects</p>
                    <p className="text-sm">New projects will appear here when assigned</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeProjects.map((project) => {
                      const customer = getUserById(project.customerId)
                      const projectTasks = getTasksByProjectId(project.id).filter(
                        task => task.assignedDeveloperId === currentDeveloper.id
                      )
                      const completedTasks = projectTasks.filter(task => task.status === 'completed')
                      const progress = projectTasks.length > 0 
                        ? (completedTasks.length / projectTasks.length) * 100 
                        : 0
                      
                      const daysUntilDelivery = project.deliveryDate 
                        ? Math.ceil((new Date(project.deliveryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                        : null

                      return (
                        <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{project.title}</h3>
                              <p className="text-sm text-muted-foreground">{project.description}</p>
                              {customer && (
                                <div className="flex items-center space-x-2 mt-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                                    <AvatarFallback className="text-xs">
                                      {customer.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-muted-foreground">{customer.name}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <Badge variant={statusColors[project.status]}>
                                {project.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {project.type.toUpperCase()}
                              </Badge>
                            </div>
                          </div>

                          {/* Progress */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Task Progress</span>
                              <span className="text-sm text-muted-foreground">
                                {completedTasks.length}/{projectTasks.length} tasks
                              </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>

                          {/* Project Details */}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{project.actualHours}h logged</span>
                              </div>
                              {daysUntilDelivery !== null && (
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    {daysUntilDelivery > 0 
                                      ? `${daysUntilDelivery} days left` 
                                      : daysUntilDelivery === 0 
                                        ? 'Due today' 
                                        : 'Overdue'}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                View Tasks
                              </Button>
                              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                                <MessageSquare className="h-3 w-3" />
                                <span>Message</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Today's Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Tasks</CardTitle>
                <CardDescription>Tasks scheduled for today and in progress</CardDescription>
              </CardHeader>
              <CardContent>
                {todaysTasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No tasks for today</p>
                    <p className="text-sm">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todaysTasks.map((task) => {
                      const project = dummyProjects.find(p => p.id === task.projectId)
                      const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()
                      
                      return (
                        <div key={task.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium">{task.title}</h4>
                              <Badge variant={taskStatusColors[task.status]} className="text-xs">
                                {task.status.replace('_', ' ')}
                              </Badge>
                              {task.priority !== 'low' && (
                                <Badge variant={priorityColors[task.priority]} className="text-xs">
                                  {task.priority}
                                </Badge>
                              )}
                            </div>
                            {task.description && (
                              <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                            )}
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>{project?.title}</span>
                              {task.estimatedHours && (
                                <span>{task.estimatedHours}h estimated</span>
                              )}
                              {task.dueDate && (
                                <span className={isOverdue ? 'text-red-500' : ''}>
                                  Due {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Start Timer
                            </Button>
                            <Button variant="outline" size="sm">
                              Update
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Time Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Time Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">This Week</span>
                    <span className="font-medium">{totalHoursThisWeek}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Remaining</span>
                    <span className="font-medium">{estimatedHoursThisWeek}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rate</span>
                    <span className="font-medium">${currentDeveloper.hourlyRate / 100}/h</span>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Weekly Earnings</span>
                    <span className="font-bold text-green-600">
                      ${((totalHoursThisWeek * currentDeveloper.hourlyRate) / 100).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge variant={isAvailable ? "success" : "secondary"}>
                    {isAvailable ? "Available" : "Busy"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Timezone</span>
                  <span className="font-medium">{currentDeveloper.timezone}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Max Projects</span>
                  <span className="font-medium">3</span>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setIsAvailable(!isAvailable)}
                >
                  {isAvailable ? 'Set as Busy' : 'Set as Available'}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Log Hours
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Admin
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
              </CardContent>
            </Card>

            {/* Alerts */}
            {overdueTasks.length > 0 && (
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-base text-red-600 flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>Overdue Tasks</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-600 mb-2">
                    You have {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
                  </p>
                  <Button variant="destructive" size="sm" className="w-full">
                    View Overdue
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}