

import { useState, useEffect } from "react"
import { conferenciasData, filtrarConferencias } from "../constants/Conferencias/Conferencias.schema"
import { filtrarBeneficios } from "../constants/Beneficios/Beneficios.schema"

const useFiltrosConferencias = () => {
  const [filtros, setFiltros] = useState({
    conferencia: "",
    modalidad: "",
  })

  const [beneficiosFiltrados, setBeneficiosFiltrados] = useState([])

  useEffect(() => {
    // Aplicar filtros a los beneficios
    const resultados = filtrarConferencias(filtros)
    setBeneficiosFiltrados(resultados)
  }, [filtros])

  const resetFiltros = () => {
    setFiltros({
      conferencia: "",
      modalidad: "",
    })
  }

  return {
    filtros,
    setFiltros,
    beneficiosFiltrados,
    resetFiltros,
  }
}

export default useFiltrosConferencias