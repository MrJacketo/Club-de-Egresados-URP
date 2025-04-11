import axios from "axios";
import { auth } from "./firebase";

const apiClient = axios.create({
    baseURL: "http://localhost:8000", // Backend URL
});

apiClient.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;