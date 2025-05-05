import apiClient from "./apiClient";
import { auth } from "../firebase";

export const getMembresiaRequest = async () => {
  try {
    // Espera a que Firebase esté listo
    await auth.authStateReady();
    
    const user = auth.currentUser;
    if (!user) {
      console.log("No hay usuario autenticado");
      return {
        estado: "inactiva",
        beneficios: [
          "Acceso a la bolsa exclusiva de URPex",
          "Conferencias gratuitas",
          "Descuento en diferentes paquetes de cursos"
        ],
        fechaActivacion: null,
        fechaVencimiento: null
      };
    }

    const token = await user.getIdToken();

    const response = await apiClient.get("/api/membresia", {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    return response.data || {
      estado: "inactiva",
      beneficios: [
        "Acceso a la bolsa exclusiva de URPex",
        "Conferencias gratuitas",
        "Descuento en diferentes paquetes de cursos"
      ],
      fechaActivacion: null,
      fechaVencimiento: null
    };

  } catch (error) {
    console.error("Error en getMembresiaRequest:", error);
    return {
      estado: "inactiva",
      beneficios: [
        "Acceso a la bolsa exclusiva de URPex",
        "Conferencias gratuitas",
        "Descuento en diferentes paquetes de cursos"
      ],
      fechaActivacion: null,
      fechaVencimiento: null
    };
  }
};

export const activateMembresiaRequest = async () => {
  try {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error("No autenticado");

    const response = await apiClient.put(
      "/api/membresia/activate",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: (status) => status < 500
      }
    );

    if (response.status >= 400) {
      throw new Error(response.data?.message || "Error al activar membresía");
    }

    return response.data;

  } catch (error) {
    console.error("Error activando membresía:", error.message);
    throw new Error(error.message || "No se pudo activar la membresía. Intente nuevamente.");
  }
};

export const createOrUpdateMembresiaRequest = async (membresiaData) => {
  try {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error("No autenticado");

    const response = await apiClient.post(
      "/api/membresia",
      membresiaData,
      {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: (status) => status < 500
      }
    );

    if (response.status >= 400) {
      throw new Error(response.data?.message || "Error al guardar membresía");
    }

    return response.data;

  } catch (error) {
    console.error("Error actualizando membresía:", error.message);
    throw new Error(error.message || "No se pudo guardar la membresía. Intente nuevamente.");
  }
};