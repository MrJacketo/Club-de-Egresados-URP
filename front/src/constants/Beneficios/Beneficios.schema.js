import { TIPO_BENEFICIO, MODALIDAD, AREA, NIVEL } from "./Beneficios.enum"

export const beneficiosData = [
  {
    id: 1,
    tipo: TIPO_BENEFICIO.CURSO,
    titulo: "Lenguaje c#",
    area: AREA.INFORMATICA,
    modalidad: MODALIDAD.PRESENCIAL,
    docente: "Linares",
    nivel: NIVEL.INTERMEDIO,
    descuento: "20%",
    fechaInicio: "10/julio",
    fechaFin: "13/junio",
    tema: "Lenguaje c#",
    imagen: "csharp.png",
  },
  {
    id: 2,
    tipo: TIPO_BENEFICIO.CONFERENCIA,
    titulo: "El avance de las IAS",
    area: AREA.INFORMATICA,
    modalidad: MODALIDAD.VIRTUAL,
    expositor: "Luis pedro Carpio",
    gratuito: true,
    lugar: "Auditorio Ollantaytambo",
    fecha: "22 de Mayo del 2025",
  },
  {
    id: 3,
    tipo: TIPO_BENEFICIO.POSTGRADO,
    titulo: "Cyberseguridad",
    area: "Derecho Constitucional",
    modalidad: MODALIDAD.HIBRIDO,
    docente: "Juan Alberto Quispe",
    descuento: "20%",
    fechaInicio: "Inicio 20/Junio",
    fechaFin: "15/junio",
  },
]

export const filtrarBeneficios = (filtros = {}) => {
  return beneficiosData.filter((beneficio) => {
    // Filtrar por postgrado
    if (filtros.postgrado && beneficio.tipo === TIPO_BENEFICIO.POSTGRADO) {
      if (beneficio.titulo !== filtros.postgrado) {
        return false
      }
    }

    // Filtrar por curso
    if (filtros.curso && beneficio.tipo === TIPO_BENEFICIO.CURSO) {
      if (beneficio.area !== filtros.curso) {
        return false
      }
    }

    // Filtrar por conferencia
    if (filtros.conferencia && beneficio.tipo === TIPO_BENEFICIO.CONFERENCIA) {
      if (beneficio.area !== filtros.conferencia) {
        return false
      }
    }

    // Filtrar por modalidad
    if (filtros.modalidad && beneficio.modalidad !== filtros.modalidad) {
      return false
    }

    // Si no hay filtros activos o el beneficio pasa todos los filtros
    return true
  })
}
