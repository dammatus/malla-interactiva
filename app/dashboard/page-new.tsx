"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { PageTransition, FadeIn, ScaleIn, StaggerContainer, StaggerItem } from "@/components/ui/animations"
import { 
  GraduationCap, 
  LogOut, 
  BookOpen, 
  Trophy, 
  Clock, 
  TrendingUp,
  Calendar,
  Target,
  Award,
  Activity,
  Users,
  Settings
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Datos de ejemplo - en una aplicación real vendrían de la base de datos
  const [stats, setStats] = useState({
    totalSubjects: 42,
    approvedSubjects: 28,
    currentSemester: 6,
    gpa: 8.5,
    creditsCompleted: 168,
    totalCredits: 252,
    subjectsThisSemester: 5,
    upcomingDeadlines: 3
  })

  const progress = (stats.approvedSubjects / stats.totalSubjects) * 100
  const creditProgress = (stats.creditsCompleted / stats.totalCredits) * 100

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative mb-6">
            <GraduationCap className="h-16 w-16 text-primary mx-auto animate-pulse-subtle" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Cargando Dashboard...</h1>
          <p className="text-muted-foreground">Preparando tu información académica</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push("/auth")
    return null
  }

  return (
    <PageTransition className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex justify-between items-center">
            <FadeIn direction="left" className="flex items-center gap-4">
              <div className="relative">
                <GraduationCap className="h-8 w-8 text-primary transition-colors duration-300" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-50"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Mi Dashboard</h1>
                <p className="text-sm text-muted-foreground">¡Hola {user.email}!</p>
              </div>
            </FadeIn>
            
            <FadeIn direction="right" className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/">
                <Button variant="outline" className="hover:scale-105 transition-transform duration-200">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Ver Malla
                </Button>
              </Link>
              <Button onClick={handleSignOut} variant="outline" className="hover:scale-105 transition-transform duration-200">
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </FadeIn>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Estadísticas principales */}
        <FadeIn delay={0.1}>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Resumen Académico</h2>
            <p className="text-muted-foreground">Tu progreso universitario en tiempo real</p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StaggerItem>
            <StatCard
              title="Materias Aprobadas"
              value={stats.approvedSubjects}
              description={`de ${stats.totalSubjects} materias`}
              icon={<Trophy className="h-6 w-6" />}
              color="success"
              progress={progress}
              trend={{ value: 12, isPositive: true }}
            />
          </StaggerItem>

          <StaggerItem>
            <StatCard
              title="Créditos Completados"
              value={stats.creditsCompleted}
              description={`de ${stats.totalCredits} créditos`}
              icon={<Award className="h-6 w-6" />}
              color="primary"
              progress={creditProgress}
              trend={{ value: 8, isPositive: true }}
            />
          </StaggerItem>

          <StaggerItem>
            <StatCard
              title="Promedio General"
              value={stats.gpa.toFixed(1)}
              description="Promedio ponderado"
              icon={<TrendingUp className="h-6 w-6" />}
              color="info"
              trend={{ value: 0.3, isPositive: true }}
            />
          </StaggerItem>

          <StaggerItem>
            <StatCard
              title="Semestre Actual"
              value={stats.currentSemester}
              description={`${stats.subjectsThisSemester} materias cursando`}
              icon={<Calendar className="h-6 w-6" />}
              color="purple"
            />
          </StaggerItem>
        </StaggerContainer>

        {/* Sección de progreso detallado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progreso por año */}
          <ScaleIn delay={0.3}>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Progreso por Año Académico
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { year: "1er Año", completed: 10, total: 10, percentage: 100 },
                  { year: "2do Año", completed: 8, total: 10, percentage: 80 },
                  { year: "3er Año", completed: 6, total: 10, percentage: 60 },
                  { year: "4to Año", completed: 4, total: 10, percentage: 40 },
                  { year: "5to Año", completed: 0, total: 2, percentage: 0 },
                ].map((yearData, index) => (
                  <div key={yearData.year} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">{yearData.year}</span>
                      <span className="text-sm text-muted-foreground">
                        {yearData.completed}/{yearData.total} materias
                      </span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${yearData.percentage}%`,
                          animationDelay: `${index * 200}ms`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </ScaleIn>

          {/* Materias próximas a cursar */}
          <ScaleIn delay={0.4}>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Próximas Materias Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Ingeniería de Software II", code: "ISW302", credits: 6, difficulty: "Alta" },
                  { name: "Base de Datos II", code: "BDD302", credits: 4, difficulty: "Media" },
                  { name: "Redes de Computadoras", code: "RED301", credits: 4, difficulty: "Media" },
                  { name: "Sistemas Distribuidos", code: "SIS402", credits: 6, difficulty: "Alta" },
                ].map((subject, index) => (
                  <div 
                    key={subject.code}
                    className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30 hover:border-primary/30 transition-all duration-200"
                  >
                    <div>
                      <h4 className="font-medium text-foreground">{subject.name}</h4>
                      <p className="text-sm text-muted-foreground">{subject.code} • {subject.credits} créditos</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      subject.difficulty === "Alta" 
                        ? "bg-red-500/10 text-red-500" 
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}>
                      {subject.difficulty}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </ScaleIn>
        </div>

        {/* Sección de actividad reciente */}
        <FadeIn delay={0.5}>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    action: "Materia aprobada", 
                    subject: "Algoritmos y Estructuras de Datos", 
                    date: "Hace 2 días",
                    type: "success"
                  },
                  { 
                    action: "Nueva materia agregada", 
                    subject: "Machine Learning", 
                    date: "Hace 1 semana",
                    type: "info"
                  },
                  { 
                    action: "Prerrequisito completado", 
                    subject: "Programación Orientada a Objetos", 
                    date: "Hace 2 semanas",
                    type: "warning"
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors duration-200">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === "success" ? "bg-green-500" :
                      activity.type === "info" ? "bg-blue-500" :
                      "bg-yellow-500"
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.subject}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Acciones rápidas */}
        <FadeIn delay={0.6}>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/">
                  <Button variant="outline" className="w-full h-16 flex-col gap-2 hover:scale-105 transition-transform duration-200">
                    <BookOpen className="h-6 w-6" />
                    <span>Ver Malla Completa</span>
                  </Button>
                </Link>
                <Button variant="outline" className="w-full h-16 flex-col gap-2 hover:scale-105 transition-transform duration-200">
                  <Users className="h-6 w-6" />
                  <span>Planificar Semestre</span>
                </Button>
                <Button variant="outline" className="w-full h-16 flex-col gap-2 hover:scale-105 transition-transform duration-200">
                  <Trophy className="h-6 w-6" />
                  <span>Ver Logros</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </PageTransition>
  )
}
