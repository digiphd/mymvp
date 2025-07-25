'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Logo } from "@/components/ui/logo"
import CustomerDashboard from '@/components/dashboard/CustomerDashboard'
import CustomerProjectDetail from '@/components/dashboard/CustomerProjectDetail'
import DeveloperDashboard from '@/components/dashboard/DeveloperDashboard'

type DashboardView = 'selector' | 'customer' | 'customer-detail' | 'developer' | 'admin'

export default function DashboardDemo() {
  const [currentView, setCurrentView] = useState<DashboardView>('selector')
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-1')

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId)
    setCurrentView('customer-detail')
  }

  const renderView = () => {
    switch (currentView) {
      case 'customer':
        return <CustomerDashboard onProjectSelect={handleProjectSelect} />
      
      case 'customer-detail':
        return (
          <CustomerProjectDetail 
            projectId={selectedProjectId}
            onBack={() => setCurrentView('customer')}
          />
        )
      
      case 'developer':
        return <DeveloperDashboard />
      
      case 'admin':
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>Coming soon...</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  The admin dashboard with project status board is next on the development list.
                </p>
                <Button onClick={() => setCurrentView('selector')}>
                  Back to Demo Selector
                </Button>
              </CardContent>
            </Card>
          </div>
        )
      
      default:
        return (
          <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card">
              <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <Logo linkHref="/" />
                  <ThemeToggle />
                </div>
              </div>
            </header>

            <div className="container mx-auto px-6 py-16">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Dashboard Demo</h1>
                <p className="text-xl text-muted-foreground">
                  Interactive prototypes of the customer and developer dashboards
                </p>
                <Badge variant="info" className="mt-4">
                  Using dummy data for demonstration
                </Badge>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
                {/* Customer Dashboard */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>Customer Dashboard</span>
                      <Badge variant="success">Ready</Badge>
                    </CardTitle>
                    <CardDescription>
                      Project overview, progress tracking, and communication with developers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="text-sm space-y-2">
                      <li>• Projects overview with status and progress</li>
                      <li>• Assigned developer information</li>
                      <li>• Project timeline and budget tracking</li>
                      <li>• Quick stats and metrics</li>
                    </ul>
                    <Button 
                      onClick={() => setCurrentView('customer')}
                      className="w-full"
                    >
                      View Customer Dashboard
                    </Button>
                  </CardContent>
                </Card>

                {/* Customer Project Detail */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>Project Detail View</span>
                      <Badge variant="success">Ready</Badge>
                    </CardTitle>
                    <CardDescription>
                      Detailed project view with tabs for updates, messages, and files
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="text-sm space-y-2">
                      <li>• Project overview and requirements</li>
                      <li>• Developer updates and milestones</li>
                      <li>• Real-time messaging system</li>
                      <li>• File sharing and live preview</li>
                    </ul>
                    <Button 
                      onClick={() => setCurrentView('customer-detail')}
                      className="w-full"
                    >
                      View Project Detail
                    </Button>
                  </CardContent>
                </Card>

                {/* Developer Dashboard */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>Developer Dashboard</span>
                      <Badge variant="success">Ready</Badge>
                    </CardTitle>
                    <CardDescription>
                      Task management, time tracking, and project progress for developers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="text-sm space-y-2">
                      <li>• Active projects and task progress</li>
                      <li>• Time tracking and earnings</li>
                      <li>• Today's tasks and deadlines</li>
                      <li>• Availability status management</li>
                    </ul>
                    <Button 
                      onClick={() => setCurrentView('developer')}
                      className="w-full"
                    >
                      View Developer Dashboard
                    </Button>
                  </CardContent>
                </Card>

                {/* Admin Dashboard - Coming Soon */}
                <Card className="hover:shadow-lg transition-shadow opacity-75">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>Admin Dashboard</span>
                      <Badge variant="secondary">Coming Soon</Badge>
                    </CardTitle>
                    <CardDescription>
                      Project management, developer assignment, and system overview
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="text-sm space-y-2">
                      <li>• Project status board</li>
                      <li>• Developer workload management</li>
                      <li>• Client communication oversight</li>
                      <li>• System metrics and analytics</li>
                    </ul>
                    <Button 
                      onClick={() => setCurrentView('admin')}
                      variant="outline"
                      className="w-full"
                    >
                      Preview Admin (Coming Soon)
                    </Button>
                  </CardContent>
                </Card>

                {/* Implementation Notes */}
                <Card className="md:col-span-2 lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Implementation Notes</CardTitle>
                    <CardDescription>Technical details about the dashboard components</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-semibold mb-2">Features Implemented</h4>
                        <ul className="text-sm space-y-1">
                          <li>✅ Role-based dashboard layouts</li>
                          <li>✅ Interactive project cards</li>
                          <li>✅ Progress tracking and status badges</li>
                          <li>✅ Tabbed navigation system</li>
                          <li>✅ Responsive design</li>
                          <li>✅ Dummy data integration</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Next Steps</h4>
                        <ul className="text-sm space-y-1">
                          <li>🔄 Admin dashboard with project board</li>
                          <li>🔄 Developer task board (Kanban)</li>
                          <li>🔄 Real-time messaging integration</li>
                          <li>🔄 File upload and management</li>
                          <li>🔄 API integration layer</li>
                          <li>🔄 Authentication and routing</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center mt-12">
                <p className="text-muted-foreground">
                  Built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui components
                </p>
              </div>
            </div>
          </div>
        )
    }
  }

  return renderView()
}