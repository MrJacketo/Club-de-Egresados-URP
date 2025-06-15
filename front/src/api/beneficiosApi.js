import { auth } from "../firebase"; // Ajusta la ruta según corresponda
import apiClient from "./apiClient"; // Este debe estar configurado con axios

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
    await auth.authStateReady();
    const user = auth.currentUser;

    if (!user) return [];

    const token = await auth.currentUser?.getIdToken();
    const response = await apiClient.get("/api/beneficios/ver-beneficios", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener beneficios:", error);
    return [];
  }
};

export const getBeneficiosRedimidosRequest = async () => {
  try {
    await auth.authStateReady();
    const user = auth.currentUser;

    if (!user) return [];

    const token = await user.getIdToken();
    const response = await apiClient.get("/api/beneficios/mis-beneficios", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data || [];
  } catch (error) {
    console.error("Error al obtener beneficios redimidos:", error);
    return [];
  }
};

export const redimirBeneficioRequest = async (beneficioId) => {
  try {
    const token = await auth.currentUser?.getIdToken();

    const response = await apiClient.post(
      "/api/membresia/redimir",
      { beneficioId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al redimir beneficio:", error);
    throw error;
  }
};