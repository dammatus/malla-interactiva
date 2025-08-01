"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Mail, Lock, Chrome, Eye, EyeOff, Sparkles, BookOpen, Trophy, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { PageTransition, FadeIn, ScaleIn } from "@/components/ui/animations"

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setMessage("¡Revisa tu email para confirmar tu cuenta!")
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push("/")
      }
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      setMessage(error.message)
    }
  }

  return (
    <PageTransition className="min-h-screen bg-background transition-colors duration-300 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }} />
      
      {/* Toggle de tema */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Panel izquierdo - Información */}
        <FadeIn direction="left" className="hidden lg:block space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <GraduationCap className="h-12 w-12 text-primary" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-50 animate-pulse-subtle"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Malla Curricular</h1>
                <p className="text-lg text-muted-foreground">Gestiona tu futuro académico</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Organiza tu carrera universitaria de forma visual e intuitiva
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Mantén un seguimiento detallado de tu progreso académico, visualiza las correlatividades 
                y planifica tu próximo semestre con facilidad.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <FadeIn delay={0.2} className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Seguimiento Visual</h3>
                  <p className="text-sm text-muted-foreground">Ve tu progreso académico de manera clara y organizada</p>
                </div>
              </FadeIn>

              <FadeIn delay={0.4} className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <Trophy className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Logros y Metas</h3>
                  <p className="text-sm text-muted-foreground">Celebra cada materia aprobada y mantén la motivación</p>
                </div>
              </FadeIn>

              <FadeIn delay={0.6} className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Planificación Inteligente</h3>
                  <p className="text-sm text-muted-foreground">Identifica automáticamente qué materias puedes cursar</p>
                </div>
              </FadeIn>
            </div>
          </div>
        </FadeIn>

        {/* Panel derecho - Formulario */}
        <ScaleIn delay={0.2}>
          <Card className="w-full max-w-md mx-auto shadow-2xl border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <GraduationCap className="h-16 w-16 text-primary" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-50 animate-pulse-subtle"></div>
                  <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-500 animate-pulse" />
                </div>
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-foreground">
                  {isSignUp ? "¡Bienvenido!" : "¡Hola de nuevo!"}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  {isSignUp 
                    ? "Crea tu cuenta y comienza a organizar tu carrera universitaria" 
                    : "Ingresa a tu cuenta para continuar con tu progreso académico"}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="ejemplo@universidad.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={isSignUp ? "Crea una contraseña segura" : "Tu contraseña"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {isSignUp && (
                    <p className="text-xs text-muted-foreground">
                      Usa al menos 8 caracteres para mayor seguridad
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-semibold" 
                  disabled={loading}
                  variant="gradient"
                >
                  {loading 
                    ? "Procesando..." 
                    : isSignUp 
                      ? "🎓 Crear mi cuenta" 
                      : "🚀 Acceder a mi malla"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground font-medium">O continúa con</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                onClick={handleGoogleAuth} 
                className="w-full h-11 border-border/50 hover:bg-accent/50 transition-all duration-200"
              >
                <Chrome className="mr-2 h-5 w-5 text-[#4285F4]" />
                <span className="font-medium">Continuar con Google</span>
              </Button>

              {message && (
                <ScaleIn className={`text-center text-sm p-4 rounded-xl border ${
                  message.includes("error") || message.includes("Error") 
                    ? "text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800" 
                    : "text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                }`}>
                  {message}
                </ScaleIn>
              )}

              <div className="text-center">
                <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                  <p className="text-sm text-muted-foreground mb-2">
                    {isSignUp ? "¿Ya tienes una cuenta?" : "¿Primera vez aquí?"}
                  </p>
                  <Button 
                    type="button" 
                    variant="link" 
                    onClick={() => setIsSignUp(!isSignUp)} 
                    className="font-semibold text-primary hover:text-primary/80 p-0 h-auto"
                  >
                    {isSignUp ? "Inicia sesión" : "Crea tu cuenta gratis"}
                  </Button>
                </div>
              </div>
              
              {isSignUp && (
                <FadeIn delay={0.4} className="text-center space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    Al registrarte, podrás:
                  </p>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Guardar tu progreso académico</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Personalizar tu malla curricular</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Acceder desde cualquier dispositivo</span>
                    </div>
                  </div>
                </FadeIn>
              )}
            </CardContent>
          </Card>
        </ScaleIn>
      </div>
    </PageTransition>
  )
}
