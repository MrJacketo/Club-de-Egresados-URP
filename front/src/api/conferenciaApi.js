// JWT authentication
import apiClient from "./apiClient"; // Este debe estar configurado con axios
import auth from "../auth"; // JWT auth system

// ========== MÉTODOS PÚBLICOS ==========
// Obtener conferencias disponibles para inscripción (sin autenticación)
export const getConferenciasDisponibles = async () => {
  try {
    const response = await apiClient.get("/api/conferencias/disponibles");
    return response.data?.data || [];
  } catch (error) {
    console.error("Error al obtener conferencias disponibles:", error);
    return [];
  }
};

// ========== MÉTODOS PARA USUARIOS AUTENTICADOS ==========
// Obtener catálogo de conferencias con filtros
export const getConferencias = async (filtros = {}) => {
  try {
    const response = await apiClient.get("/api/conferencias/catalogo", { params: filtros });
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error("Error al obtener conferencias:", error);
    throw error;
  }
};

// Obtener una conferencia específica por ID
export const getConferenciaById = async (id) => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.get(`/api/conferencias/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Error al obtener conferencia:", error);
    throw error;
  }
};

// ========== MÉTODOS DE INSCRIPCIÓN ==========
// Inscribirse a una conferencia
export const inscribirseConferencia = async (conferencia_id) => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.post("/api/conferencias/inscribirse", { conferencia_id });
    return response.data;
  } catch (error) {
    console.error("Error al inscribirse a conferencia:", error);
    throw error;
  }
};

// Obtener mis inscripciones
export const getMisInscripciones = async (filtros = {}) => {
  try {
    if (!auth.isAuthenticated()) {
      console.log("Usuario no autenticado");
      return [];
    }
    const response = await apiClient.get("/api/conferencias/mis-inscripciones/listado", { params: filtros });
    return response.data?.data || [];
  } catch (error) {
    console.error("Error al obtener mis inscripciones:", error);
    return [];
  }
};

// Cancelar inscripción
export const cancelarInscripcion = async (inscripcionId) => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.put(`/api/conferencias/cancelar-inscripcion/${inscripcionId}`);
    return response.data;
  } catch (error) {
    console.error("Error al cancelar inscripción:", error);
    throw error;
  }
};

// Verificar si está inscrito en una conferencia
export const verificarInscripcion = async (conferencia_id) => {
  try {
    if (!auth.isAuthenticated()) {
      return { inscrito: false, data: null };
    }
    const response = await apiClient.get(`/api/conferencias/verificar-inscripcion/${conferencia_id}`);
    return response.data;
  } catch (error) {
    console.error("Error al verificar inscripción:", error);
    return { inscrito: false, data: null };
  }
};

// Calificar una conferencia
export const calificarConferencia = async (inscripcionId, calificacion, comentario = "") => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.put(`/api/conferencias/calificar/${inscripcionId}`, {
      calificacion,
      comentario
    });
    return response.data;
  } catch (error) {
    console.error("Error al calificar conferencia:", error);
    throw error;
  }
};

// ========== MÉTODOS ADMINISTRATIVOS (CRUD) ==========
// Alias para uso de admin en frontend: lista todas las conferencias
export const getConferenciasAdmin = async (filtros = {}) => {
  try {
    const response = await apiClient.get('/api/conferencias/admin/todas', { params: filtros });
    return response.data?.data || response.data || [];
  } catch (err) {
    console.error('Error getConferenciasAdmin', err);
    return [];
  }
};

// Crear nueva conferencia
export const createConferencia = async (conferenciaData) => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.post("/api/conferencias/admin/crear", conferenciaData);
    return response.data;
  } catch (error) {
    console.error("Error al crear conferencia:", error);
    throw error;
  }
};

// Actualizar conferencia existente
export const updateConferencia = async (id, conferenciaData) => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.put(`/api/conferencias/admin/actualizar/${id}`, conferenciaData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar conferencia:", error);
    throw error;
  }
};

// Eliminar conferencia
export const deleteConferencia = async (id) => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.delete(`/api/conferencias/admin/eliminar/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar conferencia:", error);
    throw error;
  }
};

// Obtener estadísticas de conferencias
export const getEstadisticasConferencias = async () => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.get("/api/conferencias/admin/estadisticas");
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    throw error;
  }
};

// Obtener lista de inscritos de una conferencia (Admin)
export const getInscritosConferencia = async (conferenciaId) => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.get(`/api/conferencias/admin/inscritos/${conferenciaId}`);
    return response.data?.data || [];
  } catch (error) {
    console.error("Error al obtener inscritos:", error);
    throw error;
  }
};

// ========== MÉTODOS AUXILIARES ==========
// Obtener conferencias por estado
export const getConferenciasPorEstado = async (estado) => {
  try {
    const response = await apiClient.get("/api/conferencias/catalogo", { 
      params: { estado } 
    });
    return response.data?.data || [];
  } catch (error) {
    console.error("Error al obtener conferencias por estado:", error);
    return [];
  }
};

// Obtener conferencias por modalidad
export const getConferenciasPorModalidad = async (modalidad) => {
  try {
    const response = await apiClient.get("/api/conferencias/catalogo", { 
      params: { modalidad } 
    });
    return response.data?.data || [];
  } catch (error) {
    console.error("Error al obtener conferencias por modalidad:", error);
    return [];
  }
};

// Obtener conferencias próximas (programadas y con inscripción abierta)
export const getConferenciasProximas = async () => {
  try {
    const response = await apiClient.get("/api/conferencias/disponibles");
    return response.data?.data || [];
  } catch (error) {
    console.error("Error al obtener conferencias próximas:", error);
    return [];
  }
};