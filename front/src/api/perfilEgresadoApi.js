import apiClient from "./apiClient";
// Firebase removed - now using JWT authentication

export const getGraduateProfileRequest = async () => {
  try {
    // JWT authentication handled by apiClient
    const response = await apiClient.get("/api/get-perfil-egresado");

    return response.data; // Return the profile data if it exists
  } catch (error) {
    if (error.response?.status === 404) {
      return null; // Return null if the profile doesn't exist
    }
    throw error; // Re-throw other errors
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