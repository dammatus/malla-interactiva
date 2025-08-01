"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { GraduationCap, Home, BarChart3, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const navigationItems = [
  {
    name: "Inicio",
    href: "/",
    icon: Home
  },
  {
    name: "Dashboard", 
    href: "/dashboard",
    icon: BarChart3
  },
  {
    name: "Configuración",
    href: "/settings",
    icon: Settings
  }
]

export function Navigation() {
  const pathname = usePathname()
  const { user } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth")
  }

  if (!user) return null

  return (
    <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="relative">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-50" />
            </div>
            <span className="text-xl font-bold text-foreground">Malla Curricular</span>
          </Link>

          {/* Navegación central */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center gap-2 transition-all duration-200",
                      isActive && "bg-primary text-primary-foreground shadow-md",
                      !isActive && "hover:bg-accent hover:scale-105"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              onClick={handleSignOut} 
              variant="outline" 
              size="sm"
              className="hover:scale-105 transition-transform duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Navegación móvil
export function MobileNavigation() {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t border-border/50 md:hidden">
      <div className="flex justify-around items-center h-16 px-4">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full flex flex-col items-center gap-1 h-12 p-1",
                  isActive && "text-primary bg-primary/10"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.name}</span>
              </Button>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
