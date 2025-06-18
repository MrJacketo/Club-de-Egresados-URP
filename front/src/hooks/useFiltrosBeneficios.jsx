"use client"

import { useState, useEffect } from "react"
import { filtrarBeneficios } from "../constants/Beneficios/Beneficios.schema"

const useFiltrosBeneficios = () => {
  const [filtros, setFiltros] = useState({
    postgrado: "",
    curso: "",
    conferencia: "",
    modalidad: "",
  })

  const [beneficiosFiltrados, setBeneficiosFiltrados] = useState([])

  useEffect(() => {
    // Aplicar filtros a los beneficios
    const resultados = filtrarBeneficios(filtros)
    setBeneficiosFiltrados(resultados)
  }, [filtros])

  const resetFiltros = () => {
    setFiltros({
      postgrado: "",
      curso: "",
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

export default useFiltrosBeneficios