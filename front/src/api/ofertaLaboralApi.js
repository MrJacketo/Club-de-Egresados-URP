import { auth } from "../firebase";
import apiClient from "./apiClient";
// Crear o actualizar una oferta laboral
export const createOrUpdateOfertaRequest = async (ofertaData) => {
    try {
        let response;

        if (ofertaData.id) {
            response = await apiClient.put(`/api/oferta/${ofertaData.id}`, ofertaData);
        } else {
            response = await apiClient.post("/api/oferta", ofertaData);
        }

        return response.data;
    } catch (error) {
        console.error("Error al guardar oferta laboral:", error.response?.data || error.message);
        throw error;
    }
};

//Obtener una oferta laboral por ID
export const getOfertaRequest = async (id) => {
    try {
        const response = await apiClient.get(`/api/oferta/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener oferta laboral:", error.response?.data || error.message);
        throw error;
    }
};

//Obtener todas las ofertas laborales
export const getOfertasRequest = async () => {
    try {
        const response = await apiClient.get("/api/ofertas");
        return response.data;
    } catch (error) {
        console.error("Error al obtener ofertas laborales:", error.response?.data || error.message);
        throw error;
    }
}

//Deshabilitar una oferta laboral (cambiar el estado a "Inactivo")
export const disableOfertaRequest = async (id) => {
    try {
        const response = await apiClient.patch(`/api/oferta/${id}/deshabilitar`);
        return response.data;
    } catch (error) {
        console.error("Error al deshabilitar oferta laboral:", error.response?.data || error.message);
        throw error;
    }
};
//Eliminar una oferta laboral por ID
export const deleteOfertaRequest = async (id) => {
    try {
        const response = await apiClient.delete(`/api/oferta/${id}`, {
            headers: {
                Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al eliminar oferta laboral:", error.response?.data || error.message);
        throw error;
    }
};

// Obtener opciones para el formulario de oferta laboral
export const getOptionsRequest = async () => {
    try {
        const response = await apiClient.get("/api/oferta/options");
        return response.data;
    } catch (error) {
        console.error("Error al obtener opciones de oferta laboral:", error.response?.data || error.message);
        throw error;
    }
};
