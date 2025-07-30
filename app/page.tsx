"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, GraduationCap, Lock, CheckCircle2, Circle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Subject {
  id: string
  name: string
  year: number
  prerequisites: string[] // IDs de materias prerequisito
  approved: boolean
  available: boolean
}

interface YearData {
  year: number
  subjects: Subject[]
}

export default function UniversitySubjectsGrid() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/auth")
    }
  }, [user, loading, router])

  const [years, setYears] = useState<YearData[]>([
    {
      year: 1,
      subjects: [
        { id: "math1", name: "Análisis Matemático I", year: 1, prerequisites: [], approved: false, available: true },
        { id: "algebra", name: "Álgebra y Geometría", year: 1, prerequisites: [], approved: false, available: true },
        { id: "programming1", name: "Introducción a la Programación", year: 1, prerequisites: [], approved: false, available: true },
        { id: "physics1", name: "Física I", year: 1, prerequisites: [], approved: false, available: true },
        { id: "systems", name: "Sistemas y Organizaciones", year: 1, prerequisites: [], approved: false, available: true },
      ],
    },
    {
      year: 2,
      subjects: [
        { id: "math2", name: "Análisis Matemático II", year: 2, prerequisites: ["math1"], approved: false, available: false },
        { id: "programming2", name: "Programación Orientada a Objetos", year: 2, prerequisites: ["programming1"], approved: false, available: false },
        { id: "discrete", name: "Matemática Discreta", year: 2, prerequisites: ["algebra"], approved: false, available: false },
        { id: "physics2", name: "Física II", year: 2, prerequisites: ["physics1", "math1"], approved: false, available: false },
        { id: "statistics", name: "Probabilidad y Estadística", year: 2, prerequisites: ["math1"], approved: false, available: false },
      ],
    },
    {
      year: 3,
      subjects: [
        { id: "algorithms", name: "Algoritmos y Estructuras de Datos", year: 3, prerequisites: ["programming2", "discrete"], approved: false, available: false },
        { id: "databases", name: "Base de Datos", year: 3, prerequisites: ["programming2"], approved: false, available: false },
        { id: "architecture", name: "Arquitectura de Computadoras", year: 3, prerequisites: ["physics2"], approved: false, available: false },
        { id: "methods", name: "Métodos Numéricos", year: 3, prerequisites: ["math2", "programming2"], approved: false, available: false },
      ],
    },
    {
      year: 4,
      subjects: [
        { id: "networks", name: "Redes de Computadoras", year: 4, prerequisites: ["architecture"], approved: false, available: false },
        { id: "software", name: "Ingeniería de Software", year: 4, prerequisites: ["algorithms", "databases"], approved: false, available: false },
        { id: "os", name: "Sistemas Operativos", year: 4, prerequisites: ["architecture", "algorithms"], approved: false, available: false },
        { id: "ai", name: "Inteligencia Artificial", year: 4, prerequisites: ["algorithms", "statistics"], approved: false, available: false },
      ],
    },
  ])

  const [newSubject, setNewSubject] = useState({ name: "", year: 1, prerequisites: [] as string[] })
  const [isAddingSubject, setIsAddingSubject] = useState(false)

  // Obtener todas las materias para seleccionar prerequisitos
  const allSubjects = years.flatMap((year) => year.subjects)

  // Función para verificar si una materia puede estar disponible
  const checkAvailability = (subject: Subject, allSubjects: Subject[]): boolean => {
    if (subject.approved) return true
    return subject.prerequisites.every((prereqId) => {
      const prereq = allSubjects.find((s) => s.id === prereqId)
      return prereq?.approved || false
    })
  }

  // Actualizar disponibilidad de todas las materias
  const updateAvailability = (updatedYears: YearData[]) => {
    const allSubjects = updatedYears.flatMap((year) => year.subjects)

    return updatedYears.map((yearData) => ({
      ...yearData,
      subjects: yearData.subjects.map((subject) => ({
        ...subject,
        available: checkAvailability(subject, allSubjects),
      })),
    }))
  }

  // Manejar cambio de estado de materia
  const handleSubjectToggle = (subjectId: string) => {
    const updatedYears = years.map((yearData) => ({
      ...yearData,
      subjects: yearData.subjects.map((subject) =>
        subject.id === subjectId ? { ...subject, approved: !subject.approved } : subject,
      ),
    }))

    setYears(updateAvailability(updatedYears))
  }

  // Agregar nueva materia
  const addSubject = () => {
    if (!newSubject.name.trim()) return

    const newId = `subject_${Date.now()}`
    const updatedYears = years.map((yearData) => {
      if (yearData.year === newSubject.year) {
        return {
          ...yearData,
          subjects: [
            ...yearData.subjects,
            {
              id: newId,
              name: newSubject.name,
              year: newSubject.year,
              prerequisites: newSubject.prerequisites,
              approved: false,
              available: newSubject.prerequisites.length === 0,
            },
          ],
        }
      }
      return yearData
    })

    setYears(updateAvailability(updatedYears))
    setNewSubject({ name: "", year: 1, prerequisites: [] })
    setIsAddingSubject(false)
  }

  // Agregar nuevo año
  const addYear = () => {
    const newYear = Math.max(...years.map((y) => y.year)) + 1
    setYears([...years, { year: newYear, subjects: [] }])
  }

  // Eliminar materia
  const removeSubject = (subjectId: string) => {
    const updatedYears = years.map((yearData) => ({
      ...yearData,
      subjects: yearData.subjects.filter((subject) => subject.id !== subjectId),
    }))
    setYears(updateAvailability(updatedYears))
  }

  // Obtener el estado visual de una materia
  const getSubjectStatus = (subject: Subject) => {
    if (subject.approved) return "approved"
    if (subject.available) return "available"
    return "locked"
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-50 border-green-200 text-green-800 hover:bg-green-100"
      case "available":
        return "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100"
      case "locked":
        return "bg-gray-50 border-gray-200 text-gray-500"
      default:
        return "bg-white border-gray-200"
    }
  }

  const getStatusIcon = (subject: Subject) => {
    if (subject.approved) return <CheckCircle2 className="h-4 w-4 text-green-600" />
    if (subject.available) return <Circle className="h-4 w-4 text-blue-600" />
    return <Lock className="h-4 w-4 text-gray-400" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-16 w-16 text-indigo-600 mx-auto mb-4 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Malla Curricular Universitaria</h1>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">Malla Curricular Interactiva</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Organiza tu carrera universitaria de forma visual e intuitiva. Haz clic en las materias para marcarlas como aprobadas 
            y descubre automáticamente qué materias se desbloquean para cursar. ¡Visualiza tu progreso académico de manera fácil!
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-2xl mx-auto">
            <h3 className="font-semibold text-blue-800 mb-2">💡 ¿Cómo usar la aplicación?</h3>
            <ul className="text-sm text-blue-700 text-left space-y-1">
              <li>• <strong>Haz clic</strong> en una materia disponible para marcarla como aprobada</li>
              <li>• Las materias <strong>verdes</strong> ya están aprobadas</li>
              <li>• Las materias <strong>azules</strong> están disponibles para cursar</li>
              <li>• Las materias <strong>grises</strong> están bloqueadas por correlativas</li>
            </ul>
          </div>
        </div>

        {/* Controles */}
        <div className="flex gap-4 mb-8 justify-center flex-wrap">
          <Button onClick={addYear} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Año
          </Button>
          <Link href="/about">
            <Button variant="outline">
              <GraduationCap className="h-4 w-4 mr-2" />
              ¿Cómo usar la app?
            </Button>
          </Link>
        </div>

        {/* Grilla de Años */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {years.map((yearData) => (
            <Card key={yearData.year} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-center text-xl font-bold">{yearData.year}° Año</CardTitle>
                <div className="text-center text-sm opacity-90">
                  {yearData.subjects.filter((s) => s.approved).length} / {yearData.subjects.length} aprobadas
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {yearData.subjects.map((subject) => {
                    const status = getSubjectStatus(subject)
                    return (
                      <div
                        key={subject.id}
                        className={`p-3 rounded-lg border-2 transition-all duration-300 cursor-pointer ${getStatusStyles(status)} ${
                          subject.available ? "hover:scale-105" : "cursor-not-allowed"
                        }`}
                        onClick={() => subject.available && handleSubjectToggle(subject.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            {getStatusIcon(subject)}
                            <span className={`font-medium text-sm ${subject.approved ? "line-through" : ""}`}>
                              {subject.name}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeSubject(subject.id)
                            }}
                            className="h-6 w-6 p-0 hover:bg-red-100"
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>

                        {/* Mostrar prerequisitos */}
                        {subject.prerequisites.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {subject.prerequisites.map((prereqId) => {
                              const prereq = allSubjects.find((s) => s.id === prereqId)
                              return prereq ? (
                                <Badge
                                  key={prereqId}
                                  variant={prereq.approved ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {prereq.name}
                                </Badge>
                              ) : null
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {yearData.subjects.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No hay materias en este año</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Leyenda Mejorada */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
            📚 Guía de Estados de Materias
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <span className="font-semibold text-green-800 text-lg">Materia Aprobada</span>
                <p className="text-sm text-green-700 mt-2">
                  ✅ Ya completaste esta materia<br/>
                  ✅ Contribuye a desbloquear correlativas<br/>
                  ✅ Suma a tu progreso académico
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                <Circle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <span className="font-semibold text-blue-800 text-lg">Disponible para Cursar</span>
                <p className="text-sm text-blue-700 mt-2">
                  🎯 Puedes inscribirte ahora<br/>
                  🎯 Todas las correlativas aprobadas<br/>
                  🎯 Haz clic para marcar como aprobada
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-4">
                <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <span className="font-semibold text-gray-600 text-lg">Bloqueada</span>
                <p className="text-sm text-gray-600 mt-2">
                  🔒 Faltan correlativas por aprobar<br/>
                  🔒 Ve los badges rojos para saber cuáles<br/>
                  🔒 Se desbloqueará automáticamente
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
            <h4 className="font-semibold text-indigo-800 mb-3 text-center">
              💡 ¿Cómo planificar tu próximo cuatrimestre?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-700">
              <div>
                <strong>1. Identifica materias azules</strong><br/>
                Son las que puedes cursar ahora
              </div>
              <div>
                <strong>2. Prioriza estratégicamente</strong><br/>
                Elige materias que desbloqueen muchas otras
              </div>
              <div>
                <strong>3. Revisa los prerequisitos</strong><br/>
                Los badges te muestran qué necesitas
              </div>
              <div>
                <strong>4. Actualiza tu progreso</strong><br/>
                Marca como aprobadas al finalizar
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
