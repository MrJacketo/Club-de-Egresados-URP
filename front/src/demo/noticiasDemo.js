// ===== DATOS DE DEMOSTRACIÓN =====
export const noticiasDemo = [
  {
    _id: "1",
    titulo: "Ceremonia de Graduación 2024",
    contenido:
      "La Universidad Ricardo Palma celebrará la ceremonia de graduación de la promoción 2024 el próximo mes de diciembre. Este evento especial reunirá a todos los egresados de las diferentes facultades para celebrar sus logros académicos.",
    resumen: "Ceremonia especial para los nuevos egresados de la Universidad Ricardo Palma.",
    autor: "Administrador URP",
    categoria: "general",
    imagen: "",
    destacado: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    titulo: "Nuevos Beneficios para Egresados",
    contenido:
      "Se han implementado nuevos beneficios exclusivos para todos los egresados de la Universidad Ricardo Palma, incluyendo descuentos en cursos de especialización y acceso a la biblioteca digital.",
    resumen: "Descubre los nuevos beneficios disponibles para la comunidad de egresados.",
    autor: "Oficina de Egresados",
    categoria: "general",
    imagen: "",
    destacado: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "3",
    titulo: "Feria de Empleos Virtual 2024",
    contenido:
      "Próximamente se realizará una feria de empleos virtual exclusiva para egresados URP. Las mejores empresas del país estarán presentes ofreciendo oportunidades laborales.",
    resumen: "Oportunidades laborales exclusivas para egresados URP.",
    autor: "Bolsa de Trabajo",
    categoria: "economia",
    imagen: "",
    destacado: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    _id: "4",
    titulo: "Actualización del Sistema URPex",
    contenido:
      "El sistema URPex ha sido actualizado con nuevas funcionalidades que mejorarán la experiencia de los egresados al acceder a los servicios universitarios.",
    resumen: "Conoce las nuevas características del sistema de egresados.",
    autor: "Equipo Técnico",
    categoria: "tecnologia",
    imagen: "",
    destacado: false,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    _id: "5",
    titulo: "Conferencia de Innovación Tecnológica",
    contenido:
      "La facultad de ingeniería organizará una conferencia sobre las últimas tendencias en innovación tecnológica, dirigida especialmente a egresados del área.",
    resumen: "Evento académico sobre innovación y tecnología para egresados.",
    autor: "Facultad de Ingeniería",
    categoria: "tecnologia",
    imagen: "",
    destacado: false,
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    _id: "6",
    titulo: "Programa de Salud y Bienestar",
    contenido:
      "Nuevo programa de salud y bienestar para egresados, incluyendo consultas médicas con descuento y programas de ejercicio físico.",
    resumen: "Cuida tu salud con nuestro nuevo programa de bienestar.",
    autor: "Centro de Salud URP",
    categoria: "salud",
    imagen: "",
    destacado: false,
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    _id: "7",
    titulo: "Torneo de Fútbol Inter-Egresados",
    contenido:
      "Se realizará el primer torneo de fútbol entre egresados de diferentes promociones. ¡Inscríbete y demuestra tu talento deportivo!",
    resumen: "Participa en el torneo deportivo más esperado del año.",
    autor: "Área de Deportes",
    categoria: "deportes",
    imagen: "",
    destacado: true,
    createdAt: new Date(Date.now() - 518400000).toISOString(),
  },
  {
    _id: "8",
    titulo: "Seminario de Finanzas Personales",
    contenido:
      "Aprende a manejar tus finanzas personales con expertos en el tema. Seminario gratuito para todos los egresados URP.",
    resumen: "Mejora tu educación financiera con nuestros expertos.",
    autor: "Facultad de Economía",
    categoria: "economia",
    imagen: "",
    destacado: false,
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
]

// ===== CONSTANTES =====
export const CATEGORIAS = {
  GENERAL: "general",
  ECONOMIA: "economia",
  TECNOLOGIA: "tecnologia",
  DEPORTES: "deportes",
  SALUD: "salud",
}

export const COLORES_CATEGORIA = {
  [CATEGORIAS.GENERAL]: "#6B7280",
  [CATEGORIAS.ECONOMIA]: "#3B82F6",
  [CATEGORIAS.TECNOLOGIA]: "#8B5CF6",
  [CATEGORIAS.DEPORTES]: "#F97316",
  [CATEGORIAS.SALUD]: "#10B981",
}
