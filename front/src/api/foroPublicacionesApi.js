// front/src/api/foroPublicacionesApi.js - VERSIÓN COMPLETA
import apiClient from "./apiClient";

// Obtener publicaciones
export const obtenerPublicaciones = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();

    // Agregar paginación por defecto
    if (!filtros.page) params.append("page", "1");
    if (!filtros.limit) params.append("limit", "10");

    Object.keys(filtros).forEach((key) => {
      if (filtros[key] && filtros[key] !== "" && filtros[key] !== "todas") {
        params.append(key, filtros[key]);
      }
    });

    const response = await apiClient.get(`/api/publicaciones?${params.toString()}`);
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.error || "Error al obtener publicaciones");
    }
  } catch (error) {
    console.error("Error en obtenerPublicaciones:", error);
    throw error;
  }
};

// Crear publicación
export const crearPublicacion = async (publicacionData) => {
  try {
    const response = await apiClient.post("/api/publicaciones", publicacionData);
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.error || "Error al crear publicación");
    }
  } catch (error) {
    console.error("Error en crearPublicacion:", error);
    
    if (error.response) {
      const errorMessage = error.response.data?.error || `Error ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("No se pudo conectar con el servidor");
    } else {
      throw new Error(error.message || "Error desconocido");
    }
  }
};

// Subir imagen
export const subirImagen = async (archivo) => {
  try {
    const formData = new FormData();
    formData.append('imagen', archivo);

    const response = await apiClient.post('/api/upload/imagen', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.error || "Error al subir imagen");
    }
  } catch (error) {
    console.error("Error en subirImagen:", error);
    
    if (error.response) {
      const errorMessage = error.response.data?.error || `Error ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("No se pudo conectar con el servidor");
    } else {
      throw new Error(error.message || "Error desconocido");
    }
  }
};

// Agregar comentario
export const comentarPublicacion = async (id, comentario) => {
  try {
    const response = await apiClient.post(`/api/publicaciones/${id}/comentarios`, {
      contenido: comentario
    });
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.error || "Error al agregar comentario");
    }
  } catch (error) {
    console.error("Error en comentarPublicacion:", error);
    
    if (error.response) {
      const errorMessage = error.response.data?.error || `Error ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("No se pudo conectar con el servidor");
    } else {
      throw new Error(error.message || "Error desconocido");
    }
  }
};

// Dar like
export const darLikePublicacion = async (id) => {
  try {
    const response = await apiClient.post(`/api/publicaciones/${id}/like`);
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.error || "Error al dar like");
    }
  } catch (error) {
    console.error("Error en darLikePublicacion:", error);
    
    if (error.response) {
      const errorMessage = error.response.data?.error || `Error ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("No se pudo conectar con el servidor");
    } else {
      throw new Error(error.message || "Error desconocido");
    }
  }
};

// Quitar like
export const quitarLikePublicacion = async (id) => {
  try {
    const response = await apiClient.delete(`/api/publicaciones/${id}/like`);
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.error || "Error al quitar like");
    }
  } catch (error) {
    console.error("Error en quitarLikePublicacion:", error);
    
    if (error.response) {
      const errorMessage = error.response.data?.error || `Error ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("No se pudo conectar con el servidor");
    } else {
      throw new Error(error.message || "Error desconocido");
    }
  }
};

// Obtener publicación por ID
export const obtenerPublicacionPorId = async (id) => {
  try {
    const response = await apiClient.get(`/api/publicaciones/${id}`);
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.error || "Error al obtener publicación");
    }
  } catch (error) {
    console.error("Error en obtenerPublicacionPorId:", error);
    
    if (error.response) {
      const errorMessage = error.response.data?.error || `Error ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("No se pudo conectar con el servidor");
    } else {
      throw new Error(error.message || "Error desconocido");
    }
  }
};

// Obtener publicaciones populares
export const obtenerPublicacionesPopulares = async (limit = 5) => {
  try {
    const response = await apiClient.get(`/api/publicaciones/populares?limit=${limit}`);
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.error || "Error al obtener publicaciones populares");
    }
  } catch (error) {
    console.error("Error en obtenerPublicacionesPopulares:", error);
    throw error;
  }
};

// Eliminar publicación
export const eliminarPublicacion = async (id) => {
  try {
    const response = await apiClient.delete(`/api/publicaciones/${id}`);
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.error || "Error al eliminar publicación");
    }
  } catch (error) {
    console.error("Error en eliminarPublicacion:", error);
    
    if (error.response) {
      const errorMessage = error.response.data?.error || `Error ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("No se pudo conectar con el servidor");
    } else {
      throw new Error(error.message || "Error desconocido");
    }
  }
};