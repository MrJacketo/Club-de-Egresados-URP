"use client"
import {
  MODALIDAD,
  CONFERENCIA_FILTRO
} from "../../constants/Conferencias/Conferencias.enum"

const filtrosConferencia = ({ filtros, setFiltros }) => {
  const handleFiltroChange = (tipo, valor) => {
    setFiltros((prevFiltros) => {
      const nuevosFiltros = { ...prevFiltros }

      if (tipo === "conferencia") {
        nuevosFiltros.conferencia = valor
      } else if (tipo === "modalidad") {
        nuevosFiltros.modalidad = valor
      }

      if (!valor) {
        delete nuevosFiltros[tipo]
      }

      return nuevosFiltros
    })
  }

  const SelectFilter = ({ value, onChange, placeholder, children }) => (
    <select
      value={value}
      onChange={onChange}
      className="w-full p-3 bg-theme-primary text-theme-primary border border-theme rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-accent font-medium transition-theme hover:border-theme-accent"
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">


      <SelectFilter
        value={filtros.conferencia || ""}
        onChange={(e) => handleFiltroChange("conferencia", e.target.value)}
        placeholder={CONFERENCIA_FILTRO.SELECCIONAR}
      >
        <option value={CONFERENCIA_FILTRO.ADMINISTRACION_GERENCIA}>{CONFERENCIA_FILTRO.ADMINISTRACION_GERENCIA}</option>
        {/* ... resto de opciones ... */}
      </SelectFilter>

      <SelectFilter
        value={filtros.modalidad || ""}
        onChange={(e) => handleFiltroChange("modalidad", e.target.value)}
        placeholder="Seleccionar Modalidad"
      >
        <option value={MODALIDAD.PRESENCIAL}>Presencial</option>
        <option value={MODALIDAD.VIRTUAL}>Virtual</option>
      </SelectFilter>
    </div>
  )
}

export default filtrosConferencia