"use client"

import { GraduationCap, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  }

  return (
    <Loader2 className={cn("animate-spin text-primary", sizeClasses[size], className)} />
  )
}

interface LoadingPageProps {
  title?: string
  description?: string
}

export function LoadingPage({ 
  title = "Cargando...", 
  description = "Preparando tu información académica" 
}: LoadingPageProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6 animate-fade-in">
        {/* Icono animado */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl opacity-30 animate-pulse" />
          <GraduationCap className="h-16 w-16 text-primary mx-auto relative z-10 animate-pulse-subtle" />
        </div>
        
        {/* Texto */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        
        {/* Spinner */}
        <LoadingSpinner size="lg" />
        
        {/* Puntos de carga animados */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface PageLoadingProps {
  message?: string
}

export function PageLoading({ message = "Cargando página..." }: PageLoadingProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}
