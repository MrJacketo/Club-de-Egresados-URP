import apiClient from './apiClient';
//puede ser con /foros/publicaciones
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

  // 🔹 Crear una nueva publicación
  createPublicacion: async (contenido) => {
    try {
      const response = await apiClient.post('/api/publicaciones', { contenido });
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
