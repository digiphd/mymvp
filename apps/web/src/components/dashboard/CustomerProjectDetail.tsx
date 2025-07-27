'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  ExternalLink,
  FileText,
  Github,
  MessageSquare,
  Send,
  User,
  Upload,
  Eye,
  Sparkles,
  Trophy,
  Rocket,
  Zap,
  Target,
  CheckCircle,
  Star
} from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Logo } from "@/components/ui/logo"
import ChatWidget from "@/components/dashboard/ChatWidget"
import { 
  dummyProjects, 
  getUserById, 
  getUpdatesByProjectId,
  getMessagesByProjectId,
  getCurrentUser,
  Project,
  ProjectUpdate,
  Message
} from "@/data/dummy"

interface CustomerProjectDetailProps {
  projectId: string
  onBack: () => void
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

const updateTypeColors = {
  status_update: 'default',
  milestone: 'success',
  issue: 'destructive',
  delivery: 'success',
  task_completed: 'info',
  dev_note: 'secondary'
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

export default function CustomerProjectDetail({ projectId, onBack }: CustomerProjectDetailProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [newMessage, setNewMessage] = useState('')
  
  const currentUser = getCurrentUser()
  const project = dummyProjects.find(p => p.id === projectId)
  const assignedDeveloper = project?.assignedDeveloperId ? getUserById(project.assignedDeveloperId) : null
  const updates = getUpdatesByProjectId(projectId).filter(u => u.isVisibleToCustomer)
  const messages = getMessagesByProjectId(projectId).filter(m => !m.isInternal)
  
  if (!project) {
    return <div>Project not found</div>
  }

  const progress = getStatusProgress(project.status)
  const daysUntilDelivery = project.deliveryDate 
    ? Math.ceil((new Date(project.deliveryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message
      console.log('Sending message:', newMessage)
      setNewMessage('')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <Logo linkHref="/" />
                <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Dashboard</span>
                </Button>
              </div>
              <div className="text-center">
                <h1 className="text-xl font-bold">{project.title}</h1>
                <p className="text-sm text-muted-foreground">{project.type.toUpperCase()} Project</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Badge variant={statusColors[project.status]}>
                {project.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Avatar>
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs className="w-full">
          <TabsList 
            className="grid w-full grid-cols-5"
            activeIndex={
              activeTab === 'overview' ? 0 :
              activeTab === 'updates' ? 1 :
              activeTab === 'messages' ? 2 :
              activeTab === 'files' ? 3 : 4
            }
            totalTabs={5}
          >
            <TabsTrigger 
              value="overview" 
              isActive={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            >
              <Target className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="updates" 
              isActive={activeTab === 'updates'}
              onClick={() => setActiveTab('updates')}
            >
              <Rocket className="h-4 w-4 mr-2" />
              Updates
            </TabsTrigger>
            <TabsTrigger 
              value="messages" 
              isActive={activeTab === 'messages'}
              onClick={() => setActiveTab('messages')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger 
              value="files" 
              isActive={activeTab === 'files'}
              onClick={() => setActiveTab('files')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Files
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              isActive={activeTab === 'preview'}
              onClick={() => setActiveTab('preview')}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" isActive={activeTab === 'overview'}>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Project Info */}
              <div className="md:col-span-2 space-y-6">
                <Card className="bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm border-blue-100 dark:border-gray-600 relative overflow-hidden">
                  {/* Progress celebration background */}
                  {progress >= 80 && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-60"></div>
                  )}
                  {progress === 100 && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>
                  )}
                  
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <span>Project Details</span>
                        {progress === 100 && <Trophy className="h-5 w-5 text-yellow-500" />}
                        {project.status === 'building' && <Rocket className="h-5 w-5 text-blue-500 animate-pulse" />}
                      </CardTitle>
                      {progress >= 90 && (
                        <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground text-lg leading-relaxed">{project.description}</p>
                    
                    {/* Enhanced Progress Section */}
                    <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-600 dark:to-gray-500 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold">Project Progress</span>
                          {progress >= 80 && <Star className="h-5 w-5 text-yellow-500" />}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-blue-600">{progress}%</span>
                          {progress === 100 && <CheckCircle className="h-6 w-6 text-green-500" />}
                        </div>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={progress} 
                          className={`h-4 ${progress >= 80 ? 'animate-pulse' : ''}`}
                        />
                        {progress === 100 && (
                          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-30 animate-pulse"></div>
                        )}
                      </div>
                      {progress >= 80 && progress < 100 && (
                        <div className="text-center">
                          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-medium">
                            <Zap className="h-4 w-4" />
                            <span>Almost there! 🎉</span>
                          </div>
                        </div>
                      )}
                      {progress === 100 && (
                        <div className="text-center">
                          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-full font-semibold">
                            <Trophy className="h-5 w-5" />
                            <span>Project Complete! 🚀</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Technical Requirements */}
                    {project.technicalRequirements && (
                      <div className="space-y-3 p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-600 dark:to-gray-500 rounded-lg">
                        <h4 className="text-lg font-semibold flex items-center space-x-2">
                          <Zap className="h-5 w-5 text-blue-500" />
                          <span>Technical Stack</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technicalRequirements.stack.map((tech, index) => (
                            <Badge 
                              key={tech} 
                              variant="outline" 
                              className={`text-sm font-medium border-2 ${
                                index % 4 === 0 ? 'border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-900/30' :
                                index % 4 === 1 ? 'border-green-300 text-green-700 bg-green-50 dark:bg-green-900/30' :
                                index % 4 === 2 ? 'border-purple-300 text-purple-700 bg-purple-50 dark:bg-purple-900/30' :
                                'border-orange-300 text-orange-700 bg-orange-50 dark:bg-orange-900/30'
                              }`}
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex space-x-4">
                      {project.previewUrl && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>View Preview</span>
                        </Button>
                      )}
                      {project.repoUrl && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center space-x-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white border-0 hover:from-gray-800 hover:to-black shadow-lg"
                        >
                          <Github className="h-4 w-4" />
                          <span>Repository</span>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Product Requirements Document */}
                {project.requirementsDoc && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Product Requirements Document</CardTitle>
                          <CardDescription>
                            Comprehensive requirements provided by you, including user stories, personas, and feature specifications
                          </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>View Full PRD</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-muted/50 rounded-lg p-4">
                          <p className="text-sm font-medium text-foreground mb-2">Document Overview:</p>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="font-medium">• User Stories & Personas</span>
                              <br />
                              <span className="font-medium">• Core Feature Specifications</span>
                            </div>
                            <div>
                              <span className="font-medium">• UX/UI Style Guidelines</span>
                              <br />
                              <span className="font-medium">• Technical Requirements</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="max-h-96 overflow-y-auto bg-muted/20 rounded-lg p-4">
                          <div className="prose prose-sm max-w-none">
                            {project.requirementsDoc.split('\n').map((line, index) => {
                              if (line.startsWith('## ')) {
                                return (
                                  <h3 key={index} className="text-lg font-semibold text-foreground mt-6 mb-2 first:mt-0">
                                    {line.replace('## ', '')}
                                  </h3>
                                )
                              } else if (line.startsWith('**') && line.endsWith('**')) {
                                return (
                                  <p key={index} className="font-semibold text-foreground mt-3 mb-1">
                                    {line.replace(/\*\*/g, '')}
                                  </p>
                                )
                              } else if (line.startsWith('- ')) {
                                return (
                                  <p key={index} className="text-muted-foreground ml-4 mb-1">
                                    • {line.replace('- ', '')}
                                  </p>
                                )
                              } else if (line.match(/^\d+\./)) {
                                return (
                                  <p key={index} className="font-medium text-foreground mt-3 mb-2">
                                    {line}
                                  </p>
                                )
                              } else if (line.trim() === '') {
                                return <div key={index} className="h-2" />
                              } else {
                                return (
                                  <p key={index} className="text-muted-foreground mb-2">
                                    {line}
                                  </p>
                                )
                              }
                            })}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                          <span>Last updated: {new Date(project.createdAt).toLocaleDateString()}</span>
                          <span>Status: Customer Approved</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Developer Card */}
                {assignedDeveloper && (
                  <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-lg text-white flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>Your Developer</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12 border-2 border-white">
                            <AvatarImage src={assignedDeveloper.avatarUrl} alt={assignedDeveloper.name} />
                            <AvatarFallback className="text-purple-600 font-bold">
                              {assignedDeveloper.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{assignedDeveloper.name}</p>
                          <p className="text-purple-100 text-sm">{assignedDeveloper.timezone}</p>
                        </div>
                      </div>
                      
                      {assignedDeveloper.bio && (
                        <p className="text-purple-100 text-sm leading-relaxed">{assignedDeveloper.bio}</p>
                      )}
                      
                      {assignedDeveloper.skills && (
                        <div className="space-y-3">
                          <p className="text-sm font-semibold text-purple-100">Expert Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {assignedDeveloper.skills.map((skill, index) => (
                              <Badge 
                                key={skill} 
                                variant="outline" 
                                className={`text-xs border-2 border-white/30 text-white bg-white/20 hover:bg-white/30 ${
                                  index === 0 ? 'bg-white/30' : ''
                                }`}
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <Button className="w-full flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                        <MessageSquare className="h-4 w-4" />
                        <span>Message Developer</span>
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Project Stats */}
                <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg text-white flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Project Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-yellow-300" />
                        <span className="text-sm font-medium">Budget</span>
                      </div>
                      <span className="font-bold text-lg">${(project.priceCents / 100).toLocaleString()}</span>
                    </div>
                    
                    {project.startDate && (
                      <div className="flex items-center justify-between p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-green-300" />
                          <span className="text-sm font-medium">Start Date</span>
                        </div>
                        <span className="font-bold">{new Date(project.startDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {project.deliveryDate && (
                      <div className="flex items-center justify-between p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-orange-300" />
                          <span className="text-sm font-medium">Due Date</span>
                        </div>
                        <span className="font-bold">{new Date(project.deliveryDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {project.estimatedHours && (
                      <div className="flex items-center justify-between p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                        <div className="flex items-center space-x-2">
                          <Zap className="h-5 w-5 text-purple-300" />
                          <span className="text-sm font-medium">Estimated Hours</span>
                        </div>
                        <span className="font-bold">{project.estimatedHours}h</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Updates Tab */}
          <TabsContent value="updates" isActive={activeTab === 'updates'}>
            <Card>
              <CardHeader>
                <CardTitle>Project Updates</CardTitle>
                <CardDescription>Latest updates from your development team</CardDescription>
              </CardHeader>
              <CardContent>
                {updates.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No updates yet</p>
                ) : (
                  <div className="space-y-4">
                    {updates.map((update) => {
                      const author = getUserById(update.authorId)
                      return (
                        <div key={update.id} className="border-l-4 border-primary/20 pl-4 py-2">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge variant={updateTypeColors[update.type]} className="text-xs">
                                {update.type.replace('_', ' ')}
                              </Badge>
                              <span className="text-sm font-medium">{update.title}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(update.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{update.content}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            {author && (
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span>{author.name}</span>
                              </div>
                            )}
                            {update.hoursLogged && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{update.hoursLogged}h logged</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" isActive={activeTab === 'messages'}>
            <Card>
              <CardHeader>
                <CardTitle>Project Messages</CardTitle>
                <CardDescription>Communicate with your development team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Messages List */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {messages.map((message) => {
                    const sender = getUserById(message.senderId)
                    const isCurrentUser = message.senderId === currentUser.id
                    
                    return (
                      <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                          <div className={`rounded-lg p-3 ${
                            isCurrentUser 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <div className={`flex items-center space-x-2 mt-1 text-xs text-muted-foreground ${
                            isCurrentUser ? 'justify-end' : 'justify-start'
                          }`}>
                            <span>{sender?.name}</span>
                            <span>•</span>
                            <span>{new Date(message.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Message Input */}
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                    rows={2}
                  />
                  <Button onClick={handleSendMessage} className="self-end">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" isActive={activeTab === 'files'}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Project Files</CardTitle>
                    <CardDescription>Deliverables and project assets</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload File</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No files uploaded yet</p>
                  <p className="text-sm">Files will appear here as your project progresses</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" isActive={activeTab === 'preview'}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Live Preview</CardTitle>
                    <CardDescription>View your project in development</CardDescription>
                  </div>
                  {project.previewUrl && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center space-x-2"
                      onClick={() => window.open(project.previewUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Open in New Tab</span>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {project.previewUrl ? (
                  <div className="space-y-4">
                    {/* Preview Notice */}
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Live Preview:</span>
                        <a 
                          href={project.previewUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {project.previewUrl}
                        </a>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Note: Preview opens in a new tab for the best experience and proper theme support
                      </p>
                    </div>

                    {/* Iframe with better styling */}
                    <div className="border rounded-lg overflow-hidden bg-white">
                      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="text-sm text-muted-foreground flex-1 text-center">
                          {project.title} - Live Preview
                        </div>
                      </div>
                      <div className="relative">
                        <iframe
                          src={project.previewUrl}
                          className="w-full h-96 bg-white"
                          title="Project Preview"
                          style={{
                            colorScheme: 'light'
                          }}
                        />
                        {/* Overlay to indicate external content */}
                        <div className="absolute top-2 right-2">
                          <Button 
                            size="sm" 
                            variant="secondary"
                            onClick={() => window.open(project.previewUrl, '_blank')}
                            className="text-xs opacity-75 hover:opacity-100"
                          >
                            View Full Size
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Eye className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Preview Coming Soon</h3>
                    <p className="text-sm mb-4">A live preview will be available once development begins</p>
                    <div className="max-w-md mx-auto text-xs bg-muted rounded-lg p-3">
                      <p className="font-medium mb-1">What to expect:</p>
                      <ul className="text-left space-y-1">
                        <li>• Live deployment on Vercel</li>
                        <li>• Real-time updates as we build</li>
                        <li>• Full functionality testing</li>
                        <li>• Mobile-responsive preview</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Immersive Chat Widget */}
      <ChatWidget 
        projectId={projectId}
        developer={assignedDeveloper ? {
          name: assignedDeveloper.name,
          avatar: assignedDeveloper.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        } : undefined}
      />
    </div>
  )
}