import axios from "axios";
import auth from "../auth";

const apiClient = axios.create({
  baseURL: 
  //"http://localhost:8000"
  "https://silver-succotash-g9r9j75rqg626j5-8000.app.github.dev", // Backend URL CodeSpace
});

apiClient.interceptors.request.use(async (config) => {
  const token = auth.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attach JWT token to Authorization header
  }
  return config;
});

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, logout user
      auth.logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
