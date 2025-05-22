"use client"

import { useState } from "react"
import { TIPO_BENEFICIO, CURSO_FILTRO, POSTGRADO_FILTRO } from "../../constants/Beneficios/Beneficios.enum"
import { enviarFeedback } from "../../api/beneficiosApi"

const FeedbackForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    tipoBeneficio: "",
    tipoCurso: "",
    tema: "",
    fechaDeseada: "",
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await enviarFeedback(formData)
      setShowSuccessModal(true)

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          tipoBeneficio: "",
          tipoCurso: "",
          tema: "",
          fechaDeseada: "",
        })
        setShowSuccessModal(false)
        if (onSuccess) onSuccess()
      }, 2000)
    } catch (error) {
      console.error("Error al enviar feedback:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderTipoCursoSelect = () => {
    if (formData.tipoBeneficio === TIPO_BENEFICIO.CURSO) {
      return (
        <div className="mb-4">
          <select
            value={formData.tipoCurso}
            onChange={(e) => handleChange("tipoCurso", e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black font-bold"
          >
            <option value="">Selecciona un Tipo Curso</option>
            <option value={CURSO_FILTRO.ADMINISTRACION_GERENCIA}>{CURSO_FILTRO.ADMINISTRACION_GERENCIA}</option>
            <option value={CURSO_FILTRO.ADMINISTRACION_NEGOCIOS}>{CURSO_FILTRO.ADMINISTRACION_NEGOCIOS}</option>
            <option value={CURSO_FILTRO.ARQUITECTURA}>{CURSO_FILTRO.ARQUITECTURA}</option>
            <option value={CURSO_FILTRO.BIOLOGIA}>{CURSO_FILTRO.BIOLOGIA}</option>
            <option value={CURSO_FILTRO.CONTABILIDAD}>{CURSO_FILTRO.CONTABILIDAD}</option>
            <option value={CURSO_FILTRO.DERECHO}>{CURSO_FILTRO.DERECHO}</option>
            <option value={CURSO_FILTRO.ECONOMIA}>{CURSO_FILTRO.ECONOMIA}</option>
            <option value={CURSO_FILTRO.ING_CIVIL}>{CURSO_FILTRO.ING_CIVIL}</option>
            <option value={CURSO_FILTRO.ING_ELECTRONICA}>{CURSO_FILTRO.ING_ELECTRONICA}</option>
            <option value={CURSO_FILTRO.ING_INDUSTRIAL}>{CURSO_FILTRO.ING_INDUSTRIAL}</option>
            <option value={CURSO_FILTRO.ING_INFORMATICA}>{CURSO_FILTRO.ING_INFORMATICA}</option>
            <option value={CURSO_FILTRO.ING_MECATRONICA}>{CURSO_FILTRO.ING_MECATRONICA}</option>
            <option value={CURSO_FILTRO.MARKETING}>{CURSO_FILTRO.MARKETING}</option>
            <option value={CURSO_FILTRO.MEDICINA_HUMANA}>{CURSO_FILTRO.MEDICINA_HUMANA}</option>
            <option value={CURSO_FILTRO.MEDICINA_VETERINARIA}>{CURSO_FILTRO.MEDICINA_VETERINARIA}</option>
            <option value={CURSO_FILTRO.PSICOLOGIA}>{CURSO_FILTRO.PSICOLOGIA}</option>
            <option value={CURSO_FILTRO.TRADUCCION}>{CURSO_FILTRO.TRADUCCION}</option>
            <option value={CURSO_FILTRO.TURISMO}>{CURSO_FILTRO.TURISMO}</option>
          </select>
        </div>
      )
    } else if (formData.tipoBeneficio === TIPO_BENEFICIO.POSTGRADO) {
      return (
        <div className="mb-4">
          <select
            value={formData.tipoCurso}
            onChange={(e) => handleChange("tipoCurso", e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black font-bold"
          >
            <option value="">Selecciona un Tipo de Postgrado</option>
            <option value={POSTGRADO_FILTRO.MAESTRIA}>{POSTGRADO_FILTRO.MAESTRIA}</option>
            <option value={POSTGRADO_FILTRO.DOCTORADO}>{POSTGRADO_FILTRO.DOCTORADO}</option>
          </select>
        </div>
      )
    }
    return null
  }

  const renderTemaSelect = () => {
    if (formData.tipoBeneficio === TIPO_BENEFICIO.CURSO && formData.tipoCurso) {
      return (
        <div className="mb-4">
          <select
            value={formData.tema}
            onChange={(e) => handleChange("tema", e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black font-bold"
          >
            <option value="">Selecciona un Tema</option>
            <option value="Base de Datos II">Base de Datos II</option>
            <option value="Cyberseguridad">Cyberseguridad</option>
            <option value="Desarrollo Web">Desarrollo Web</option>
            <option value="Lenguaje c#">Lenguaje c#</option>
            <option value="Inteligencia Artificial">Inteligencia Artificial</option>
            <option value="Redes y Comunicaciones">Redes y Comunicaciones</option>
          </select>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-center text-xl font-bold mb-6 text-black">Solicitar Beneficio</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <select
            value={formData.tipoBeneficio}
            onChange={(e) => handleChange("tipoBeneficio", e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black font-bold"
          >
            <option value="">Beneficio Deseado</option>
            <option value={TIPO_BENEFICIO.POSTGRADO}>Postgrado</option>
            <option value={TIPO_BENEFICIO.CURSO}>Cursos</option>
            <option value={TIPO_BENEFICIO.CONFERENCIA}>Conferecias</option>
          </select>
        </div>

        {renderTipoCursoSelect()}
        {renderTemaSelect()}

        {formData.tipoBeneficio && (
          <div className="mb-4">
            <p className="mb-2 font-medium text-black">¿Cuándo quisieras llevarlo?</p>
            <input
              type="date"
              value={formData.fechaDeseada}
              onChange={(e) => handleChange("fechaDeseada", e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            />
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading || !formData.tipoBeneficio}
            className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            style={{ color: "white !important" }}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-black">¡Envío Exitoso!</h3>
            <p className="text-black">Tu solicitud ha sido enviada correctamente.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeedbackForm