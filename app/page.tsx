"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  GraduationCap, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Info,
  Lock,
  LogOut,
  BookOpen,
  Trophy
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ThemeToggle } from "@/components/theme-toggle"

interface Subject {
  id: string
  name: string
  code?: string
  credits?: number
  approved: boolean
  prerequisites: string[]
}

interface YearData {
  id: string
  year: number
  name: string
  subjects: Subject[]
}

interface Curriculum {
  id: string
  name: string
  description?: string
  years: YearData[]
}

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth")
  }
  
  const [curriculum, setCurriculum] = useState<Curriculum>({
    id: "curriculum-1",
    name: "Ingeniería en Sistemas",
    description: "Plan de estudios completo",
    years: [
      {
        id: "year-1",
        year: 1,
        name: "Primer Año",
        subjects: [
          { id: "math1", name: "Análisis Matemático I", code: "MAT101", credits: 6, approved: false, prerequisites: [] },
          { id: "algebra", name: "Álgebra y Geometría", code: "MAT102", credits: 6, approved: false, prerequisites: [] },
          { id: "programming1", name: "Introducción a la Programación", code: "PRG101", credits: 4, approved: false, prerequisites: [] },
          { id: "physics1", name: "Física I", code: "FIS101", credits: 6, approved: false, prerequisites: [] },
          { id: "systems", name: "Sistemas y Organizaciones", code: "SIS101", credits: 4, approved: false, prerequisites: [] },
        ],
      },
      {
        id: "year-2",
        year: 2,
        name: "Segundo Año",
        subjects: [
          { id: "math2", name: "Análisis Matemático II", code: "MAT201", credits: 6, approved: false, prerequisites: ["math1"] },
          { id: "programming2", name: "Programación Orientada a Objetos", code: "PRG201", credits: 4, approved: false, prerequisites: ["programming1"] },
          { id: "discrete", name: "Matemática Discreta", code: "MAT203", credits: 4, approved: false, prerequisites: ["algebra"] },
          { id: "physics2", name: "Física II", code: "FIS201", credits: 6, approved: false, prerequisites: ["physics1", "math1"] },
          { id: "statistics", name: "Probabilidad y Estadística", code: "MAT204", credits: 4, approved: false, prerequisites: ["math1"] },
        ],
      },
      {
        id: "year-3",
        year: 3,
        name: "Tercer Año",
        subjects: [
          { id: "algorithms", name: "Algoritmos y Estructuras de Datos", code: "PRG301", credits: 6, approved: false, prerequisites: ["programming2", "discrete"] },
          { id: "databases", name: "Base de Datos", code: "PRG302", credits: 4, approved: false, prerequisites: ["programming2"] },
          { id: "architecture", name: "Arquitectura de Computadoras", code: "SIS301", credits: 4, approved: false, prerequisites: ["physics2"] },
          { id: "methods", name: "Métodos Numéricos", code: "MAT301", credits: 4, approved: false, prerequisites: ["math2", "programming2"] },
        ],
      },
    ],
  })

  const [editingYear, setEditingYear] = useState<string | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [newYearName, setNewYearName] = useState("")
  const [subjectForm, setSubjectForm] = useState({
    name: "",
    code: "",
    credits: "",
    prerequisites: [] as string[]
  })

  // Obtener todas las materias disponibles como prerrequisitos
  const getAllSubjects = (): Subject[] => {
    return curriculum.years.flatMap(year => year.subjects)
  }

  // Verificar si una materia puede ser cursada (prerrequisitos aprobados)
  const canTakeSubject = (subject: Subject): boolean => {
    if (subject.prerequisites.length === 0) return true
    const allSubjects = getAllSubjects()
    return subject.prerequisites.every(prereqId => {
      const prereqSubject = allSubjects.find(s => s.id === prereqId)
      return prereqSubject?.approved || false
    })
  }

  // Obtener nombres de prerrequisitos
  const getPrerequisiteNames = (prerequisiteIds: string[]): string[] => {
    const allSubjects = getAllSubjects()
    return prerequisiteIds.map(id => {
      const subject = allSubjects.find(s => s.id === id)
      return subject?.name || "Materia no encontrada"
    })
  }

  // Manejar aprobación/desaprobación de materias
  const handleSubjectToggle = (subjectId: string) => {
    setCurriculum(prev => ({
      ...prev,
      years: prev.years.map(year => ({
        ...year,
        subjects: year.subjects.map(subject =>
          subject.id === subjectId
            ? { ...subject, approved: !subject.approved }
            : subject
        )
      }))
    }))
  }

  // Agregar nuevo año
  const addYear = () => {
    if (!newYearName.trim()) return
    
    const newYear: YearData = {
      id: `year-${Date.now()}`,
      year: curriculum.years.length + 1,
      name: newYearName,
      subjects: []
    }
    
    setCurriculum(prev => ({
      ...prev,
      years: [...prev.years, newYear]
    }))
    
    setNewYearName("")
  }

  // Agregar nueva materia
  const addSubject = (yearId: string) => {
    if (!subjectForm.name.trim()) return
    
    const newSubject: Subject = {
      id: `subject-${Date.now()}`,
      name: subjectForm.name,
      code: subjectForm.code || undefined,
      credits: subjectForm.credits ? parseInt(subjectForm.credits) : undefined,
      approved: false,
      prerequisites: subjectForm.prerequisites
    }
    
    setCurriculum(prev => ({
      ...prev,
      years: prev.years.map(year =>
        year.id === yearId
          ? { ...year, subjects: [...year.subjects, newSubject] }
          : year
      )
    }))
    
    setSubjectForm({
      name: "",
      code: "",
      credits: "",
      prerequisites: []
    })
  }

  // Eliminar materia
  const deleteSubject = (subjectId: string) => {
    setCurriculum(prev => ({
      ...prev,
      years: prev.years.map(year => ({
        ...year,
        subjects: year.subjects.filter(subject => subject.id !== subjectId)
      }))
    }))
  }

  // Eliminar año
  const deleteYear = (yearId: string) => {
    setCurriculum(prev => ({
      ...prev,
      years: prev.years.filter(year => year.id !== yearId)
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <div className="p-4 border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="relative">
                <GraduationCap className="h-8 w-8 text-primary transition-colors duration-300" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-50 animate-pulse-subtle"></div>
              </div>
              <h1 className="text-3xl font-bold text-foreground">Malla Curricular</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {user && (
                <Button onClick={handleSignOut} variant="outline" className="hover:scale-105 transition-transform duration-200">
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center animate-fade-in">
            <div className="relative mb-6">
              <GraduationCap className="h-16 w-16 text-primary mx-auto animate-pulse-subtle" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Malla Curricular Universitaria</h1>
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center transition-colors duration-300">
        <div className="text-center max-w-md mx-auto p-8 animate-fade-in">
          <div className="relative mb-6">
            <GraduationCap className="h-16 w-16 text-primary mx-auto" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl opacity-30"></div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Malla Curricular Interactiva</h1>
          <p className="text-muted-foreground mb-6">
            Gestiona tu progreso universitario de manera intuitiva
          </p>
          <Link href="/auth">
            <Button size="lg" className="w-full hover:scale-105 transition-transform duration-200">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
      </div>
    )
  }

  const totalSubjects = curriculum.years.reduce((acc, year) => acc + year.subjects.length, 0)
  const approvedSubjects = curriculum.years.reduce((acc, year) => 
    acc + year.subjects.filter(s => s.approved).length, 0)
  const progress = totalSubjects > 0 ? (approvedSubjects / totalSubjects) * 100 : 0

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header mejorado */}
      <div className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 animate-slide-in-left">
              <div className="relative">
                <GraduationCap className="h-8 w-8 text-primary transition-colors duration-300" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-50"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{curriculum.name}</h1>
                <p className="text-sm text-muted-foreground">¡Bienvenido {user.email}!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 animate-slide-in-right">
              <Link href="/dashboard">
                <Button variant="outline" className="hover:scale-105 transition-transform duration-200">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <ThemeToggle />
              <Button onClick={handleSignOut} variant="outline" className="hover:scale-105 transition-transform duration-200">
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Estadísticas mejoradas */}
        <div className="mb-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-500/10 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{approvedSubjects}</p>
                    <p className="text-sm text-muted-foreground">Materias Aprobadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 rounded-full">
                    <BookOpen className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalSubjects}</p>
                    <p className="text-sm text-muted-foreground">Total Materias</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{progress.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Progreso</p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-secondary/20 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Agregar Año */}
        <Card className="mb-6 border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardContent className="p-4">
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Nombre del nuevo año (ej: Cuarto Año)"
                value={newYearName}
                onChange={(e) => setNewYearName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={addYear} disabled={!newYearName.trim()} className="hover:scale-105 transition-transform duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Año
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Grid de Años */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {curriculum.years.map((yearData, index) => (
            <Card 
              key={yearData.id} 
              className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border/50 bg-card/50 backdrop-blur-sm animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="bg-gradient-to-r from-primary/80 to-primary text-primary-foreground rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">{yearData.name}</CardTitle>
                    <div className="text-sm opacity-90">
                      {yearData.subjects.filter((s) => s.approved).length} / {yearData.subjects.length} aprobadas
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingYear(editingYear === yearData.id ? null : yearData.id)}
                      className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteYear(yearData.id)}
                      className="h-8 w-8 text-primary-foreground hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-3">
                {/* Lista de materias */}
                {yearData.subjects.map((subject, subjectIndex) => {
                  const canTake = canTakeSubject(subject)
                  return (
                    <div
                      key={subject.id}
                      className={`
                        p-3 rounded-lg border transition-all duration-300 cursor-pointer hover:scale-[1.02]
                        ${subject.approved 
                          ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300' 
                          : canTake 
                            ? 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300 hover:bg-blue-500/20' 
                            : 'bg-muted border-muted-foreground/20 text-muted-foreground cursor-not-allowed'
                        }
                      `}
                      style={{ animationDelay: `${(index * 100) + (subjectIndex * 50)}ms` }}
                      onClick={() => canTake && handleSubjectToggle(subject.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {subject.approved ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : canTake ? (
                            <Circle className="h-5 w-5 text-blue-500" />
                          ) : (
                            <Lock className="h-5 w-5 text-muted-foreground" />
                          )}
                          <div>
                            <div className="font-semibold">{subject.name}</div>
                            {subject.code && (
                              <div className="text-xs opacity-70">{subject.code}</div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {subject.credits && (
                            <span className="text-xs bg-background/50 px-2 py-1 rounded">
                              {subject.credits} cr
                            </span>
                          )}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedSubject(subject)
                                }}
                              >
                                <Info className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="animate-scale-in">
                              <DialogHeader>
                                <DialogTitle>{subject.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Código:</Label>
                                  <p className="text-sm text-muted-foreground">{subject.code || "No especificado"}</p>
                                </div>
                                <div>
                                  <Label>Créditos:</Label>
                                  <p className="text-sm text-muted-foreground">{subject.credits || "No especificado"}</p>
                                </div>
                                <div>
                                  <Label>Estado:</Label>
                                  <p className={`text-sm font-semibold ${
                                    subject.approved ? "text-green-600" : 
                                    canTake ? "text-blue-600" : "text-gray-500"
                                  }`}>
                                    {subject.approved ? "Aprobada" : 
                                     canTake ? "Disponible" : "Bloqueada"}
                                  </p>
                                </div>
                                {subject.prerequisites.length > 0 && (
                                  <div>
                                    <Label>Prerrequisitos:</Label>
                                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                                      {getPrerequisiteNames(subject.prerequisites).map((name, i) => (
                                        <li key={i}>{name}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-red-500/20 hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteSubject(subject.id)
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Agregar nueva materia */}
                {editingYear === yearData.id && (
                  <div className="p-3 border border-dashed border-border rounded-lg space-y-3 animate-scale-in">
                    <Input
                      placeholder="Nombre de la materia"
                      value={subjectForm.name}
                      onChange={(e) => setSubjectForm({...subjectForm, name: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Código (ej: MAT101)"
                        value={subjectForm.code}
                        onChange={(e) => setSubjectForm({...subjectForm, code: e.target.value})}
                      />
                      <Input
                        placeholder="Créditos"
                        type="number"
                        value={subjectForm.credits}
                        onChange={(e) => setSubjectForm({...subjectForm, credits: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Prerrequisitos:</Label>
                      <div className="mt-2 max-h-32 overflow-y-auto space-y-1">
                        {getAllSubjects().map((availableSubject) => (
                          <div key={availableSubject.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={availableSubject.id}
                              checked={subjectForm.prerequisites.includes(availableSubject.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSubjectForm({
                                    ...subjectForm,
                                    prerequisites: [...subjectForm.prerequisites, availableSubject.id]
                                  })
                                } else {
                                  setSubjectForm({
                                    ...subjectForm,
                                    prerequisites: subjectForm.prerequisites.filter(id => id !== availableSubject.id)
                                  })
                                }
                              }}
                            />
                            <Label htmlFor={availableSubject.id} className="text-sm">
                              {availableSubject.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => addSubject(yearData.id)}
                        disabled={!subjectForm.name.trim()}
                        className="hover:scale-105 transition-transform duration-200"
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Guardar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setEditingYear(null)}
                        className="hover:scale-105 transition-transform duration-200"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Botón para agregar materia */}
                {editingYear !== yearData.id && (
                  <Button
                    variant="dashed"
                    className="w-full border-dashed border-2 border-border hover:border-primary hover:text-primary transition-all duration-300"
                    onClick={() => setEditingYear(yearData.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Materia
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Información de uso mejorada */}
        <Card className="mt-8 border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Info className="h-5 w-5" />
              ¿Cómo usar la aplicación?
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <Circle className="h-4 w-4" />
                  Estados de las materias:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-green-600 dark:text-green-400 font-medium">Verde:</span>
                    <span className="text-muted-foreground">Materias aprobadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="h-4 w-4 text-blue-500" />
                    <span className="text-blue-600 dark:text-blue-400 font-medium">Azul:</span>
                    <span className="text-muted-foreground">Disponibles para cursar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground font-medium">Gris:</span>
                    <span className="text-muted-foreground">Bloqueadas (faltan prerrequisitos)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  Acciones disponibles:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-muted-foreground">• Clic en materia: aprobar/desaprobar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Info className="h-3 w-3" />
                    <span className="text-muted-foreground">Ver detalles y prerrequisitos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Plus className="h-3 w-3" />
                    <span className="text-muted-foreground">Agregar nueva materia</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Trash2 className="h-3 w-3" />
                    <span className="text-muted-foreground">Eliminar materia</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
