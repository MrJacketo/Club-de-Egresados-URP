import apiClient from "./apiClient";

export const getGraduateProfileRequest = async () => {
  try {
    const response = await apiClient.get("/api/get-perfil-egresado");
    return response.data;
  } catch (error) {
    console.error("Perfil no encontrado:", error.response?.data || error.message);
    throw error;
  }
};

export const createOrUpdateGraduateProfileRequest = async (profileData) => {
  try {
    const response = await apiClient.post("/api/perfil-egresado", profileData);
    return response.data;
  } catch (error) {
    console.error("Error guardando perfil de egresado:", error.response?.data || error.message);
    throw error;
  }
};

export const OptionsRequest = async () => {
    try {
      const response = await apiClient.get("/api/options");
      return response.data;
    } catch (error) {
      console.error("Opciones no encontradas:", error.response?.data || error.message);
      throw error;
    }
  };