"use client"
import {
  MODALIDAD,
  CURSO_FILTRO,
  CONFERENCIA_FILTRO,
  POSTGRADO_FILTRO,
} from "../../constants/Beneficios/Beneficios.enum"

const FiltrosBeneficio = ({ filtros, setFiltros, opciones }) => {
  const handleFiltroChange = (tipo, valor) => {
    setFiltros((prevFiltros) => {
      // Crear un nuevo objeto de filtros limpio
      const nuevosFiltros = {}

      // Solo mantener el filtro que se está cambiando
      if (tipo === "postgrado") {
        nuevosFiltros.postgrado = valor
      } else if (tipo === "curso") {
        nuevosFiltros.curso = valor
      } else if (tipo === "conferencia") {
        nuevosFiltros.conferencia = valor
      } else if (tipo === "modalidad") {
        // La modalidad se puede combinar con otros filtros
        nuevosFiltros.modalidad = valor
        if (prevFiltros.postgrado) nuevosFiltros.postgrado = prevFiltros.postgrado
        if (prevFiltros.curso) nuevosFiltros.curso = prevFiltros.curso
        if (prevFiltros.conferencia) nuevosFiltros.conferencia = prevFiltros.conferencia
      }

      return nuevosFiltros
    })
  }

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      <div>
        <select
          value={filtros.postgrado || ""}
          onChange={(e) => handleFiltroChange("postgrado", e.target.value)}
          className="w-full p-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black font-bold"
        >
          <option value="">{POSTGRADO_FILTRO.SELECCIONAR}</option>
          <option value={POSTGRADO_FILTRO.MAESTRIA}>{POSTGRADO_FILTRO.MAESTRIA}</option>
          <option value={POSTGRADO_FILTRO.DOCTORADO}>{POSTGRADO_FILTRO.DOCTORADO}</option>
        </select>
      </div>

      <div>
        <select
          value={filtros.curso || ""}
          onChange={(e) => handleFiltroChange("curso", e.target.value)}
          className="w-full p-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black font-bold"
        >
          <option value="">{CURSO_FILTRO.SELECCIONAR}</option>
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

      <div>
        <select
          value={filtros.conferencia || ""}
          onChange={(e) => handleFiltroChange("conferencia", e.target.value)}
          className="w-full p-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black font-bold"
        >
          <option value="">{CONFERENCIA_FILTRO.SELECCIONAR}</option>
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

      <div>
        <select
          value={filtros.modalidad || ""}
          onChange={(e) => handleFiltroChange("modalidad", e.target.value)}
          className="w-full p-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black font-bold"
        >
          <option value="">Seleccionar Modalidad</option>
          <option value={MODALIDAD.PRESENCIAL}>Presencial</option>
          <option value={MODALIDAD.VIRTUAL}>Virtual</option>
          <option value={MODALIDAD.HIBRIDO}>Híbrido</option>
        </select>
      </div>
    </div>
  )
}

export default FiltrosBeneficio