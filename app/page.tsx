"use client"

import { useState, useEffect } from "react"
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
  Unlock,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

interface Subject {
  id: string
  name: string
  code?: string
  credits?: number
  approved: boolean
  prerequisites: string[] // IDs de materias prerrequisito
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
  const [editingSubject, setEditingSubject] = useState<string | null>(null)
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

    // Reset form
    setSubjectForm({ name: "", code: "", credits: "", prerequisites: [] })
    setEditingSubject(null)
  }

  // Eliminar materia
  const deleteSubject = (yearId: string, subjectId: string) => {
    setCurriculum(prev => ({
      ...prev,
      years: prev.years.map(year =>
        year.id === yearId
          ? { ...year, subjects: year.subjects.filter(s => s.id !== subjectId) }
          : year
      )
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header con botón de cerrar sesión siempre visible */}
        <div className="p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">Malla Curricular</h1>
            </div>
            {user && (
              <Button onClick={handleSignOut} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            )}
          </div>
        </div>
        
        {/* Contenido de carga centrado */}
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <GraduationCap className="h-16 w-16 text-indigo-600 mx-auto mb-4 animate-pulse" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Malla Curricular Universitaria</h1>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <GraduationCap className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Malla Curricular Interactiva</h1>
          <p className="text-gray-600 mb-6">
            Gestiona tu progreso universitario de manera intuitiva
          </p>
          <Link href="/auth">
            <Button size="lg" className="w-full">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-3 mb-4">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <h1 className="text-4xl font-bold text-gray-900">{curriculum.name}</h1>
            </div>
            <p className="text-gray-600 text-lg">
              ¡Bienvenido {user.email}! Gestiona tu progreso universitario
            </p>
            <p className="text-gray-500 text-sm">{curriculum.description}</p>
          </div>
          
          {/* Botones de navegación */}
          <div className="flex flex-col gap-2">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                <GraduationCap className="h-4 w-4 mr-2" />
                Mi Dashboard
              </Button>
            </Link>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Agregar Año */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Nombre del nuevo año (ej: Cuarto Año)"
              value={newYearName}
              onChange={(e) => setNewYearName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addYear} disabled={!newYearName.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Año
            </Button>
          </div>
        </div>

        {/* Grid de Años */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {curriculum.years.map((yearData) => (
            <Card key={yearData.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">{yearData.name}</CardTitle>
                    <div className="text-sm opacity-90">
                      {yearData.subjects.filter((s) => s.approved).length} / {yearData.subjects.length} aprobadas
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => setEditingSubject(yearData.id)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {yearData.subjects.map((subject) => {
                    const isAvailable = canTakeSubject(subject)
                    return (
                      <div
                        key={subject.id}
                        className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                          subject.approved 
                            ? "bg-green-50 border-green-200 text-green-800" 
                            : isAvailable
                            ? "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100 cursor-pointer"
                            : "bg-gray-50 border-gray-200 text-gray-500"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div 
                            className="flex items-center gap-2 flex-1"
                            onClick={() => isAvailable ? handleSubjectToggle(subject.id) : null}
                          >
                            {subject.approved ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : isAvailable ? (
                              <Circle className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Lock className="h-4 w-4 text-gray-400" />
                            )}
                            <div className="flex-1">
                              <span className={`font-medium text-sm ${subject.approved ? "line-through" : ""}`}>
                                {subject.name}
                              </span>
                              {subject.code && (
                                <div className="text-xs opacity-75">{subject.code}</div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => setSelectedSubject(subject)}
                            >
                              <Info className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              onClick={() => deleteSubject(yearData.id, subject.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  
                  {/* Formulario para agregar materia */}
                  {editingSubject === yearData.id && (
                    <div className="p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="space-y-2">
                        <Input
                          placeholder="Nombre de la materia"
                          value={subjectForm.name}
                          onChange={(e) => setSubjectForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <div className="flex gap-2">
                          <Input
                            placeholder="Código"
                            value={subjectForm.code}
                            onChange={(e) => setSubjectForm(prev => ({ ...prev, code: e.target.value }))}
                          />
                          <Input
                            placeholder="Créditos"
                            type="number"
                            value={subjectForm.credits}
                            onChange={(e) => setSubjectForm(prev => ({ ...prev, credits: e.target.value }))}
                          />
                        </div>
                        
                        {/* Selección de prerrequisitos */}
                        <div>
                          <Label className="text-xs text-gray-600">Prerrequisitos:</Label>
                          <div className="max-h-32 overflow-y-auto border rounded p-2 bg-white">
                            {getAllSubjects()
                              .filter(s => s.id !== editingSubject && !curriculum.years.find(y => y.id === yearData.id)?.subjects.some(subj => subj.id === s.id))
                              .map(subject => (
                                <div key={subject.id} className="flex items-center space-x-2 py-1">
                                  <Checkbox
                                    id={subject.id}
                                    checked={subjectForm.prerequisites.includes(subject.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSubjectForm(prev => ({
                                          ...prev,
                                          prerequisites: [...prev.prerequisites, subject.id]
                                        }))
                                      } else {
                                        setSubjectForm(prev => ({
                                          ...prev,
                                          prerequisites: prev.prerequisites.filter(id => id !== subject.id)
                                        }))
                                      }
                                    }}
                                  />
                                  <Label htmlFor={subject.id} className="text-xs">
                                    {subject.name} ({subject.code})
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
                          >
                            <Save className="h-3 w-3 mr-1" />
                            Guardar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setEditingSubject(null)
                              setSubjectForm({ name: "", code: "", credits: "", prerequisites: [] })
                            }}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dialog de información de materia */}
        {selectedSubject && (
          <Dialog open={!!selectedSubject} onOpenChange={() => setSelectedSubject(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  {selectedSubject.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Código</Label>
                    <p className="text-sm">{selectedSubject.code || "No definido"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Créditos</Label>
                    <p className="text-sm">{selectedSubject.credits || "No definido"}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-500">Estado</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedSubject.approved ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm">Aprobada</span>
                      </div>
                    ) : canTakeSubject(selectedSubject) ? (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Unlock className="h-4 w-4" />
                        <span className="text-sm">Disponible para cursar</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Lock className="h-4 w-4" />
                        <span className="text-sm">Bloqueada (faltan prerrequisitos)</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedSubject.prerequisites.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Prerrequisitos</Label>
                    <div className="mt-2 space-y-1">
                      {getPrerequisiteNames(selectedSubject.prerequisites).map((prereqName, index) => {
                        const prereqId = selectedSubject.prerequisites[index]
                        const prereqSubject = getAllSubjects().find(s => s.id === prereqId)
                        return (
                          <div key={prereqId} className="flex items-center gap-2 text-sm">
                            {prereqSubject?.approved ? (
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                            ) : (
                              <Circle className="h-3 w-3 text-gray-400" />
                            )}
                            <span className={prereqSubject?.approved ? "text-green-600" : "text-gray-500"}>
                              {prereqName}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full" 
                  onClick={() => {
                    if (canTakeSubject(selectedSubject)) {
                      handleSubjectToggle(selectedSubject.id)
                    }
                    setSelectedSubject(null)
                  }}
                  disabled={!canTakeSubject(selectedSubject) && !selectedSubject.approved}
                >
                  {selectedSubject.approved ? "Marcar como No Aprobada" : "Marcar como Aprobada"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Información de uso */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">¿Cómo usar la aplicación?</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Materias:</h4>
              <ul className="space-y-1">
                <li>• <span className="text-green-600">Verde</span>: Materias aprobadas</li>
                <li>• <span className="text-blue-600">Azul</span>: Disponibles para cursar</li>
                <li>• <span className="text-gray-500">Gris</span>: Bloqueadas (faltan prerrequisitos)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Acciones:</h4>
              <ul className="space-y-1">
                <li>• Clic en materia: aprobar/desaprobar</li>
                <li>• Botón <Info className="h-3 w-3 inline" />: ver detalles y prerrequisitos</li>
                <li>• Botón <Plus className="h-3 w-3 inline" />: agregar nueva materia</li>
                <li>• Botón <Trash2 className="h-3 w-3 inline" />: eliminar materia</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
