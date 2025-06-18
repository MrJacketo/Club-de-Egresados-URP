import apiClient from "./apiClient";
import { auth } from "../firebase";

export const getMembresiaRequest = async () => {
  try {
    await auth.authStateReady();
    const user = auth.currentUser;

    if (!user) {
      return {
        estado: "inactiva",
        fechaActivacion: null,
        fechaVencimiento: null,
      };
    }

    const token = await user.getIdToken();
    const response = await apiClient.get("/api/membresia", {
      headers: { Authorization: `Bearer ${token}` },
    });

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

export const activateMembresiaRequest = async () => {
  try {
    const token = await auth.currentUser?.getIdToken();
    const response = await apiClient.put(
      "/api/membresia/activate",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error activando membresía:", error.message);
    throw new Error(error.message || "No se pudo activar la membresía.");
  }
};

export const createOrUpdateMembresiaRequest = async (membresiaData) => {
  try {
    const token = await auth.currentUser?.getIdToken();
    const response = await apiClient.post("/api/membresia", membresiaData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error actualizando membresía:", error.message);
    throw new Error(error.message || "No se pudo guardar la membresía.");
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