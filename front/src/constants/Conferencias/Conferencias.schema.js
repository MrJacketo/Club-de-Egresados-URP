import { TIPO_BENEFICIO, MODALIDAD, CONFERENCIA_FILTRO, POSTGRADO_FILTRO } from "./Conferencias.enum"

export const conferenciasData = [
  // Conferencias
  {
    id: 2,
    tipo: TIPO_BENEFICIO.CONFERENCIA,
    titulo: "El avance de las IAS",
    area: CONFERENCIA_FILTRO.ING_INFORMATICA,
    modalidad: MODALIDAD.VIRTUAL,
    expositor: "Luis Pedro Carpio",
    gratuito: true,
    lugar: "Auditorio Ollantaytambo",
    fecha: "22 de Mayo",
  },
  {
    id: 5,
    tipo: TIPO_BENEFICIO.CONFERENCIA,
    titulo: "Tendencias en Arquitectura Sostenible",
    area: CONFERENCIA_FILTRO.ARQUITECTURA,
    modalidad: MODALIDAD.PRESENCIAL,
    expositor: "Carlos Mendoza",
    gratuito: true,
    lugar: "Auditorio Principal",
    fecha: "15 de Junio del 2025",
  },
  {
    id: 7,
    tipo: TIPO_BENEFICIO.CONFERENCIA,
    titulo: "Avances en Medicina Genómica",
    area: CONFERENCIA_FILTRO.MEDICINA_HUMANA,
    modalidad: MODALIDAD.HIBRIDO,
    expositor: "Dra. Ana Gutiérrez",
    gratuito: false,
    lugar: "Centro de Convenciones URP",
    fecha: "10 de Julio del 2025",
  },
  {
    id: 9,
    tipo: TIPO_BENEFICIO.CONFERENCIA,
    titulo: "Economía Post-Pandemia",
    area: CONFERENCIA_FILTRO.ECONOMIA,
    modalidad: MODALIDAD.VIRTUAL,
    expositor: "Dr. Roberto Campos",
    gratuito: true,
    lugar: "Plataforma Zoom",
    fecha: "5 de Agosto",
  },
  {
    id: 15,
    tipo: TIPO_BENEFICIO.CONFERENCIA,
    titulo: "Innovación en Psicología Clínica",
    area: CONFERENCIA_FILTRO.PSICOLOGIA,
    modalidad: MODALIDAD.PRESENCIAL,
    expositor: "Dr. Manuel Sánchez",
    gratuito: true,
    lugar: "Auditorio Central",
    fecha: "12 de Septiembre",
  },
  {
    id: 16,
    tipo: TIPO_BENEFICIO.CONFERENCIA,
    titulo: "Nuevas Tendencias en Marketing Digital",
    area: CONFERENCIA_FILTRO.MARKETING,
    modalidad: MODALIDAD.VIRTUAL,
    expositor: "Lic. Carla Mendoza",
    gratuito: false,
    lugar: "Plataforma Teams",
    fecha: "18 de Octubre",
  },

]

export const filtrarConferencias = (filtros = {}) => {
  return conferenciasData.filter((beneficio) => {

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
    if (
      (filtros.postgrado && beneficio.tipo !== TIPO_BENEFICIO.POSTGRADO) ||
      (filtros.curso && beneficio.tipo !== TIPO_BENEFICIO.CURSO) ||
      (filtros.conferencia && beneficio.tipo !== TIPO_BENEFICIO.CONFERENCIA)
    ) {
      return false
    }

    return true
  })
}
