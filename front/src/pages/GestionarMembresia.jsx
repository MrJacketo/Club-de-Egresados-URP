"use client"

import { useState } from "react"
import {
  Calendar,
  Clock,
  Award,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Gift,
  RefreshCw,
  ArrowUpRight,
  User,
} from "lucide-react"

const GestionarMembresia = () => {
  const [beneficiosAbiertos, setBeneficiosAbiertos] = useState(true)

  // Datos simulados de membresía
  const membresia = {
    nombre: "Gabriel Fernández",
    tipo: "Premium",
    inicio: "01/04/2025",
    vencimiento: "01/07/2025",
    estado: "Activa",
    beneficios: [
      "Acceso a la bolsa exclusiva de la URPex",
      "Conferencias gratuitas",
      "Cursos posgrado",
      "Especializaciones",
    ],
  }

  // Calcular días restantes
  const calcularDiasRestantes = () => {
    const hoy = new Date()
    const fechaVencimiento = new Date(
      Number.parseInt(membresia.vencimiento.split("/")[2]),
      Number.parseInt(membresia.vencimiento.split("/")[1]) - 1,
      Number.parseInt(membresia.vencimiento.split("/")[0]),
    )
    const diferencia = fechaVencimiento.getTime() - hoy.getTime()
    return Math.max(0, Math.ceil(diferencia / (1000 * 3600 * 24)))
  }

  const diasRestantes = calcularDiasRestantes()
  const porcentajeCompletado = 100 - Math.min(100, Math.round((diasRestantes / 90) * 100))

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      {/* Cabecera */}
      <header className="w-full py-8 px-6 mt-10 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">Mi Membresía</h1>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 w-full px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Información del usuario */}
          <div className="bg-white/100 backdrop-blur-md rounded-3xl p-6 mb-6 text-black shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{membresia.nombre}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{membresia.tipo}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        membresia.estado === "Activa" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {membresia.estado}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="bg-white/20 hover:bg-white/30 text-white">
                  <RefreshCw size={18} className="mr-2" />
                  Renovar
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white">
                  <ArrowUpRight size={18} className="mr-2" />
                  Actualizar
                </button>
              </div>
            </div>
          </div>

          {/* Secciones de información */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fechas y progreso */}
            <div className="bg-white/100 backdrop-blur-md rounded-3xl p-6 text-black shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Detalles de membresía</h3>

              {/* Información de fechas */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col">
                  <span className="text-sm opacity-70 flex items-center gap-1 mb-1">
                    <Calendar size={14} /> Fecha de inicio
                  </span>
                  <span className="font-medium text-lg">{membresia.inicio}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm opacity-70 flex items-center gap-1 mb-1">
                    <Calendar size={14} /> Fecha de vencimiento
                  </span>
                  <span className="font-medium text-lg">{membresia.vencimiento}</span>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="opacity-70">Progreso de membresía</span>
                  <span className="font-medium">{porcentajeCompletado}%</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-3">
                  <div className="bg-green-800 h-3 rounded-full" style={{ width: `${porcentajeCompletado}%` }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-70 flex items-center">
                    <Clock size={14} className="mr-1" />
                    {diasRestantes} días restantes
                  </span>
                  {diasRestantes < 15 && (
                    <span className="text-xs bg-amber-400/20 border border-amber-400/50 text-white px-2 py-0.5 rounded-full">
                      ¡Próximo a vencer!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Sección de beneficios */}
            <div className="bg-white/100 backdrop-blur-md rounded-3xl p-6 text-white shadow-lg">
              <button
                className="flex justify-between items-center w-full font-semibold text-xl mb-4"
                onClick={() => setBeneficiosAbiertos(!beneficiosAbiertos)}
              >
                <span className="flex items-center">
                  <Award size={20} className="mr-2" />
                  Beneficios incluidos
                </span>
                {beneficiosAbiertos ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {beneficiosAbiertos && (
                <ul className="space-y-3">
                  {membresia.beneficios.map((beneficio, index) => (
                    <li key={index} className="flex items-start gap-3 bg-black/40 p-3 rounded-lg">
                      <CheckCircle size={18} className="text-black mt-0.5 flex-shrink-0" />
                      <span>{beneficio}</span>
                    </li>
                  ))}
                </ul>
              )}

              <button className="w-full mt-6 bg-white/20 hover:bg-white/30 text-white flex items-center justify-center">
                <Gift size={18} className="mr-2" />
                Ver beneficios adicionales
              </button>
            </div>
          </div>

          {/* Acciones adicionales */}
          <div className="bg-white/100 backdrop-blur-md rounded-3xl p-6 mt-6 text-black shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Acciones rápidas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <button className="bg-white/20 hover:bg-white/30 text-white h-auto py-4 flex flex-col items-center justify-center">
                <RefreshCw size={24} className="mb-2" />
                <span>Renovar membresía</span>
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white h-auto py-4 flex flex-col items-center justify-center">
                <Gift size={24} className="mb-2" />
                <span>Beneficios extra</span>
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white h-auto py-4 flex flex-col items-center justify-center">
                <ArrowUpRight size={24} className="mb-2" />
                <span>Actualizar plan</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default GestionarMembresia
