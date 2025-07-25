import * as React from "react"
import { cn } from "@/lib/utils"

const Tabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full", className)}
    {...props}
  />
))
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    activeIndex?: number
    totalTabs?: number
  }
>(({ className, activeIndex = 0, totalTabs = 5, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative inline-flex h-12 items-center justify-center rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-blue-100 dark:border-gray-600 p-1 text-muted-foreground overflow-hidden",
      className
    )}
    {...props}
  >
    {/* Animated background selector */}
    <div
      className="absolute top-1 bottom-1 rounded-md bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out shadow-lg"
      style={{
        width: `calc(${100 / totalTabs}% - 4px)`,
        left: `calc(${(activeIndex * 100) / totalTabs}% + 2px)`,
        background: getTabGradient(activeIndex)
      }}
    />
    {children}
  </div>
))
TabsList.displayName = "TabsList"

// Helper function to get gradient based on tab index
function getTabGradient(index: number): string {
  const gradients = [
    'linear-gradient(135deg, #3B82F6, #8B5CF6)', // Blue to Purple (Overview)
    'linear-gradient(135deg, #10B981, #3B82F6)', // Green to Blue (Updates)  
    'linear-gradient(135deg, #8B5CF6, #EC4899)', // Purple to Pink (Messages)
    'linear-gradient(135deg, #F59E0B, #F97316)', // Amber to Orange (Files)
    'linear-gradient(135deg, #14B8A6, #06B6D4)', // Teal to Cyan (Preview)
  ]
  return gradients[index] || gradients[0]
}

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    value: string
    isActive?: boolean
  }
>(({ className, isActive, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      isActive ? "text-white font-semibold" : "text-muted-foreground hover:text-foreground",
      className
    )}
    {...props}
  >
    {children}
  </button>
))
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string
    isActive?: boolean
  }
>(({ className, isActive, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      !isActive && "hidden",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }