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
  ExternalLink,
  Calendar,
  DollarSign,
  Plus,
  Zap,
  Sparkles,
  Trophy,
  Rocket
} from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Logo } from "@/components/ui/logo"
import ChatWidget from "@/components/dashboard/ChatWidget"
import { 
  dummyProjects, 
  getUserById, 
  getProjectsByCustomerId, 
  getCurrentUser,
  Project 
} from "@/data/dummy"

interface CustomerDashboardProps {
  onProjectSelect?: (projectId: string) => void
}

const statusColors = {
  planning: 'secondary',
  assigned: 'info',
  building: 'warning',
  testing: 'info',
  review: 'warning',
  delivered: 'success',
  cancelled: 'destructive'
} as const

const priorityColors = {
  low: 'secondary',
  medium: 'info',
  high: 'warning',
  urgent: 'destructive'
} as const

const getStatusProgress = (status: Project['status']): number => {
  const statusProgress = {
    planning: 0,
    assigned: 20,
    building: 50,
    testing: 80,
    review: 90,
    delivered: 100,
    cancelled: 0
  }
  return statusProgress[status]
}

export default function CustomerDashboard({ onProjectSelect }: CustomerDashboardProps) {
  const currentUser = getCurrentUser()
  const userProjects = getProjectsByCustomerId(currentUser.id)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo linkHref="/" />
              <span className="text-muted-foreground">Customer Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <span className="text-sm text-muted-foreground">Welcome back, {currentUser.name}</span>
              <Avatar>
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">Logout</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Projects</h2>
            <p className="text-muted-foreground">Track the progress of your MVP development projects</p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </Button>
        </div>

        {/* Projects Grid */}
        {userProjects.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first MVP project</p>
              <Button>Create Your First Project</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userProjects.map((project) => {
              const assignedDeveloper = project.assignedDeveloperId 
                ? getUserById(project.assignedDeveloperId)
                : null
              const progress = getStatusProgress(project.status)
              const daysUntilDelivery = project.deliveryDate 
                ? Math.ceil((new Date(project.deliveryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                : null

              return (
                <Card key={project.id} className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm border-blue-100 dark:border-gray-600">
                  <CardHeader className="pb-4 relative overflow-hidden">
                    {/* Progress celebration overlay */}
                    {progress >= 80 && (
                      <div className="absolute top-0 right-0 text-yellow-400">
                        <Sparkles className="h-5 w-5 animate-pulse" />
                      </div>
                    )}
                    {progress === 100 && (
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-400 to-blue-500 h-1"></div>
                    )}
                    
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          {project.status === 'delivered' && (
                            <Trophy className="h-4 w-4 text-yellow-500" />
                          )}
                          {project.status === 'building' && (
                            <Rocket className="h-4 w-4 text-blue-500 animate-pulse" />
                          )}
                        </div>
                        <CardDescription className="text-sm">{project.description}</CardDescription>
                      </div>
                      <Badge 
                        variant={priorityColors[project.priority]} 
                        className={`ml-2 ${project.priority === 'urgent' ? 'animate-pulse' : ''}`}
                      >
                        {project.priority === 'urgent' && <Zap className="h-3 w-3 mr-1" />}
                        {project.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Status and Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={statusColors[project.status]} className="text-xs font-semibold">
                          {project.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium text-muted-foreground">{progress}%</span>
                          {progress === 100 && <Sparkles className="h-3 w-3 text-yellow-400" />}
                        </div>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={progress} 
                          className={`h-3 ${progress >= 80 ? 'animate-pulse' : ''}`} 
                        />
                        {progress === 100 && (
                          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-pulse"></div>
                        )}
                      </div>
                    </div>

                    {/* Developer Info */}
                    {assignedDeveloper && (
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={assignedDeveloper.avatarUrl} alt={assignedDeveloper.name} />
                          <AvatarFallback className="text-xs">
                            {assignedDeveloper.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{assignedDeveloper.name}</p>
                          <p className="text-xs text-muted-foreground">Developer</p>
                        </div>
                      </div>
                    )}

                    {/* Project Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>${(project.priceCents / 100).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {project.type.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {/* Timeline */}
                    {project.deliveryDate && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Due in {daysUntilDelivery !== null && daysUntilDelivery > 0 
                            ? `${daysUntilDelivery} days` 
                            : daysUntilDelivery === 0 
                              ? 'today' 
                              : 'overdue'}
                        </span>
                      </div>
                    )}

                    {/* Preview Link */}
                    {project.previewUrl && (
                      <div className="flex items-center space-x-2 text-sm">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={project.previewUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View Preview
                        </a>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        onClick={() => onProjectSelect?.(project.id)}
                      >
                        View Details
                      </Button>
                      {assignedDeveloper && (
                        <Button variant="outline" size="sm" className="flex items-center space-x-1 border-blue-200 text-blue-600 hover:bg-blue-50">
                          <MessageSquare className="h-3 w-3" />
                          <span>Message</span>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Quick Stats */}
        {userProjects.length > 0 && (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-100">Active Projects</CardTitle>
                <div className="p-2 bg-white/20 rounded-lg">
                  <Rocket className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center space-x-2">
                  <span>{userProjects.filter(p => ['assigned', 'building', 'testing', 'review'].includes(p.status)).length}</span>
                  <Zap className="h-5 w-5 text-yellow-300" />
                </div>
                <p className="text-xs text-blue-100 mt-1">
                  Currently in development
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-100">Completed</CardTitle>
                <div className="p-2 bg-white/20 rounded-lg">
                  <Trophy className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center space-x-2">
                  <span>{userProjects.filter(p => p.status === 'delivered').length}</span>
                  <Sparkles className="h-5 w-5 text-yellow-300" />
                </div>
                <p className="text-xs text-green-100 mt-1">
                  Successfully delivered
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-100">Total Investment</CardTitle>
                <div className="p-2 bg-white/20 rounded-lg">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${(userProjects.reduce((sum, p) => sum + p.priceCents, 0) / 100).toLocaleString()}
                </div>
                <p className="text-xs text-purple-100 mt-1">
                  Across all projects
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      
      {/* Immersive Chat Widget */}
      <ChatWidget 
        projectId={userProjects.find(p => p.status === 'building')?.id}
        developer={{
          name: "Alex Chen",
          avatar: "/avatars/alex.jpg"
        }}
      />
    </div>
  )
}