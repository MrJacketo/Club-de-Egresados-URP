"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import {
  TIPO_BENEFICIO,
  CURSO_FILTRO,
  POSTGRADO_FILTRO,
  MAESTRIA_TIPOS,
  DOCTORADO_TIPOS,
  CONFERENCIA_FILTRO,
  CONFERENCIA_TEMAS,
} from "../../constants/Beneficios/Beneficios.enum"
import { enviarFeedback } from "../../api/beneficiosApi"

const FeedbackForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    tipoBeneficio: "",
    tipoPostgrado: "",
    tipoEspecifico: "",
    tipoCurso: "",
    tipoConferencia: "",
    tema: "",
    fechaDeseada: "",
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }

      if (field === "tipoBeneficio") {
        newData.tipoPostgrado = ""
        newData.tipoEspecifico = ""
        newData.tipoCurso = ""
        newData.tipoConferencia = ""
        newData.tema = ""
      }

      if (field === "tipoPostgrado") {
        newData.tipoEspecifico = ""
      }

      if (field === "tipoConferencia") {
        newData.tema = ""
      }

      return newData
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await enviarFeedback(formData)
      setShowSuccessModal(true)

      setTimeout(() => {
        setFormData({
          tipoBeneficio: "",
          tipoPostgrado: "",
          tipoEspecifico: "",
          tipoCurso: "",
          tipoConferencia: "",
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

  const SelectField = ({ value, onChange, children, placeholder }) => (
    <select
      value={value}
      onChange={onChange}
      className="w-full p-3 bg-theme-primary text-theme-primary border border-theme rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-accent font-medium transition-theme"
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  )

  const renderTipoPostgradoSelect = () => {
    if (formData.tipoBeneficio === TIPO_BENEFICIO.POSTGRADO) {
      return (
        <SelectField
          value={formData.tipoPostgrado}
          onChange={(e) => handleChange("tipoPostgrado", e.target.value)}
          placeholder="Selecciona un Tipo de Postgrado"
        >
          <option value={POSTGRADO_FILTRO.MAESTRIA}>{POSTGRADO_FILTRO.MAESTRIA}</option>
          <option value={POSTGRADO_FILTRO.DOCTORADO}>{POSTGRADO_FILTRO.DOCTORADO}</option>
        </SelectField>
      )
    }
    return null
  }

  // ... (mantén las demás funciones render igual, solo cambia los estilos de los selects)

  return (
    <div className="bg-theme-secondary rounded-2xl p-6 shadow-lg border border-theme transition-theme">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-3">
          <Send className="w-6 h-6 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold text-theme-primary">
          Solicitar Beneficio
        </h3>
        <p className="text-theme-secondary text-sm mt-2">
          Completa el formulario y te contactaremos pronto
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <SelectField
          value={formData.tipoBeneficio}
          onChange={(e) => handleChange("tipoBeneficio", e.target.value)}
          placeholder="Beneficio Deseado"
        >
          <option value={TIPO_BENEFICIO.POSTGRADO}>Postgrado</option>
          <option value={TIPO_BENEFICIO.CURSO}>Cursos</option>
          <option value={TIPO_BENEFICIO.CONFERENCIA}>Conferencias</option>
        </SelectField>

        {renderTipoPostgradoSelect()}
        {/* ... otros renders ... */}

        {formData.tipoBeneficio && (
          <div>
            <label className="block mb-2 font-medium text-theme-primary text-sm">
              ¿Cuándo quisieras llevarlo?
            </label>
            <input
              type="date"
              value={formData.fechaDeseada}
              onChange={(e) => handleChange("fechaDeseada", e.target.value)}
              className="w-full p-3 bg-theme-primary text-theme-primary border border-theme rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-accent transition-theme"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !formData.tipoBeneficio}
          className="w-full bg-theme-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Enviando...
            </>
          ) : (
            <>
              <Send size={18} />
              Enviar solicitud
            </>
          )}
        </button>
      </form>

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-theme-secondary rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-theme">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-theme-primary">¡Solicitud enviada!</h3>
              <p className="text-theme-secondary">Nos pondremos en contacto pronto</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeedbackForm