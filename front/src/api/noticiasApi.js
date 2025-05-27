import apiClient from "./apiClient";
import { auth } from "../firebase";

// Obtener todas las noticias
export const obtenerNoticias = () => apiClient.get("/api/noticias");

// Obtener noticias destacadas
export const obtenerNoticiasDestacadas = () => apiClient.get("/api/noticias/destacadas");

// Obtener una noticia por ID
export const obtenerNoticiaPorId = (id) => apiClient.get(`/api/noticias/${id}`);

// Crear una nueva noticia
export const crearNoticia = (datos) => apiClient.post("/api/noticias", datos);

// Actualizar una noticia existente
export const actualizarNoticia = (id, datos) => apiClient.put(`/api/noticias/${id}`, datos);

// Eliminar (soft delete) una noticia
export const eliminarNoticia = (id) => apiClient.delete(`/api/noticias/${id}`);

// Obtener noticias con autenticación (token)
export const obtenerNoticiasConAuthRequest = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");
    const token = await user.getIdToken();
    const response = await apiClient.get("/api/noticias", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.noticias;
  } catch (error) {
    console.error("Error al obtener noticias autenticadas:", error);
    throw error;
  }
};