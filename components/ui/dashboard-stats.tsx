import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, BookOpen, Trophy, Clock } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
  trend?: {
    value: number
    label: string
  }
  color: "green" | "blue" | "purple" | "orange"
}

export function StatsCard({ title, value, icon, description, trend, color }: StatsCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "green":
        return {
          bg: "bg-green-500/10 dark:bg-green-900/20",
          text: "text-green-600 dark:text-green-400",
          border: "border-green-200 dark:border-green-800"
        }
      case "blue":
        return {
          bg: "bg-blue-500/10 dark:bg-blue-900/20",
          text: "text-blue-600 dark:text-blue-400",
          border: "border-blue-200 dark:border-blue-800"
        }
      case "purple":
        return {
          bg: "bg-purple-500/10 dark:bg-purple-900/20",
          text: "text-purple-600 dark:text-purple-400",
          border: "border-purple-200 dark:border-purple-800"
        }
      case "orange":
        return {
          bg: "bg-orange-500/10 dark:bg-orange-900/20",
          text: "text-orange-600 dark:text-orange-400",
          border: "border-orange-200 dark:border-orange-800"
        }
      default:
        return {
          bg: "bg-primary/10",
          text: "text-primary",
          border: "border-primary/20"
        }
    }
  }

  const colors = getColorClasses(color)

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${colors.bg} ${colors.border} border`}>
            <div className={colors.text}>
              {icon}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2 gap-1">
                <span className={`text-xs font-medium ${colors.text}`}>
                  {trend.value > 0 ? '+' : ''}{trend.value}%
                </span>
                <span className="text-xs text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface DashboardStatsProps {
  totalSubjects: number
  approvedSubjects: number
  availableSubjects: number
  completionPercentage: number
}

export function DashboardStats({ 
  totalSubjects, 
  approvedSubjects, 
  availableSubjects, 
  completionPercentage 
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatsCard
        title="Materias Aprobadas"
        value={approvedSubjects}
        icon={<CheckCircle2 className="h-6 w-6" />}
        description={`de ${totalSubjects} totales`}
        color="green"
      />
      
      <StatsCard
        title="Total de Materias"
        value={totalSubjects}
        icon={<BookOpen className="h-6 w-6" />}
        description="en todo el plan"
        color="blue"
      />
      
      <StatsCard
        title="Disponibles"
        value={availableSubjects}
        icon={<Clock className="h-6 w-6" />}
        description="para cursar ahora"
        color="orange"
      />
      
      <StatsCard
        title="Progreso"
        value={`${completionPercentage.toFixed(1)}%`}
        icon={<Trophy className="h-6 w-6" />}
        description="completado"
        color="purple"
      />
    </div>
  )
}
