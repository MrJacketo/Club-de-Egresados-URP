import apiClient from "./apiClient";

export const createSubscriptionRequest = async () => {
  try {
    const response = await apiClient.post("/api/pago/create-order");
    return response.data;
  } catch (error) {
    console.error("Error al crear suscripción:", error);
    throw new Error(
      error.response?.data?.error || "Error al crear suscripción"
    );
  }
};

export const simulatePagoRequest = async () => {
  try {
    const response = await apiClient.post("/api/pago/simular-pago");
    return response.data;
  } catch (error) {
    console.error("Error al simular pago:", error);
    throw new Error(error.response?.data?.error || "Error al simular el pago");
  }
};
