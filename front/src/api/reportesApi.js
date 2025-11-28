// front/src/api/reportesApi.js
import apiClient from "./apiClient";

// Obtener todos los reportes
export const obtenerReportes = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();

    Object.keys(filtros).forEach((key) => {
      if (filtros[key] && filtros[key] !== "" && filtros[key] !== "todas") {
        params.append(key, filtros[key]);
      }
    });

    const response = await apiClient.get(`/api/reportes?${params.toString()}`);
    
    if (response.data) {
      return {
        success: true,
        data: response.data
      };
    } else {
      throw new Error("Error al obtener reportes");
    }
  } catch (error) {
    console.error("Error en obtenerReportes:", error);
    throw error;
  }
};

// Obtener reportes públicos (no ocultos)
export const obtenerReportesPublicos = async () => {
  try {
    const response = await apiClient.get("/api/reportes/publicos");
    
    if (response.data) {
      return {
        success: true,
        data: response.data
      };
    } else {
      throw new Error("Error al obtener reportes públicos");
    }
  } catch (error) {
    console.error("Error en obtenerReportesPublicos:", error);
    throw error;
  }
};

// Crear un nuevo reporte
export const crearReporte = async (reporteData) => {
  try {
    const response = await apiClient.post("/api/reportes", reporteData);
    
    if (response.data) {
      return response.data;
    } else {
      throw new Error("Error al crear reporte");
    }
  } catch (error) {
    console.error("Error en crearReporte:", error);
    
    if (error.response) {
      const errorMessage = error.response.data?.mensaje || `Error ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("No se pudo conectar con el servidor");
    } else {
      throw new Error(error.message || "Error desconocido");
    }
  }
};

// Actualizar un reporte
export const actualizarReporte = async (id, reporteData) => {
  try {
    const response = await apiClient.put(`/api/reportes/${id}`, reporteData);
    
    if (response.data) {
      return response.data;
    } else {
      throw new Error("Error al actualizar reporte");
    }
  } catch (error) {
    console.error("Error en actualizarReporte:", error);
    
    if (error.response) {
      const errorMessage = error.response.data?.mensaje || `Error ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("No se pudo conectar con el servidor");
    } else {
      throw new Error(error.message || "Error desconocido");
    }
  }
};

// Ocultar un reporte
export const ocultarReporte = async (id) => {
  try {
    const response = await apiClient.put(`/api/reportes/ocultar/${id}`);
    
    if (response.data) {
      return response.data;
    } else {
      throw new Error("Error al ocultar reporte");
    }
  } catch (error) {
    console.error("Error en ocultarReporte:", error);
    
    if (error.response) {
      const errorMessage = error.response.data?.mensaje || `Error ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("No se pudo conectar con el servidor");
    } else {
      throw new Error(error.message || "Error desconocido");
    }
  }
};

export default {
  obtenerReportes,
  obtenerReportesPublicos,
  crearReporte,
  actualizarReporte,
  ocultarReporte
};