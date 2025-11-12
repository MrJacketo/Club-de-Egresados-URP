import apiClient from "./apiClient";
import auth from "../auth";

// Obtener egresados para moderar
export const getEgresadosParaModerar = async (filtros = {}) => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.get("/api/moderacion/egresados", { params: filtros });
    return response.data;
  } catch (error) {
    console.error("Error al obtener egresados:", error);
    throw error;
  }
};

// Obtener estadísticas de moderación
export const getEstadisticasModeracion = async () => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.get("/api/moderacion/estadisticas");
    return response.data;
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    throw error;
  }
};

// Obtener detalle de un egresado
export const getDetalleEgresado = async (userId) => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.get(`/api/moderacion/egresados/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener detalle del egresado:", error);
    throw error;
  }
};

// Cambiar estado de un egresado (activar/desactivar)
export const toggleEstadoEgresado = async (userId, activo, motivo = "") => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.put(`/api/moderacion/egresados/${userId}/estado`, {
      activo,
      motivo
    });
    return response.data;
  } catch (error) {
    console.error("Error al cambiar estado del egresado:", error);
    throw error;
  }
};
