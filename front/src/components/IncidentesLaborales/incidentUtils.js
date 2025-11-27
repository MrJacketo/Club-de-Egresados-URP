// Utilidades para colores y estilos de incidencias laborales
export const colorSchemes = {
  status: {
    'en revisión': 'bg-blue-100 text-blue-700 border-blue-200',
    'revisado': 'bg-green-100 text-green-700 border-green-200',
    'ocultos': 'bg-gray-100 text-gray-700 border-gray-200',
    'oculto': 'bg-gray-100 text-gray-700 border-gray-200',
    default: 'bg-gray-100 text-gray-700 border-gray-200'
  },
  severity: {
    'alta': 'bg-red-100 text-red-700 border-red-200',
    'high': 'bg-red-100 text-red-700 border-red-200',
    'media': 'bg-orange-100 text-orange-700 border-orange-200',
    'medium': 'bg-orange-100 text-orange-700 border-orange-200',
    'baja': 'bg-green-100 text-green-700 border-green-200',
    'low': 'bg-green-100 text-green-700 border-green-200',
    default: 'bg-gray-100 text-gray-700 border-gray-200'
  },
  type: {
    'información engañosa': 'bg-red-100 text-red-700 border-red-200',
    'empresa no verificada': 'bg-purple-100 text-purple-700 border-purple-200',
    'discriminación': 'bg-pink-100 text-pink-700 border-pink-200',
    'estafa laboral': 'bg-red-100 text-red-700 border-red-200',
    'descripción poco clara': 'bg-blue-100 text-blue-700 border-blue-200',
    'enlaces rotos': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'falta de respuesta': 'bg-gray-100 text-gray-700 border-gray-200',
    'oferta duplicada': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'contenido inapropiado': 'bg-orange-100 text-orange-700 border-orange-200',
    'datos de contacto inválidos': 'bg-teal-100 text-teal-700 border-teal-200',
    'otras incidencias': 'bg-teal-100 text-teal-700 border-teal-200',
    default: 'bg-gray-100 text-gray-700 border-gray-200'
  }
};

// Función unificada para obtener colores
export const getColorScheme = (category, value) => {
  const scheme = colorSchemes[category];
  if (!scheme) return colorSchemes.status.default;
  
  const key = value?.toLowerCase();
  return scheme[key] || scheme.default;
};

// Funciones específicas para compatibilidad con código existente
export const getStatusColor = (status) => getColorScheme('status', status);
export const getSeverityColor = (severity) => getColorScheme('severity', severity);  
export const getTypeColor = (type) => getColorScheme('type', type);

// Tipos de incidencia disponibles
export const INCIDENT_TYPES = [
  'Información engañosa',
  'Descripción poco clara', 
  'Empresa no verificada',
  'Discriminación',
  'Enlaces rotos',
  'Estafa laboral',
  'Falta de respuesta',
  'Oferta duplicada',
  'Contenido inapropiado',
  'Datos de contacto inválidos',
  'Otras Incidencias'
];

// Niveles de complejidad
export const SEVERITY_LEVELS = ['Baja', 'Media', 'Alta'];

// Estados de incidencia
export const INCIDENT_STATES = ['En revisión', 'Revisado'];

// Función para validar email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Función para formatear fecha
export const formatDate = (date) => {
  if (!date) return new Date().toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  return new Date(date).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });
};

// Función para parsear fecha en formato dd/mm/yyyy
export const parseDate = (dateString) => {
  if (!dateString) return new Date();
  const [day, month, year] = dateString.split('/');
  return new Date(year, month - 1, day);
};

// Función para truncar texto
export const truncateText = (text, maxLength = 120) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};