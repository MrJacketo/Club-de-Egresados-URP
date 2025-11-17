import apiClient from "./apiClient";
import auth from "../auth";

// Obtener ofertas para inspección
export const getOfertasParaInspeccion = async (filtros = {}) => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.get("/api/inspeccion-laboral/ofertas", { params: filtros });
    return response.data;
  } catch (error) {
    console.error("Error al obtener ofertas:", error);
    throw error;
  }
};

// Obtener estadísticas de inspección
export const getEstadisticasInspeccion = async () => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.get("/api/inspeccion-laboral/estadisticas");
    return response.data;
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    throw error;
  }
};

// Obtener lista de empresas
export const getEmpresas = async () => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.get("/api/inspeccion-laboral/empresas");
    return response.data;
  } catch (error) {
    console.error("Error al obtener empresas:", error);
    throw error;
  }
};

// Obtener detalle de una oferta
export const getDetalleOferta = async (ofertaId) => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.get(`/api/inspeccion-laboral/ofertas/${ofertaId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener detalle de oferta:", error);
    throw error;
  }
};

// Bloquear/Desbloquear oferta
export const toggleBloqueoOferta = async (ofertaId, motivo = "") => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.put(`/api/inspeccion-laboral/ofertas/${ofertaId}/bloqueo`, {
      motivo
    });
    return response.data;
  } catch (error) {
    console.error("Error al cambiar estado de oferta:", error);
    throw error;
  }
};

// Suspender/Reactivar empresa
export const toggleSuspensionEmpresa = async (nombreEmpresa, suspender, motivo = "") => {
  try {
    if (!auth.isAuthenticated()) {
      throw new Error("Usuario no autenticado");
    }
    const response = await apiClient.put(`/api/inspeccion-laboral/empresas/${encodeURIComponent(nombreEmpresa)}/suspension`, {
      suspender,
      motivo
    });
    return response.data;
  } catch (error) {
    console.error("Error al cambiar estado de empresa:", error);
    throw error;
  }
};
