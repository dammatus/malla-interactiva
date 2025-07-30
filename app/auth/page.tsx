"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Mail, Lock, Chrome } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
        router.push("/dashboard")
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
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      setMessage(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? "¡Bienvenido a Malla Curricular!" : "¡Hola de nuevo!"}
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? "Crea tu cuenta para comenzar a organizar tu carrera universitaria de forma visual e intuitiva" 
              : "Ingresa a tu cuenta para ver el progreso de tu carrera académica"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@universidad.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder={isSignUp ? "Crea una contraseña segura" : "Tu contraseña"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              {isSignUp && (
                <p className="text-xs text-gray-500">
                  Usa al menos 8 caracteres para mayor seguridad
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading 
                ? "Procesando..." 
                : isSignUp 
                  ? "🎓 Crear mi cuenta" 
                  : "🚀 Acceder a mi malla"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">O continúa con</span>
            </div>
          </div>

          <Button variant="outline" onClick={handleGoogleAuth} className="w-full bg-transparent">
            <Chrome className="mr-2 h-4 w-4" />
            Continuar con Google
          </Button>

          {message && (
            <div
              className={`text-center text-sm p-3 rounded-lg ${
                message.includes("error") || message.includes("Error") 
                  ? "text-red-700 bg-red-50 border border-red-200" 
                  : "text-green-700 bg-green-50 border border-green-200"
              }`}
            >
              {message}
            </div>
          )}

          <div className="text-center text-sm bg-gray-50 p-3 rounded-lg">
            {isSignUp ? "¿Ya tienes una cuenta?" : "¿Primera vez aquí?"}{" "}
            <button 
              type="button" 
              onClick={() => setIsSignUp(!isSignUp)} 
              className="text-indigo-600 hover:underline font-medium"
            >
              {isSignUp ? "Inicia sesión" : "Crea tu cuenta gratis"}
            </button>
          </div>
          
          {isSignUp && (
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">
                Al registrarte, podrás:
              </p>
              <div className="text-xs text-gray-600 space-y-1">
                <div>✅ Guardar tu progreso académico</div>
                <div>✅ Personalizar tu malla curricular</div>
                <div>✅ Acceder desde cualquier dispositivo</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
