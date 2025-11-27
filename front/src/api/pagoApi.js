import apiClient from "./apiClient";

// Crear preferencia de pago y obtener URL de Checkout Pro
export const createPreferenceRequest = async () => {
  try {
    const response = await apiClient.post("/api/pago/create-preference");
    return response.data; // Retorna { id, init_point, sandbox_init_point }
  } catch (error) {
    console.error("Error al crear preferencia de pago:", error);
    throw new Error(
      error.response?.data?.error || "Error al crear preferencia de pago"
    );
  }
};

// Verificar el estado del pago después de la redirección
export const verifyPaymentRequest = async (paymentId, externalReference) => {
  try {
    const response = await apiClient.get("/api/pago/verify-payment", {
      params: {
        payment_id: paymentId,
        external_reference: externalReference,
      },
    });
    return response.data; // Retorna { success, status, membresia }
  } catch (error) {
    console.error("Error al verificar pago:", error);
    throw new Error(
      error.response?.data?.error || "Error al verificar el pago"
    );
  }
};

// Simular pago aprobado (solo para desarrollo/testing)
export const simulatePagoRequest = async () => {
  try {
    const response = await apiClient.post("/api/pago/simular-pago");
    return response.data;
  } catch (error) {
    console.error("Error al simular pago:", error);
    throw new Error(error.response?.data?.error || "Error al simular el pago");
  }
};

// Verificar y activar membresía basado en pagos recientes del usuario
export const checkAndActivateMembershipRequest = async () => {
  try {
    const response = await apiClient.post("/api/pago/check-membership");
    return response.data;
  } catch (error) {
    console.error("Error al verificar membresía:", error);
    throw new Error(
      error.response?.data?.message || "Error al verificar la membresía"
    );
  }
};

// Mantener compatibilidad con código existente
export const createSubscriptionRequest = createPreferenceRequest;
