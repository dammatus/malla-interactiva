"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: ReactNode
  color?: "primary" | "success" | "warning" | "info" | "purple"
  className?: string
  progress?: number
  trend?: {
    value: number
    isPositive: boolean
  }
}

const colorVariants = {
  primary: {
    icon: "bg-primary/10 text-primary",
    gradient: "from-primary/5 to-primary/10",
    border: "border-primary/20"
  },
  success: {
    icon: "bg-green-500/10 text-green-500",
    gradient: "from-green-500/5 to-green-500/10",
    border: "border-green-500/20"
  },
  warning: {
    icon: "bg-yellow-500/10 text-yellow-500",
    gradient: "from-yellow-500/5 to-yellow-500/10",
    border: "border-yellow-500/20"
  },
  info: {
    icon: "bg-blue-500/10 text-blue-500",
    gradient: "from-blue-500/5 to-blue-500/10",
    border: "border-blue-500/20"
  },
  purple: {
    icon: "bg-purple-500/10 text-purple-500",
    gradient: "from-purple-500/5 to-purple-500/10",
    border: "border-purple-500/20"
  }
}

export function StatCard({
  title,
  value,
  description,
  icon,
  color = "primary",
  className,
  progress,
  trend
}: StatCardProps) {
  const colors = colorVariants[color]

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl",
        "bg-gradient-to-br", colors.gradient,
        colors.border,
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-foreground">
                {value}
              </h3>
              {trend && (
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  trend.isPositive 
                    ? "bg-green-500/10 text-green-500" 
                    : "bg-red-500/10 text-red-500"
                )}>
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          
          <div className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300",
            colors.icon
          )}>
            {icon}
          </div>
        </div>

        {progress !== undefined && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progreso</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-1000 ease-out",
                  color === "success" ? "bg-green-500" :
                  color === "warning" ? "bg-yellow-500" :
                  color === "info" ? "bg-blue-500" :
                  color === "purple" ? "bg-purple-500" :
                  "bg-primary"
                )}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Efecto de brillo sutil */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full transition-transform duration-1000 hover:translate-x-full" />
      </CardContent>
    </Card>
  )
}
