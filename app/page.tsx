"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"
import { GraduationCap, CheckCircle2, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Subject {
  id: string
  name: string
  year: number
  approved: boolean
}

interface YearData {
  year: number
  subjects: Subject[]
}

export default function HomePage() {
  const { user, loading } = useAuth()

  const [years, setYears] = useState<YearData[]>([
    {
      year: 1,
      subjects: [
        { id: "math1", name: "Análisis Matemático I", year: 1, approved: false },
        { id: "algebra", name: "Álgebra y Geometría", year: 1, approved: false },
        { id: "programming1", name: "Introducción a la Programación", year: 1, approved: false },
        { id: "physics1", name: "Física I", year: 1, approved: false },
        { id: "systems", name: "Sistemas y Organizaciones", year: 1, approved: false },
      ],
    },
    {
      year: 2,
      subjects: [
        { id: "math2", name: "Análisis Matemático II", year: 2, approved: false },
        { id: "programming2", name: "Programación Orientada a Objetos", year: 2, approved: false },
        { id: "discrete", name: "Matemática Discreta", year: 2, approved: false },
        { id: "physics2", name: "Física II", year: 2, approved: false },
        { id: "statistics", name: "Probabilidad y Estadística", year: 2, approved: false },
      ],
    },
    {
      year: 3,
      subjects: [
        { id: "algorithms", name: "Algoritmos y Estructuras de Datos", year: 3, approved: false },
        { id: "databases", name: "Base de Datos", year: 3, approved: false },
        { id: "architecture", name: "Arquitectura de Computadoras", year: 3, approved: false },
        { id: "methods", name: "Métodos Numéricos", year: 3, approved: false },
      ],
    },
  ])

  useEffect(() => {
    // No hacer redirecciones automáticas por ahora
  }, [loading])

  const handleSubjectToggle = (subjectId: string) => {
    setYears(years.map(yearData => ({
      ...yearData,
      subjects: yearData.subjects.map(subject =>
        subject.id === subjectId
          ? { ...subject, approved: !subject.approved }
          : subject
      )
    })))
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
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">Malla Curricular Interactiva</h1>
          </div>
          <p className="text-gray-600 text-lg">
            ¡Bienvenido {user.email}! Gestiona tu progreso universitario
          </p>
        </div>

        {/* Grid de Años */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  {yearData.subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                        subject.approved 
                          ? "bg-green-50 border-green-200 text-green-800" 
                          : "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100"
                      }`}
                      onClick={() => handleSubjectToggle(subject.id)}
                    >
                      <div className="flex items-center gap-2">
                        {subject.approved ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <Circle className="h-4 w-4 text-blue-600" />
                        )}
                        <span className={`font-medium text-sm ${subject.approved ? "line-through" : ""}`}>
                          {subject.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Información básica */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">¿Cómo usar la aplicación?</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Haz clic en una materia para marcarla como aprobada</li>
            <li>• Las materias verdes están aprobadas</li>
            <li>• Las materias azules están disponibles para cursar</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
