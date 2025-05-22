import { TIPO_BENEFICIO, MODALIDAD, NIVEL, CURSO_FILTRO, CONFERENCIA_FILTRO, POSTGRADO_FILTRO } from "./Beneficios.enum"

export const beneficiosData = [
  // Cursos
  {
    id: 1,
    tipo: TIPO_BENEFICIO.CURSO,
    titulo: "Lenguaje c#",
    area: CURSO_FILTRO.ING_INFORMATICA,
    modalidad: MODALIDAD.PRESENCIAL,
    docente: "LINAREZ COLOMA, HUMBERTO VICTOR",
    nivel: NIVEL.INTERMEDIO,
    descuento: "20%",
    fechaInicio: "10 de Julio",
    fechaFin: "13 de Junio",
    tema: "Lenguaje c#",
    imagen: "csharp.png",
  },
  {
    id: 4,
    tipo: TIPO_BENEFICIO.CURSO,
    titulo: "Fundamentos de Contabilidad",
    area: CURSO_FILTRO.CONTABILIDAD,
    modalidad: MODALIDAD.PRESENCIAL,
    docente: "María Rodríguez",
    nivel: NIVEL.BASICO,
    descuento: "15%",
    fechaInicio: "5 de Agosto",
    fechaFin: "20 de Julio",
    tema: "Contabilidad Básica",
  },
  {
    id: 6,
    tipo: TIPO_BENEFICIO.CURSO,
    titulo: "Marketing Digital",
    area: CURSO_FILTRO.MARKETING,
    modalidad: MODALIDAD.VIRTUAL,
    docente: "Carlos Mendoza",
    nivel: NIVEL.INTERMEDIO,
    descuento: "10%",
    fechaInicio: "15 de Agosto",
    fechaFin: "30 de jJulio",
    tema: "Marketing Digital",
  },
  {
    id: 8,
    tipo: TIPO_BENEFICIO.CURSO,
    titulo: "Diseño Arquitectónico",
    area: CURSO_FILTRO.ARQUITECTURA,
    modalidad: MODALIDAD.PRESENCIAL,
    docente: "Laura Sánchez",
    nivel: NIVEL.AVANZADO,
    descuento: "25%",
    fechaInicio: "20 de Septiembre",
    fechaFin: "15 de Agosto",
    tema: "Diseño Arquitectónico",
  },

  // Conferencias
  {
    id: 2,
    tipo: TIPO_BENEFICIO.CONFERENCIA,
    titulo: "El avance de las IAS",
    area: CONFERENCIA_FILTRO.ING_INFORMATICA,
    modalidad: MODALIDAD.VIRTUAL,
    expositor: "PEDRO MANUEL CARPIO FARFAN",
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
    fecha: "15 de Junio",
  },
  {
    id: 7,
    tipo: TIPO_BENEFICIO.CONFERENCIA,
    titulo: "Avances en Medicina Genómica",
    area: CONFERENCIA_FILTRO.MEDICINA_HUMANA,
    modalidad: MODALIDAD.HIBRIDO,
    expositor: "Dra. Ana Gutiérrez",
    gratuito: false,
    costo: "S/. 50.00",
    lugar: "Centro de Convenciones URP",
    fecha: "10 de Julio",
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

  // Postgrados
  {
    id: 3,
    tipo: TIPO_BENEFICIO.POSTGRADO,
    titulo: "Cyberseguridad",
    tipoPostgrado: POSTGRADO_FILTRO.MAESTRIA,
    area: "Derecho Constitucional",
    modalidad: MODALIDAD.HIBRIDO,
    docente: "Juan Alberto Quispe",
    descuento: "20%",
    fechaInicio: "Inicio 20 de Junio",
    fechaFin: "15 de junio",
  },
  {
    id: 10,
    tipo: TIPO_BENEFICIO.POSTGRADO,
    titulo: "Administración de Empresas",
    tipoPostgrado: POSTGRADO_FILTRO.MAESTRIA,
    area: "Administración",
    modalidad: MODALIDAD.PRESENCIAL,
    docente: "Dr. Ricardo Palma",
    descuento: "15%",
    fechaInicio: "1 de Septiembre",
    fechaFin: "15 de agosto",
  },
  {
    id: 11,
    tipo: TIPO_BENEFICIO.POSTGRADO,
    titulo: "Educación Superior",
    tipoPostgrado: POSTGRADO_FILTRO.DOCTORADO,
    area: "Educación",
    modalidad: MODALIDAD.HIBRIDO,
    docente: "Dra. Carmen Luz",
    descuento: "10%",
    fechaInicio: "15 de Octubre",
    fechaFin: "30 de septiembre",
  },
  {
    id: 12,
    tipo: TIPO_BENEFICIO.POSTGRADO,
    titulo: "Ingeniería Civil",
    tipoPostgrado: POSTGRADO_FILTRO.DOCTORADO,
    area: "Ingeniería",
    modalidad: MODALIDAD.VIRTUAL,
    docente: "Dr. Jorge Pérez",
    descuento: "25%",
    fechaInicio: "5 de Noviembre",
    fechaFin: "20 de octubre",
  },
]

export const filtrarBeneficios = (filtros = {}) => {
  return beneficiosData.filter((beneficio) => {
    // Filtrar por postgrado
    if (filtros.postgrado && beneficio.tipo === TIPO_BENEFICIO.POSTGRADO) {
      if (beneficio.tipoPostgrado !== filtros.postgrado) {
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