"use client"
import { useState } from "react"
import SelectField from "../shared/SelectField"
import { TIPO_BENEFICIO } from "../../constants/Beneficios/Beneficios.enum"
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
          <SelectField
            label="Selecciona un Tipo Curso"
            value={formData.tipoCurso}
            onChange={(e) => handleChange("tipoCurso", e.target.value)}
            options={[
              { value: "", label: "Selecciona un Tipo Curso" },
              { value: "Administración y Gerencia", label: "Administración y Gerencia" },
              { value: "Arquitectura", label: "Arquitectura" },
              { value: "Ing. Informática", label: "Ing. Informática" },
            ]}
          />
        </div>
      )
    }
    return null
  }

  const renderTemaSelect = () => {
    if (formData.tipoBeneficio === TIPO_BENEFICIO.CURSO && formData.tipoCurso) {
      return (
        <div className="mb-4">
          <SelectField
            label="Selecciona un Tema"
            value={formData.tema}
            onChange={(e) => handleChange("tema", e.target.value)}
            options={[
              { value: "", label: "Selecciona un Tema" },
              { value: "Base de Datos II", label: "Base de Datos II" },
              { value: "Cyberseguridad", label: "Cyberseguridad" },
              { value: "Desarrollo Web", label: "Desarrollo Web" },
            ]}
          />
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-gray-200 rounded-lg p-4">
      <h3 className="text-center text-xl font-bold mb-4">Solicitar Beneficio</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <SelectField
            label="Beneficio Deseado"
            value={formData.tipoBeneficio}
            onChange={(e) => handleChange("tipoBeneficio", e.target.value)}
            options={[
              { value: "", label: "Beneficio Deseado" },
              { value: TIPO_BENEFICIO.POSTGRADO, label: "Postgrado" },
              { value: TIPO_BENEFICIO.CURSO, label: "Cursos" },
              { value: TIPO_BENEFICIO.CONFERENCIA, label: "Conferecias" },
            ]}
          />
        </div>

        {renderTipoCursoSelect()}
        {renderTemaSelect()}

        {formData.tipoBeneficio && (
          <div className="mb-4">
            <SelectField
              label="¿Cuándo quisieras llevarlo?"
              type="date"
              value={formData.fechaDeseada}
              onChange={(e) => handleChange("fechaDeseada", e.target.value)}
            />
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading || !formData.tipoBeneficio}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-8 rounded-full border border-gray-500"
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">¡Envío Exitoso!</h3>
            <p>Tu solicitud ha sido enviada correctamente.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeedbackForm