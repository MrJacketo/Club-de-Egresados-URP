// Firebase removed - now using JWT authentication
import apiClient from "./apiClient"; // Este debe estar configurado con axios
import auth from "../auth"; // JWT auth system

// ========== MÉTODOS PÚBLICOS ==========
// Obtener beneficios activos (sin autenticación)
export const getBeneficiosActivos = async () => {
  try {
    const response = await apiClient.get("/api/beneficios/activos");
    return response.data?.data || [];
  } catch (error) {
    console.error("Error al obtener beneficios activos:", error);
    return [];
  }
};

// ========== MÉTODOS PARA USUARIOS AUTENTICADOS ==========
// Método original para compatibilidad
export const getBeneficios = async (filtros = {}) => {
  try {
    const response = await apiClient.get("/api/beneficios/ver-beneficios", { params: filtros });
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error("Error al obtener beneficios:", error);
    throw error;
  }
};

// Obtener un beneficio específico por ID
export const getBeneficioById = async (id) => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.get(`/api/beneficios/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Error al obtener beneficio:", error);
    throw error;
  }
};

// Alias para uso de admin en frontend: lista todos los beneficios desde el endpoint público del backend
export const getBeneficiosAdmin = async (filtros = {}) => {
  try {
    const response = await apiClient.get('/api/beneficios/admin/todos', { params: filtros });
    return response.data?.data || response.data || [];
  } catch (err) {
    console.error('Error getBeneficiosAdmin', err);
    return [];
  }
};

// ========== MÉTODOS ADMINISTRATIVOS (CRUD) ==========
// Crear nuevo beneficio
export const createBeneficio = async (beneficioData) => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.post("/api/beneficios/admin/crear", beneficioData);
    return response.data;
  } catch (error) {
    console.error("Error al crear beneficio:", error);
    throw error;
  }
};

// Actualizar beneficio existente
export const updateBeneficio = async (id, beneficioData) => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.put(`/api/beneficios/admin/${id}`, beneficioData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar beneficio:", error);
    throw error;
  }
};

// Eliminar beneficio
export const deleteBeneficio = async (id) => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.delete(`/api/beneficios/admin/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar beneficio:", error);
    throw error;
  }
};

// Obtener estadísticas de beneficios
export const getEstadisticasBeneficios = async () => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.get("/api/beneficios/admin/estadisticas");
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    throw error;
  }
};

// ========== MÉTODOS DE FEEDBACK ==========
export const enviarFeedback = async (feedbackData) => {
  try {
    const response = await apiClient.post("/api/feedback", feedbackData);
    return response.data;
  } catch (error) {
    console.error("Error al enviar feedback:", error);
    throw error;
  }
};

export const getTiposCursos = async () => {
  try {
    const response = await apiClient.get("/tipos-cursos");
    return response.data;
  } catch (error) {
    console.error("Error al obtener tipos de cursos:", error);
    throw error;
  }
};

export const getTemasCursos = async () => {
  try {
    const response = await apiClient.get("/temas-cursos");
    return response.data;
  } catch (error) {
    console.error("Error al obtener temas de cursos:", error);
    throw error;
  }
};

// ========== MÉTODOS DE REDENCIÓN DE BENEFICIOS ==========
export const getBeneficiosRequest = async () => {
  try {
    // Check if user is authenticated
    if (!auth.isAuthenticated()) {
      console.log("Usuario no autenticado");
      return [];
    }

    // JWT token is automatically added by apiClient interceptor
    const response = await apiClient.get("/api/beneficios/ver-beneficios");
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error("Error al obtener beneficios:", error);
    return [];
  }
};

export const getBeneficiosRedimidosRequest = async () => {
  try {
    // Check if user is authenticated
    if (!auth.isAuthenticated()) {
      console.log("Usuario no autenticado");
      return { beneficiosRedimidos: [] };
    }

    // JWT token is automatically added by apiClient interceptor
    const response = await apiClient.get("/api/beneficios/mis-beneficios");
    return response.data || { beneficiosRedimidos: [] };
  } catch (error) {
    console.error("Error al obtener beneficios redimidos:", error);
    return { beneficiosRedimidos: [] };
  }
};

export const redimirBeneficioRequest = async (beneficioId) => {
  try {
    // Check if user is authenticated
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }

    // JWT token is automatically added by apiClient interceptor
    const response = await apiClient.post(
      "/api/beneficios/redimir",
      { beneficioId }
    );

    return response.data;
  } catch (error) {
    console.error("Error al redimir beneficio:", error);
    throw error;
  }
};