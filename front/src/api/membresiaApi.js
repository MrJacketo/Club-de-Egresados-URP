import apiClient from "./apiClient";
// Firebase removed - now using JWT authentication

export const getMembresiaRequest = async () => {
  try {
    // User authentication handled by JWT token in apiClient
    const response = await apiClient.get("/api/membresia");

    return response.data || {
      estado: "inactiva",
      fechaActivacion: null,
      fechaVencimiento: null,
    };
  } catch (error) {
    console.error("Error en getMembresiaRequest:", error);
    return {
      estado: "inactiva",
      fechaActivacion: null,
      fechaVencimiento: null,
    };
  }
};

export const getAllMembresiasRequest = async () => {
  try {
    console.log('🌐 Haciendo petición a /api/membresia/getAll');
    
    const response = await apiClient.get("/api/membresia/getAll");
    
    console.log('📡 Respuesta recibida:', response);
    console.log('📊 Data en response:', response.data);
    console.log('📈 Tipo de response.data:', typeof response.data);
    console.log('📋 Es array:', Array.isArray(response.data));

    return response.data || [];
  } catch (error) {
    console.error("Error obteniendo las membresias", error);
    console.error("Error response:", error.response);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    return [];
  }
};

export const updateMembresiaEstadoRequest = async (userId, nuevoEstado) => {
  try {
    //await auth.authStateReady(); FALTA USUARIO ADMIN
    //const user = auth.currentUser;

    //if (!user) {
      //return []; // No hay usuario → no se puede consultar membresías
    //}

    //const token = await user.getIdToken();
     const response = await apiClient.put(
      `/api/membresia/updateEstado/${userId}`,
      { estado: nuevoEstado }
    );//, {
      //headers: { Authorization: `Bearer ${token}` },
    //});

    return response.data;
  } catch (error) {
    console.error("Error actualizando la membresía:", error);
    throw error;
  }
}

export const activateMembresiaRequest = async () => {
  try {
    // JWT authentication handled by apiClient
    const response = await apiClient.put("/api/membresia/activate");
    return response.data;
  } catch (error) {
    console.error("Error activando membresía:", error.message);
    throw new Error(error.message || "No se pudo activar la membresía.");
  }
};

export const createOrUpdateMembresiaRequest = async (membresiaData) => {
  try {
    // JWT authentication handled by apiClient
    const response = await apiClient.post("/api/membresia", membresiaData);
    return response.data;
  } catch (error) {
    console.error("Error actualizando membresía:", error.message);
    throw new Error(error.message || "No se pudo guardar la membresía.");
  }
};

//ADMIN
export const eliminarMembresiaAdmin = async (userId) => {
  try {
    const response = await apiClient.delete(`/api/membresia/deleteMembresia/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error eliminando membresía desde admin:", error);
    throw new Error("No se pudo eliminar la membresía");
  }
};

export const reclamarBeneficioRequest = async (beneficio) => {
  try {
    const response = await apiClient.post("/api/membresia/agregar-beneficio", beneficio);
    return response.data;
  } catch (error) {
    console.error("Error al reclamar beneficio:", error);
    throw error;
  }
};