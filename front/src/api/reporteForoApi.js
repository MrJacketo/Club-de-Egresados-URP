// front/src/api/reporteForoApi.js
import apiClient from "./apiClient";

// Crear reporte de foro
export const crearReporteForo = async (reporteData) => {
  try {
    const response = await apiClient.post("/api/reportes-foro", reporteData);
    return response.data;
  } catch (error) {
    console.error("Error en crearReporteForo:", error);
    throw error;
  }
};

// Obtener reportes de foro (para moderadores)
export const obtenerReportesForo = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();

    Object.keys(filtros).forEach((key) => {
      if (filtros[key] && filtros[key] !== "" && filtros[key] !== "todos") {
        params.append(key, filtros[key]);
      }
    });

    const response = await apiClient.get(`/api/reportes-foro?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error en obtenerReportesForo:", error);
    throw error;
  }
};

// Obtener reporte específico por ID
export const obtenerReportePorId = async (id) => {
  try {
    const response = await apiClient.get(`/api/reportes-foro/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error en obtenerReportePorId:", error);
    throw error;
  }
};

// Resolver reporte
export const resolverReporte = async (id, accionData) => {
  try {
    const response = await apiClient.put(`/api/reportes-foro/${id}/resolver`, accionData);
    return response.data;
  } catch (error) {
    console.error("Error en resolverReporte:", error);
    throw error;
  }
};

// Ocultar reporte
export const ocultarReporteForo = async (id) => {
  try {
    const response = await apiClient.put(`/api/reportes-foro/${id}/ocultar`);
    return response.data;
  } catch (error) {
    console.error("Error en ocultarReporteForo:", error);
    throw error;
  }
};

// Obtener estadísticas de reportes
export const obtenerEstadisticasReportes = async () => {
  try {
    const response = await apiClient.get("/api/reportes-foro/estadisticas");
    return response.data;
  } catch (error) {
    console.error("Error en obtenerEstadisticasReportes:", error);
    throw error;
  }
};

export default {
  crearReporteForo,
  obtenerReportesForo,
  obtenerReportePorId,
  resolverReporte,
  ocultarReporteForo,
  obtenerEstadisticasReportes
};