"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  GraduationCap, 
  CheckCircle2, 
  Circle, 
  Lock, 
  Users, 
  Target, 
  Lightbulb,
  ArrowLeft,
  BookOpen,
  Calendar,
  TrendingUp,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null)

  const features = [
    {
      icon: <CheckCircle2 className="h-8 w-8 text-green-600" />,
      title: "Seguimiento Visual",
      description: "Marca materias como aprobadas con un simple clic y observa tu progreso en tiempo real.",
      details: "Sistema intuitivo de colores que te permite ver de un vistazo qué materias has completado, cuáles están disponibles y cuáles están bloqueadas."
    },
    {
      icon: <Lock className="h-8 w-8 text-blue-600" />,
      title: "Sistema de Correlativas",
      description: "Descubre automáticamente qué materias se desbloquean al aprobar prerequisitos.",
      details: "El sistema calcula automáticamente las dependencias entre materias, mostrándote exactamente qué necesitas aprobar para avanzar."
    },
    {
      icon: <Calendar className="h-8 w-8 text-purple-600" />,
      title: "Organización por Años",
      description: "Visualiza tu carrera organizada por años académicos de forma clara y ordenada.",
      details: "Cada año se presenta como una tarjeta independiente con estadísticas de progreso y lista de materias correspondientes."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
      title: "Progreso en Tiempo Real",
      description: "Ve tu avance académico actualizado instantáneamente con cada materia aprobada.",
      details: "Estadísticas dinámicas que muestran el porcentaje de materias aprobadas por año y en toda la carrera."
    }
  ]

  const howToUse = [
    {
      step: 1,
      title: "Explora tu Malla Curricular",
      description: "Al abrir la aplicación, verás todas las materias organizadas por años académicos.",
      icon: <BookOpen className="h-6 w-6 text-blue-600" />
    },
    {
      step: 2,
      title: "Marca Materias Aprobadas",
      description: "Haz clic en las materias disponibles (azules) para marcarlas como aprobadas (verde).",
      icon: <CheckCircle2 className="h-6 w-6 text-green-600" />
    },
    {
      step: 3,
      title: "Observa los Desbloqueos",
      description: "Al aprobar materias, otras automáticamente se vuelven disponibles según las correlativas.",
      icon: <Zap className="h-6 w-6 text-yellow-600" />
    },
    {
      step: 4,
      title: "Planifica tu Carrera",
      description: "Usa la información visual para planificar qué materias cursar en próximos cuatrimestres.",
      icon: <Target className="h-6 w-6 text-purple-600" />
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a la Malla
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-indigo-600" />
              <h1 className="text-xl font-bold text-gray-900">Acerca de Malla Curricular Interactiva</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Introducción */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <GraduationCap className="h-12 w-12 text-indigo-600" />
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Malla Curricular Interactiva</h2>
              <p className="text-lg text-gray-600">Tu compañero digital para el éxito académico</p>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Una herramienta moderna y visual para gestionar tu progreso universitario. Diseñada para estudiantes 
              que quieren tener control total sobre su carrera académica, visualizar correlativas de forma intuitiva 
              y planificar su futuro académico con claridad.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Para Estudiantes</h3>
                <p className="text-sm text-gray-600">Organiza tu carrera universitaria</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Planificación</h3>
                <p className="text-sm text-gray-600">Visualiza tu progreso académico</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <Lightbulb className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Intuitivo</h3>
                <p className="text-sm text-gray-600">Interfaz simple y efectiva</p>
              </div>
            </div>
          </div>
        </div>

        {/* Características Principales */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">🚀 Características Principales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  activeFeature === index ? 'ring-2 ring-indigo-500 shadow-lg' : ''
                }`}
                onClick={() => setActiveFeature(activeFeature === index ? null : index)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {feature.icon}
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">{feature.description}</p>
                  {activeFeature === index && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-500">
                      <p className="text-sm text-gray-700">{feature.details}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cómo Usar */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">📖 ¿Cómo usar la aplicación?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howToUse.map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {item.icon}
                  </div>
                  <Badge variant="outline" className="mb-3">Paso {item.step}</Badge>
                  <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Leyenda de Estados */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">🎨 Leyenda de Estados</h3>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <span className="font-semibold text-green-800">Materia Aprobada</span>
                </div>
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700">
                    Has completado exitosamente esta materia. Contribuye al desbloqueo de materias correlativas.
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Circle className="h-6 w-6 text-blue-600" />
                  <span className="font-semibold text-blue-800">Disponible para Cursar</span>
                </div>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    Puedes inscribirte a esta materia. Todos los prerequisitos han sido cumplidos.
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Lock className="h-6 w-6 text-gray-400" />
                  <span className="font-semibold text-gray-600">Bloqueada</span>
                </div>
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3">
                  <p className="text-sm text-gray-600">
                    No disponible aún. Debes aprobar las materias correlativas primero.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips y Consejos */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">💡 Tips y Consejos</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-blue-500">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-blue-800 mb-3">🎯 Planificación Estratégica</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Prioriza materias que desbloqueen múltiples correlativas</li>
                  <li>• Observa los badges de prerequisitos para entender dependencias</li>
                  <li>• Planifica tu cuatrimestre basándote en materias disponibles</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-green-500">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-green-800 mb-3">📊 Maximiza tu Progreso</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Revisa regularmente las estadísticas de progreso por año</li>
                  <li>• Usa la visualización para identificar cuellos de botella</li>
                  <li>• Mantén actualizado tu estado académico para mejores decisiones</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">¿Listo para organizar tu carrera?</h3>
          <p className="text-lg mb-6 opacity-90">
            Comienza a usar Malla Curricular Interactiva y toma control de tu futuro académico
          </p>
          <Link href="/">
            <Button size="lg" variant="secondary">
              <GraduationCap className="h-5 w-5 mr-2" />
              Ir a Mi Malla Curricular
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
