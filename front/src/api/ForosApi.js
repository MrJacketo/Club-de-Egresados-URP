import apiClient from './apiClient';

export const forosApi = {
  // 🔹 Obtener todas las publicaciones visibles
  getAllPublicaciones: async () => {
    try {
      const response = await apiClient.get('/api/publicaciones');
      return response.data;
    } catch (error) {
      console.error('Error al obtener publicaciones:', error);
      throw error;
    }
  },

  // 🔹 Crear una nueva publicación (texto + multimedia opcional)
  createPublicacion: async ({ contenido, archivo, autor }) => {
    try {
      const formData = new FormData();
      if (contenido) formData.append('contenido', contenido);
      if (autor) formData.append('autor', autor);
      if (archivo) formData.append('archivo', archivo);

      const response = await apiClient.post('/api/publicaciones', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear publicación:', error);
      throw error;
    }
  },

  // 🔹 Agregar un comentario a una publicación
  addComentario: async (publicacionId, autor, contenido) => {
    try {
      const response = await apiClient.post(`/api/publicaciones/${publicacionId}/comentarios`, {
        autor,
        contenido,
      });
      return response.data;
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      throw error;
    }
  },

  // 🔹 Dar o quitar like a una publicación
  toggleLike: async (publicacionId, userId) => {
    try {
      const response = await apiClient.put(`/api/publicaciones/${publicacionId}/like`, {
        userId,
      });
      return response.data;
    } catch (error) {
      console.error('Error al dar o quitar like:', error);
      throw error;
    }
  },

  // 🔹 Ocultar una publicación
  ocultarPublicacion: async (publicacionId) => {
    try {
      const response = await apiClient.put(`/api/publicaciones/${publicacionId}/ocultar`);
      return response.data;
    } catch (error) {
      console.error('Error al ocultar publicación:', error);
      throw error;
    }
  },
};

export default forosApi;
