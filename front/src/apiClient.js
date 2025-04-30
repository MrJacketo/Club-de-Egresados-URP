import axios from "axios";
import { auth } from "./firebase";

const apiClient = axios.create({
    baseURL: "http://localhost:8000", // URL base del backend
});

// Interceptor para añadir el token de Firebase a cada solicitud
apiClient.interceptors.request.use(
    async (config) => {
        const user = auth.currentUser;
        if (user) {
            try {
                const token = await user.getIdToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error("Error al obtener el token:", error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error); // Si hay un error en la solicitud, rechazarla
    }
);

export default apiClient;
