"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, GraduationCap, Lock, CheckCircle2, Circle, Trash2, Edit3, LogOut, BookOpen } from "lucide-react"

interface Subject {
  id: string
  name: string
  code?: string
  credits?: number
  approved: boolean
  prerequisites: {
    prerequisite_id: string
    prerequisite_subject: {
      id: string
      name: string
      approved: boolean
    }
  }[]
}

interface Year {
  id: string
  number: number
  name: string
  subjects: Subject[]
}

interface Curriculum {
  id: string
  name: string
  description?: string
  years: Year[]
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [curriculums, setCurriculums] = useState<Curriculum[]>([])
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAddingSubject, setIsAddingSubject] = useState(false)
  const [isAddingYear, setIsAddingYear] = useState(false)
  const [isCreatingCurriculum, setIsCreatingCurriculum] = useState(false)
  const [isEditingCurriculum, setIsEditingCurriculum] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)

  const [newSubject, setNewSubject] = useState({
    name: "",
    code: "",
    credits: "",
    yearId: "",
    prerequisites: [] as string[],
  })

  const [newYear, setNewYear] = useState({
    number: "",
    name: "",
  })

  const [newCurriculum, setNewCurriculum] = useState({
    name: "",
    description: "",
  })

  const [editCurriculumForm, setEditCurriculumForm] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push("/auth")
      return
    }

    fetchCurriculums()
  }, [user, authLoading, router])

  const fetchCurriculums = async () => {
    try {
      const { data: curriculumsData, error } = await supabase
        .from("curriculums")
        .select(`
          *,
          years (
            *,
            subjects (
              *,
              prerequisites (
                prerequisite_id,
                prerequisite_subject:subjects!prerequisites_prerequisite_id_fkey (
                  id,
                  name,
                  approved
                )
              )
            )
          )
        `)
        .order("created_at", { ascending: true })

      if (error) throw error

      // Ordenar años y materias
      const processedCurriculums =
        curriculumsData?.map((curriculum) => ({
          ...curriculum,
          years: curriculum.years
            .sort((a: any, b: any) => a.number - b.number)
            .map((year: any) => ({
              ...year,
              subjects: year.subjects.sort((a: any, b: any) => a.name.localeCompare(b.name)),
            })),
        })) || []

      setCurriculums(processedCurriculums)
      if (processedCurriculums.length > 0) {
        setSelectedCurriculum(processedCurriculums[0])
      }
    } catch (error) {
      console.error("Error fetching curriculums:", error)
    } finally {
      setLoading(false)
    }
  }

  const createCurriculum = async () => {
    if (!user || !newCurriculum.name.trim()) return

    try {
      const { error } = await supabase.from("curriculums").insert([
        {
          name: newCurriculum.name,
          description: newCurriculum.description,
          user_id: user.id,
        },
      ])

      if (error) throw error

      await fetchCurriculums()
      setNewCurriculum({ name: "", description: "" })
      setIsCreatingCurriculum(false)
    } catch (error) {
      console.error("Error creating curriculum:", error)
    }
  }

  const updateCurriculum = async () => {
    if (!selectedCurriculum || !editCurriculumForm.name.trim()) return

    try {
      const { error } = await supabase
        .from("curriculums")
        .update({
          name: editCurriculumForm.name,
          description: editCurriculumForm.description,
        })
        .eq("id", selectedCurriculum.id)

      if (error) throw error

      await fetchCurriculums()
      setIsEditingCurriculum(false)
    } catch (error) {
      console.error("Error updating curriculum:", error)
    }
  }

  const openEditCurriculum = () => {
    if (selectedCurriculum) {
      setEditCurriculumForm({
        name: selectedCurriculum.name,
        description: selectedCurriculum.description || "",
      })
      setIsEditingCurriculum(true)
    }
  }

  const addYear = async () => {
    if (!selectedCurriculum || !newYear.name.trim() || !newYear.number) return

    try {
      const { error } = await supabase.from("years").insert([
        {
          number: Number.parseInt(newYear.number),
          name: newYear.name,
          curriculum_id: selectedCurriculum.id,
        },
      ])

      if (error) throw error

      await fetchCurriculums()
      setNewYear({ number: "", name: "" })
      setIsAddingYear(false)
    } catch (error) {
      console.error("Error adding year:", error)
    }
  }

  const addSubject = async () => {
    if (!newSubject.name.trim() || !newSubject.yearId) return

    try {
      // Insertar la materia
      const { data: subjectData, error: subjectError } = await supabase
        .from("subjects")
        .insert([
          {
            name: newSubject.name,
            code: newSubject.code || null,
            credits: newSubject.credits ? Number.parseInt(newSubject.credits) : null,
            year_id: newSubject.yearId,
          },
        ])
        .select()
        .single()

      if (subjectError) throw subjectError

      // Insertar prerequisitos si los hay
      if (newSubject.prerequisites.length > 0) {
        const prerequisitesData = newSubject.prerequisites.map((prereqId) => ({
          subject_id: subjectData.id,
          prerequisite_id: prereqId,
        }))

        const { error: prereqError } = await supabase.from("prerequisites").insert(prerequisitesData)

        if (prereqError) throw prereqError
      }

      await fetchCurriculums()
      setNewSubject({ name: "", code: "", credits: "", yearId: "", prerequisites: [] })
      setIsAddingSubject(false)
    } catch (error) {
      console.error("Error adding subject:", error)
    }
  }

  const updateSubject = async (subjectId: string, updates: any) => {
    try {
      const { error } = await supabase.from("subjects").update(updates).eq("id", subjectId)

      if (error) throw error

      await fetchCurriculums()
    } catch (error) {
      console.error("Error updating subject:", error)
    }
  }

  const deleteSubject = async (subjectId: string) => {
    try {
      const { error } = await supabase.from("subjects").delete().eq("id", subjectId)

      if (error) throw error

      await fetchCurriculums()
    } catch (error) {
      console.error("Error deleting subject:", error)
    }
  }

  const toggleSubjectApproval = (subject: Subject) => {
    updateSubject(subject.id, { approved: !subject.approved })
  }

  const isSubjectAvailable = (subject: Subject): boolean => {
    if (subject.approved) return true
    return subject.prerequisites.every((prereq) => prereq.prerequisite_subject.approved)
  }

  const getSubjectStatus = (subject: Subject) => {
    if (subject.approved) return "approved"
    if (isSubjectAvailable(subject)) return "available"
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
    const status = getSubjectStatus(subject)
    if (status === "approved") return <CheckCircle2 className="h-4 w-4 text-green-600" />
    if (status === "available") return <Circle className="h-4 w-4 text-blue-600" />
    return <Lock className="h-4 w-4 text-gray-400" />
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth")
  }

  const allSubjects = selectedCurriculum?.years.flatMap((year) => year.subjects) || []

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-indigo-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!selectedCurriculum && curriculums.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">Malla Curricular</h1>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>

          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No tienes currículos creados</h2>
              <p className="text-gray-600 mb-6">
                Crea tu primer currículo para comenzar a gestionar tu malla curricular
              </p>

              <Dialog open={isCreatingCurriculum} onOpenChange={setIsCreatingCurriculum}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Currículo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Currículo</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="curriculum-name">Nombre del Currículo</Label>
                      <Input
                        id="curriculum-name"
                        value={newCurriculum.name}
                        onChange={(e) => setNewCurriculum({ ...newCurriculum, name: e.target.value })}
                        placeholder="Ej: Ingeniería en Sistemas"
                      />
                    </div>
                    <div>
                      <Label htmlFor="curriculum-description">Descripción (opcional)</Label>
                      <Input
                        id="curriculum-description"
                        value={newCurriculum.description}
                        onChange={(e) => setNewCurriculum({ ...newCurriculum, description: e.target.value })}
                        placeholder="Descripción del currículo"
                      />
                    </div>
                    <Button onClick={createCurriculum} className="w-full">
                      Crear Currículo
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-gray-900">{selectedCurriculum?.name || "Malla Curricular"}</h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openEditCurriculum}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
              {selectedCurriculum?.description && <p className="text-gray-600">{selectedCurriculum.description}</p>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Controles */}
        <div className="flex gap-4 mb-8 justify-center flex-wrap">
          <Dialog open={isAddingSubject} onOpenChange={setIsAddingSubject}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Materia
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Agregar Nueva Materia</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject-name">Nombre de la Materia</Label>
                  <Input
                    id="subject-name"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    placeholder="Ej: Matemática III"
                  />
                </div>
                <div>
                  <Label htmlFor="subject-code">Código (opcional)</Label>
                  <Input
                    id="subject-code"
                    value={newSubject.code}
                    onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                    placeholder="Ej: MAT301"
                  />
                </div>
                <div>
                  <Label htmlFor="subject-credits">Créditos (opcional)</Label>
                  <Input
                    id="subject-credits"
                    type="number"
                    value={newSubject.credits}
                    onChange={(e) => setNewSubject({ ...newSubject, credits: e.target.value })}
                    placeholder="Ej: 4"
                  />
                </div>
                <div>
                  <Label htmlFor="subject-year">Año</Label>
                  <Select
                    value={newSubject.yearId}
                    onValueChange={(value) => setNewSubject({ ...newSubject, yearId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar año" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCurriculum?.years.map((year) => (
                        <SelectItem key={year.id} value={year.id}>
                          {year.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Materias Prerequisito</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                    {allSubjects
                      .filter((s) => s.id !== newSubject.yearId)
                      .map((subject) => (
                        <div key={subject.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={subject.id}
                            checked={newSubject.prerequisites.includes(subject.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewSubject({
                                  ...newSubject,
                                  prerequisites: [...newSubject.prerequisites, subject.id],
                                })
                              } else {
                                setNewSubject({
                                  ...newSubject,
                                  prerequisites: newSubject.prerequisites.filter((id) => id !== subject.id),
                                })
                              }
                            }}
                          />
                          <Label htmlFor={subject.id} className="text-sm">
                            {subject.name}
                          </Label>
                        </div>
                      ))}
                  </div>
                </div>
                <Button onClick={addSubject} className="w-full">
                  Agregar Materia
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddingYear} onOpenChange={setIsAddingYear}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Año
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Año</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="year-number">Número del Año</Label>
                  <Input
                    id="year-number"
                    type="number"
                    value={newYear.number}
                    onChange={(e) => setNewYear({ ...newYear, number: e.target.value })}
                    placeholder="Ej: 4"
                  />
                </div>
                <div>
                  <Label htmlFor="year-name">Nombre del Año</Label>
                  <Input
                    id="year-name"
                    value={newYear.name}
                    onChange={(e) => setNewYear({ ...newYear, name: e.target.value })}
                    placeholder="Ej: Cuarto Año"
                  />
                </div>
                <Button onClick={addYear} className="w-full">
                  Agregar Año
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Grilla de Años */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {selectedCurriculum?.years.map((year) => (
            <Card key={year.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-center text-xl font-bold">{year.name}</CardTitle>
                <div className="text-center text-sm opacity-90">
                  {year.subjects.filter((s) => s.approved).length} / {year.subjects.length} aprobadas
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {year.subjects.map((subject) => {
                    const status = getSubjectStatus(subject)
                    const available = isSubjectAvailable(subject)

                    return (
                      <div
                        key={subject.id}
                        className={`p-3 rounded-lg border-2 transition-all duration-300 cursor-pointer ${getStatusStyles(status)} ${
                          available ? "hover:scale-105" : "cursor-not-allowed"
                        }`}
                        onClick={() => available && toggleSubjectApproval(subject)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            {getStatusIcon(subject)}
                            <div className="flex-1">
                              <span className={`font-medium text-sm ${subject.approved ? "line-through" : ""}`}>
                                {subject.name}
                              </span>
                              {subject.code && <div className="text-xs text-gray-500">{subject.code}</div>}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingSubject(subject)
                              }}
                              className="h-6 w-6 p-0 hover:bg-blue-100"
                            >
                              <Edit3 className="h-3 w-3 text-blue-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteSubject(subject.id)
                              }}
                              className="h-6 w-6 p-0 hover:bg-red-100"
                            >
                              <Trash2 className="h-3 w-3 text-red-500" />
                            </Button>
                          </div>
                        </div>

                        {/* Mostrar prerequisitos */}
                        {subject.prerequisites.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {subject.prerequisites.map((prereq) => (
                              <Badge
                                key={prereq.prerequisite_id}
                                variant={prereq.prerequisite_subject.approved ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {prereq.prerequisite_subject.name}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {subject.credits && (
                          <div className="mt-1 text-xs text-gray-500">{subject.credits} créditos</div>
                        )}
                      </div>
                    )
                  })}

                  {year.subjects.length === 0 && (
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

        {/* Leyenda */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Leyenda</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm">Materia Aprobada</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Disponible para Cursar</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-gray-400" />
              <span className="text-sm">Bloqueada (Faltan Correlativas)</span>
            </div>
          </div>
        </div>

        {/* Dialog para editar currículo */}
        <Dialog open={isEditingCurriculum} onOpenChange={setIsEditingCurriculum}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Currículo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-curriculum-name">Nombre del Currículo</Label>
                <Input
                  id="edit-curriculum-name"
                  value={editCurriculumForm.name}
                  onChange={(e) => setEditCurriculumForm({ ...editCurriculumForm, name: e.target.value })}
                  placeholder="Ej: Ingeniería en Sistemas, Medicina, Derecho..."
                />
              </div>
              <div>
                <Label htmlFor="edit-curriculum-description">Descripción</Label>
                <Input
                  id="edit-curriculum-description"
                  value={editCurriculumForm.description}
                  onChange={(e) => setEditCurriculumForm({ ...editCurriculumForm, description: e.target.value })}
                  placeholder="Descripción del currículo"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={updateCurriculum} className="flex-1">
                  Guardar Cambios
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditingCurriculum(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para editar materia */}
        <Dialog open={!!editingSubject} onOpenChange={() => setEditingSubject(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Materia</DialogTitle>
            </DialogHeader>
            {editingSubject && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-subject-name">Nombre de la Materia</Label>
                  <Input
                    id="edit-subject-name"
                    value={editingSubject.name}
                    onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-subject-code">Código</Label>
                  <Input
                    id="edit-subject-code"
                    value={editingSubject.code || ""}
                    onChange={(e) => setEditingSubject({ ...editingSubject, code: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-subject-credits">Créditos</Label>
                  <Input
                    id="edit-subject-credits"
                    type="number"
                    value={editingSubject.credits || ""}
                    onChange={(e) =>
                      setEditingSubject({ ...editingSubject, credits: Number.parseInt(e.target.value) || undefined })
                    }
                  />
                </div>
                <Button
                  onClick={() => {
                    updateSubject(editingSubject.id, {
                      name: editingSubject.name,
                      code: editingSubject.code,
                      credits: editingSubject.credits,
                    })
                    setEditingSubject(null)
                  }}
                  className="w-full"
                >
                  Guardar Cambios
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
