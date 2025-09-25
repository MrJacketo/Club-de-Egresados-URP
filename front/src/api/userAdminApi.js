import apiClient from "./apiClient";
// Firebase removed - now using JWT authentication

//Obtener todos los usuarios registrados
export const getUsersRequest = async () => {
  try{
    const response = await apiClient.get("/api/admin/users/");
    return response.data; 
  }catch(error){
    console.error("Error al obtener usuarios:", error.response?.data || error.message);
    throw error;
  }
}

export const disableUserRequest = async (userId) => {
  try {
    const response = await apiClient.put(`/api/admin/users/disable/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error al deshabilitar usuario:", error.response?.data || error.message);
    throw error;
  }
}

export const getUserRequest = async (userId) => {
  try {
    const response = await apiClient.get(`/api/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuario:", error.response?.data || error.message);
    throw error;
  }
}