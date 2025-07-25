import * as React from "react"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number
    max?: number
    variant?: 'default' | 'success' | 'warning' | 'info' | 'gradient'
  }
>(({ className, value = 0, max = 100, variant = 'gradient', ...props }, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  // Dynamic color based on progress value
  const getProgressColor = () => {
    if (variant === 'gradient') {
      if (percentage >= 90) return 'bg-gradient-to-r from-green-400 via-green-500 to-emerald-600'
      if (percentage >= 70) return 'bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600'
      if (percentage >= 40) return 'bg-gradient-to-r from-cyan-400 via-teal-500 to-blue-500'
      return 'bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500'
    }
    
    switch (variant) {
      case 'success': return 'bg-gradient-to-r from-green-400 to-green-600'
      case 'warning': return 'bg-gradient-to-r from-amber-400 to-yellow-500'
      case 'info': return 'bg-gradient-to-r from-blue-400 to-blue-600'
      default: return 'bg-gradient-to-r from-blue-500 to-purple-600'
    }
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full w-full flex-1 transition-all duration-500 ease-out rounded-full shadow-sm",
          getProgressColor(),
          percentage >= 90 && "animate-pulse shadow-lg",
          percentage === 100 && "shadow-green-400/50"
        )}
        style={{ 
          transform: `translateX(-${100 - percentage}%)`,
          boxShadow: percentage >= 80 ? '0 0 20px rgba(59, 130, 246, 0.5)' : undefined
        }}
      />
      
      {/* Shimmer effect for high progress */}
      {percentage >= 80 && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
          style={{
            transform: `translateX(-${100 - percentage}%)`,
            animation: 'shimmer 2s ease-in-out infinite'
          }}
        />
      )}
    </div>
  )
})
Progress.displayName = "Progress"

export { Progress }