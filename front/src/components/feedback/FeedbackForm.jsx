"use client"

import { useState } from "react"
import {
  TIPO_BENEFICIO,
  CURSO_FILTRO,
  POSTGRADO_FILTRO,
  MAESTRIA_TIPOS,
  DOCTORADO_TIPOS,
  CONFERENCIA_FILTRO,
  CONFERENCIA_TEMAS,
} from "../../constants/Beneficios/Beneficios.enum"
import { enviarFeedback } from "../../api/gestionarBeneficiosApi"

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

      // Reset campos dependientes cuando cambia el tipo principal
      if (field === "tipoBeneficio") {
        newData.tipoPostgrado = ""
        newData.tipoEspecifico = ""
        newData.tipoCurso = ""
        newData.tipoConferencia = ""
        newData.tema = ""
      }

      // Reset tipo específico cuando cambia el tipo de postgrado
      if (field === "tipoPostgrado") {
        newData.tipoEspecifico = ""
      }

      // Reset tema cuando cambia el tipo de conferencia
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

      // Reset form after successful submission
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

  const renderTipoPostgradoSelect = () => {
    if (formData.tipoBeneficio === TIPO_BENEFICIO.POSTGRADO) {
      return (
        <div className="mb-4">
          <select
            value={formData.tipoPostgrado}
            onChange={(e) => handleChange("tipoPostgrado", e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black font-bold"
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

  const renderTipoEspecificoSelect = () => {
    if (formData.tipoBeneficio === TIPO_BENEFICIO.POSTGRADO && formData.tipoPostgrado === POSTGRADO_FILTRO.MAESTRIA) {
      return (
        <div className="mb-4">
          <select
            value={formData.tipoEspecifico}
            onChange={(e) => handleChange("tipoEspecifico", e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black font-bold"
          >
            <option value="">{MAESTRIA_TIPOS.SELECCIONAR}</option>
            <option value={MAESTRIA_TIPOS.ADMINISTRACION}>{MAESTRIA_TIPOS.ADMINISTRACION}</option>
            <option value={MAESTRIA_TIPOS.DERECHO}>{MAESTRIA_TIPOS.DERECHO}</option>
            <option value={MAESTRIA_TIPOS.EDUCACION}>{MAESTRIA_TIPOS.EDUCACION}</option>
            <option value={MAESTRIA_TIPOS.INGENIERIA}>{MAESTRIA_TIPOS.INGENIERIA}</option>
            <option value={MAESTRIA_TIPOS.CYBERSEGURIDAD}>{MAESTRIA_TIPOS.CYBERSEGURIDAD}</option>
            <option value={MAESTRIA_TIPOS.SALUD}>{MAESTRIA_TIPOS.SALUD}</option>
            <option value={MAESTRIA_TIPOS.INTELIGENCIA_ARTIFICIAL}>{MAESTRIA_TIPOS.INTELIGENCIA_ARTIFICIAL}</option>
            <option value={MAESTRIA_TIPOS.FINANZAS}>{MAESTRIA_TIPOS.FINANZAS}</option>
          </select>
        </div>
      )
    } else if (
      formData.tipoBeneficio === TIPO_BENEFICIO.POSTGRADO &&
      formData.tipoPostgrado === POSTGRADO_FILTRO.DOCTORADO
    ) {
      return (
        <div className="mb-4">
          <select
            value={formData.tipoEspecifico}
            onChange={(e) => handleChange("tipoEspecifico", e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black font-bold"
          >
            <option value="">{DOCTORADO_TIPOS.SELECCIONAR}</option>
            <option value={DOCTORADO_TIPOS.DERECHO}>{DOCTORADO_TIPOS.DERECHO}</option>
            <option value={DOCTORADO_TIPOS.EDUCACION}>{DOCTORADO_TIPOS.EDUCACION}</option>
            <option value={DOCTORADO_TIPOS.INGENIERIA}>{DOCTORADO_TIPOS.INGENIERIA}</option>
            <option value={DOCTORADO_TIPOS.CIENCIAS_POLITICAS}>{DOCTORADO_TIPOS.CIENCIAS_POLITICAS}</option>
            <option value={DOCTORADO_TIPOS.NEUROCIENCIAS}>{DOCTORADO_TIPOS.NEUROCIENCIAS}</option>
          </select>
        </div>
      )
    }
    return null
  }

  const renderTipoCursoSelect = () => {
    if (formData.tipoBeneficio === TIPO_BENEFICIO.CURSO) {
      return (
        <div className="mb-4">
          <select
            value={formData.tipoCurso}
            onChange={(e) => handleChange("tipoCurso", e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black font-bold"
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
    }
    return null
  }

  const renderTipoConferenciaSelect = () => {
    if (formData.tipoBeneficio === TIPO_BENEFICIO.CONFERENCIA) {
      return (
        <div className="mb-4">
          <select
            value={formData.tipoConferencia}
            onChange={(e) => handleChange("tipoConferencia", e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black font-bold"
          >
            <option value="">Seleccionar un Tipo de Conferencia</option>
            <option value={CONFERENCIA_FILTRO.ADMINISTRACION_GERENCIA}>
              {CONFERENCIA_FILTRO.ADMINISTRACION_GERENCIA}
            </option>
            <option value={CONFERENCIA_FILTRO.ADMINISTRACION_NEGOCIOS}>
              {CONFERENCIA_FILTRO.ADMINISTRACION_NEGOCIOS}
            </option>
            <option value={CONFERENCIA_FILTRO.ARQUITECTURA}>{CONFERENCIA_FILTRO.ARQUITECTURA}</option>
            <option value={CONFERENCIA_FILTRO.BIOLOGIA}>{CONFERENCIA_FILTRO.BIOLOGIA}</option>
            <option value={CONFERENCIA_FILTRO.CONTABILIDAD}>{CONFERENCIA_FILTRO.CONTABILIDAD}</option>
            <option value={CONFERENCIA_FILTRO.DERECHO}>{CONFERENCIA_FILTRO.DERECHO}</option>
            <option value={CONFERENCIA_FILTRO.ECONOMIA}>{CONFERENCIA_FILTRO.ECONOMIA}</option>
            <option value={CONFERENCIA_FILTRO.ING_CIVIL}>{CONFERENCIA_FILTRO.ING_CIVIL}</option>
            <option value={CONFERENCIA_FILTRO.ING_ELECTRONICA}>{CONFERENCIA_FILTRO.ING_ELECTRONICA}</option>
            <option value={CONFERENCIA_FILTRO.ING_INDUSTRIAL}>{CONFERENCIA_FILTRO.ING_INDUSTRIAL}</option>
            <option value={CONFERENCIA_FILTRO.ING_INFORMATICA}>{CONFERENCIA_FILTRO.ING_INFORMATICA}</option>
            <option value={CONFERENCIA_FILTRO.ING_MECATRONICA}>{CONFERENCIA_FILTRO.ING_MECATRONICA}</option>
            <option value={CONFERENCIA_FILTRO.MARKETING}>{CONFERENCIA_FILTRO.MARKETING}</option>
            <option value={CONFERENCIA_FILTRO.MEDICINA_HUMANA}>{CONFERENCIA_FILTRO.MEDICINA_HUMANA}</option>
            <option value={CONFERENCIA_FILTRO.MEDICINA_VETERINARIA}>{CONFERENCIA_FILTRO.MEDICINA_VETERINARIA}</option>
            <option value={CONFERENCIA_FILTRO.PSICOLOGIA}>{CONFERENCIA_FILTRO.PSICOLOGIA}</option>
            <option value={CONFERENCIA_FILTRO.TRADUCCION}>{CONFERENCIA_FILTRO.TRADUCCION}</option>
            <option value={CONFERENCIA_FILTRO.TURISMO}>{CONFERENCIA_FILTRO.TURISMO}</option>
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
            className="w-full p-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black font-bold"
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
    } else if (formData.tipoBeneficio === TIPO_BENEFICIO.CONFERENCIA && formData.tipoConferencia) {
      return (
        <div className="mb-4">
          <select
            value={formData.tema}
            onChange={(e) => handleChange("tema", e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black font-bold"
          >
            <option value="">{CONFERENCIA_TEMAS.SELECCIONAR}</option>
            <option value={CONFERENCIA_TEMAS.INTELIGENCIA_ARTIFICIAL}>
              {CONFERENCIA_TEMAS.INTELIGENCIA_ARTIFICIAL}
            </option>
            <option value={CONFERENCIA_TEMAS.ARQUITECTURA_SOSTENIBLE}>
              {CONFERENCIA_TEMAS.ARQUITECTURA_SOSTENIBLE}
            </option>
            <option value={CONFERENCIA_TEMAS.MEDICINA_GENOMICA}>{CONFERENCIA_TEMAS.MEDICINA_GENOMICA}</option>
            <option value={CONFERENCIA_TEMAS.ECONOMIA_POST_PANDEMIA}>{CONFERENCIA_TEMAS.ECONOMIA_POST_PANDEMIA}</option>
            <option value={CONFERENCIA_TEMAS.PSICOLOGIA_CLINICA}>{CONFERENCIA_TEMAS.PSICOLOGIA_CLINICA}</option>
            <option value={CONFERENCIA_TEMAS.MARKETING_DIGITAL}>{CONFERENCIA_TEMAS.MARKETING_DIGITAL}</option>
            <option value={CONFERENCIA_TEMAS.TECNOLOGIA_EDUCATIVA}>{CONFERENCIA_TEMAS.TECNOLOGIA_EDUCATIVA}</option>
            <option value={CONFERENCIA_TEMAS.SOSTENIBILIDAD_EMPRESARIAL}>
              {CONFERENCIA_TEMAS.SOSTENIBILIDAD_EMPRESARIAL}
            </option>
            <option value={CONFERENCIA_TEMAS.INNOVACION_MEDICA}>{CONFERENCIA_TEMAS.INNOVACION_MEDICA}</option>
          </select>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <h3 className="text-center text-xl font-bold mb-6 text-black">Solicitar Beneficio</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <select
            value={formData.tipoBeneficio}
            onChange={(e) => handleChange("tipoBeneficio", e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black font-bold"
          >
            <option value="">Beneficio Deseado</option>
            <option value={TIPO_BENEFICIO.POSTGRADO}>Postgrado</option>
            <option value={TIPO_BENEFICIO.CURSO}>Cursos</option>
            <option value={TIPO_BENEFICIO.CONFERENCIA}>Conferencias</option>
          </select>
        </div>

        {renderTipoPostgradoSelect()}
        {renderTipoEspecificoSelect()}
        {renderTipoCursoSelect()}
        {renderTipoConferenciaSelect()}
        {renderTemaSelect()}

        {formData.tipoBeneficio && (
          <div className="mb-4">
            <p className="mb-2 font-medium text-black">¿Cuándo quisieras llevarlo?</p>
            <input
              type="date"
              value={formData.fechaDeseada}
              onChange={(e) => handleChange("fechaDeseada", e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            />
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading || !formData.tipoBeneficio}
            className="bg-bkack border-2 border-green-800 hover:bg-green-50 text-black font-bold py-3 px-8 rounded-lg transition-colors"
            style={{ color: "" }}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-black">¡Envío Exitoso!</h3>
            <p className="text-black">Tu solicitud ha sido enviada correctamente.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeedbackForm