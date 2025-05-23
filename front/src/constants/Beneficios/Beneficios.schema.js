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
    fechaFin: "30 de Julio",
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
    fechaInicio: "20 de septiembre",
    fechaFin: "15 de Agosto",
    tema: "Diseño Arquitectónico",
  },
  {
    id: 13,
    tipo: TIPO_BENEFICIO.CURSO,
    titulo: "Programación en Python",
    area: CURSO_FILTRO.ING_INFORMATICA,
    modalidad: MODALIDAD.VIRTUAL,
    docente: "Roberto Gómez",
    nivel: NIVEL.BASICO,
    descuento: "30%",
    fechaInicio: "1 de agosto",
    fechaFin: "15 de Julio",
    tema: "Python",
  },
  {
    id: 14,
    tipo: TIPO_BENEFICIO.CURSO,
    titulo: "Gestión de Proyectos",
    area: CURSO_FILTRO.ING_INDUSTRIAL,
    modalidad: MODALIDAD.HIBRIDO,
    docente: "Patricia Vargas",
    nivel: NIVEL.INTERMEDIO,
    descuento: "15%",
    fechaInicio: "10 de septiembre",
    fechaFin: "25 de Agosto",
    tema: "Gestión de Proyectos",
  },

  // Conferencias
  {
    id: 2,
    tipo: TIPO_BENEFICIO.CONFERENCIA,
    titulo: "El avance de las IAS",
    area: CONFERENCIA_FILTRO.ING_INFORMATICA,
    modalidad: MODALIDAD.VIRTUAL,
    expositor: "Luis pedro Carpio",
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
    fechaFin: "15 de Junio",
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
    fechaFin: "20 de Octubre",
  },
  {
    id: 17,
    tipo: TIPO_BENEFICIO.POSTGRADO,
    titulo: "Inteligencia Artificial",
    tipoPostgrado: POSTGRADO_FILTRO.MAESTRIA,
    area: "Informática",
    modalidad: MODALIDAD.VIRTUAL,
    docente: "Dr. Luis Ramírez",
    descuento: "20%",
    fechaInicio: "15 de Agosto",
    fechaFin: "30 de Julio",
  },
  {
    id: 18,
    tipo: TIPO_BENEFICIO.POSTGRADO,
    titulo: "Finanzas Corporativas",
    tipoPostgrado: POSTGRADO_FILTRO.MAESTRIA,
    area: "Economía",
    modalidad: MODALIDAD.PRESENCIAL,
    docente: "Dra. Sofía Mendoza",
    descuento: "15%",
    fechaInicio: "1 de Octubre",
    fechaFin: "15 de Septiembre",
  },
  {
    id: 19,
    tipo: TIPO_BENEFICIO.POSTGRADO,
    titulo: "Ciencias Políticas",
    tipoPostgrado: POSTGRADO_FILTRO.DOCTORADO,
    area: "Derecho",
    modalidad: MODALIDAD.HIBRIDO,
    docente: "Dr. Javier Torres",
    descuento: "30%",
    fechaInicio: "10 de Septiembre",
    fechaFin: "25 de Agosto",
  },
  {
    id: 20,
    tipo: TIPO_BENEFICIO.POSTGRADO,
    titulo: "Neurociencias",
    tipoPostgrado: POSTGRADO_FILTRO.DOCTORADO,
    area: "Medicina",
    modalidad: MODALIDAD.PRESENCIAL,
    docente: "Dra. Elena Gutiérrez",
    descuento: "25%",
    fechaInicio: "20 de Octubre",
    fechaFin: "5 de Octubre",
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
