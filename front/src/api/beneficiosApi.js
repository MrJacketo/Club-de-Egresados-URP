import { auth } from "../firebase"; // Ajusta la ruta según corresponda
import apiClient from "./apiClient"; // Este debe estar configurado con axios

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