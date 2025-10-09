// Firebase removed - now using JWT authentication
import apiClient from "./apiClient"; // Este debe estar configurado con axios
import auth from "../auth"; // JWT auth system

//metodos de gestionar feedback
export const getBeneficios = async (filtros = {}) => {
  try {
    const response = await apiClient.get("/beneficios", { params: filtros })
    return response.data
  } catch (error) {
    console.error("Error al obtener beneficios:", error)
    throw error
  }
}

// Alias para uso de admin en frontend: lista todos los beneficios desde el endpoint público del backend
export const getBeneficiosAdmin = async (filtros = {}) => {
  try {
    const response = await apiClient.get('/api/beneficios/ver-beneficios', { params: filtros });
    return response.data || [];
  } catch (err) {
    console.error('Error getBeneficiosAdmin', err);
    return [];
  }
}

export const enviarFeedback = async (feedbackData) => {
  try {
    const response = await apiClient.post("/feedback", feedbackData)
    return response.data
  } catch (error) {
    console.error("Error al enviar feedback:", error)
    throw error
  }
}

export const getTiposCursos = async () => {
  try {
    const response = await apiClient.get("/tipos-cursos")
    return response.data
  } catch (error) {
    console.error("Error al obtener tipos de cursos:", error)
    throw error
  }
}

export const getTemasCursos = async () => {
  try {
    const response = await apiClient.get("/temas-cursos")
    return response.data
  } catch (error) {
    console.error("Error al obtener temas de cursos:", error)
    throw error
  }
}

// metodos de ver-beneficios
export const getBeneficiosRequest = async () => {
  try {
    // Check if user is authenticated
    if (!auth.isAuthenticated()) {
      console.log("Usuario no autenticado");
      return [];
    }

    // JWT token is automatically added by apiClient interceptor
    const response = await apiClient.get("/api/beneficios/ver-beneficios");
    return response.data;
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
      "/api/membresia/redimir",
      { beneficioId }
    );

    return response.data;
  } catch (error) {
    console.error("Error al redimir beneficio:", error);
    throw error;
  }
};