"use client"
import SelectField from "../shared/SelectField"
import { MODALIDAD } from "../../constants/Beneficios/Beneficios.enum"

const FiltrosBeneficio = ({ filtros, setFiltros, opciones }) => {
  const handleFiltroChange = (tipo, valor) => {
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      [tipo]: valor,
    }))
  }

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      <div>
        <SelectField
          label="Postgrado"
          value={filtros.postgrado || ""}
          onChange={(e) => handleFiltroChange("postgrado", e.target.value)}
          options={[
            { value: "", label: "Seleccionar un Postgrado" },
            { value: "Maestria", label: "Maestría" },
            { value: "Doctorado", label: "Doctorado" },
          ]}
        />
      </div>

      <div>
        <SelectField
          label="Cursos"
          value={filtros.curso || ""}
          onChange={(e) => handleFiltroChange("curso", e.target.value)}
          options={[
            { value: "", label: "Seleccionar un Curso" },
            { value: "Administración y Gerencia", label: "Administración y Gerencia" },
            { value: "Arquitectura", label: "Arquitectura" },
            { value: "Ing. Informática", label: "Ing. Informática" },
          ]}
        />
      </div>

      <div>
        <SelectField
          label="Conferencias"
          value={filtros.conferencia || ""}
          onChange={(e) => handleFiltroChange("conferencia", e.target.value)}
          options={[
            { value: "", label: "Seleccionar una Conferencia" },
            { value: "Administración y Gerencia", label: "Administración y Gerencia" },
            { value: "Arquitectura", label: "Arquitectura" },
            { value: "Ing. Informática", label: "Ing. Informática" },
          ]}
        />
      </div>

      <div>
        <SelectField
          label="Modalidad"
          value={filtros.modalidad || ""}
          onChange={(e) => handleFiltroChange("modalidad", e.target.value)}
          options={[
            { value: "", label: "Seleccionar Modalidad" },
            { value: MODALIDAD.PRESENCIAL, label: "Presencial" },
            { value: MODALIDAD.VIRTUAL, label: "Virtual" },
            { value: MODALIDAD.HIBRIDO, label: "Híbrido" },
          ]}
        />
      </div>
    </div>
  )
}

export default FiltrosBeneficio