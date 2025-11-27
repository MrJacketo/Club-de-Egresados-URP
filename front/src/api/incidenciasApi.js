import apiClient from './apiClient';

const API_URL = '/api/incidencias';

// Obtener todas las incidencias
export const getIncidenciasRequest = async () => {
  try {
    const response = await apiClient.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener incidencias:', error);
    throw error;
  }
};

// Obtener una incidencia por ID
export const getIncidenciaByIdRequest = async (id) => {
  try {
    const response = await apiClient.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener incidencia con ID ${id}:`, error);
    throw error;
  }
};

// Crear nueva incidencia
export const createIncidenciaRequest = async (incidenciaData) => {
  try {
    const response = await apiClient.post(API_URL, incidenciaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear incidencia:', error);
    throw error;
  }
};

// Actualizar incidencia existente
export const updateIncidenciaRequest = async (id, incidenciaData) => {
  try {
    const response = await apiClient.put(`${API_URL}/${id}`, incidenciaData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar incidencia con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar incidencia
export const deleteIncidenciaRequest = async (id) => {
  try {
    const response = await apiClient.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar incidencia con ID ${id}:`, error);
    throw error;
  }
};

// Ocultar incidencia (actualizar campo oculto)
export const ocultarIncidenciaRequest = async (id) => {
  try {
    const response = await apiClient.patch(`${API_URL}/${id}/ocultar`);
    return response.data;
  } catch (error) {
    console.error(`Error al ocultar incidencia con ID ${id}:`, error);
    throw error;
  }
};

// Mostrar incidencia (quitar campo oculto)
export const mostrarIncidenciaRequest = async (id) => {
  try {
    const response = await apiClient.patch(`${API_URL}/${id}/mostrar`);
    return response.data;
  } catch (error) {
    console.error(`Error al mostrar incidencia con ID ${id}:`, error);
    throw error;
  }
};

// Cambiar estado de incidencia
export const cambiarEstadoIncidenciaRequest = async (id, nuevoEstado) => {
  try {
    const response = await apiClient.patch(`${API_URL}/${id}/estado`, {
      estado: nuevoEstado
    });
    return response.data;
  } catch (error) {
    console.error(`Error al cambiar estado de incidencia con ID ${id}:`, error);
    throw error;
  }
};

// Obtener incidencias filtradas
export const getIncidenciasFiltradas = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Agregar filtros como parámetros de consulta
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.fecha) params.append('fecha', filtros.fecha);
    if (filtros.complejidad) params.append('complejidad', filtros.complejidad);
    if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
    if (filtros.mostrarOcultos !== undefined) params.append('mostrarOcultos', filtros.mostrarOcultos);
    
    const queryString = params.toString();
    const url = queryString ? `${API_URL}?${queryString}` : API_URL;
    
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error al obtener incidencias filtradas:', error);
    throw error;
  }
};

// Obtener estadísticas de incidencias
export const getEstadisticasIncidenciasRequest = async () => {
  try {
    const response = await apiClient.get(`${API_URL}/estadisticas`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas de incidencias:', error);
    throw error;
  }
};

// Exportar reporte de incidencias
export const exportarReporteIncidenciasRequest = async (formato = 'pdf', filtros = {}) => {
  try {
    const params = new URLSearchParams();
    params.append('formato', formato);
    
    // Agregar filtros
    Object.keys(filtros).forEach(key => {
      if (filtros[key] !== null && filtros[key] !== undefined) {
        params.append(key, filtros[key]);
      }
    });
    
    const response = await apiClient.get(`${API_URL}/exportar?${params.toString()}`, {
      responseType: 'blob'
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al exportar reporte de incidencias:', error);
    throw error;
  }
};

export default {
  getIncidenciasRequest,
  getIncidenciaByIdRequest,
  createIncidenciaRequest,
  updateIncidenciaRequest,
  deleteIncidenciaRequest,
  ocultarIncidenciaRequest,
  mostrarIncidenciaRequest,
  cambiarEstadoIncidenciaRequest,
  getIncidenciasFiltradas,
  getEstadisticasIncidenciasRequest,
  exportarReporteIncidenciasRequest
};