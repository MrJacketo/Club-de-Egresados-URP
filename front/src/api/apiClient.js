import axios from "axios";
import { auth } from "../firebase";

const apiClient = axios.create({
  baseURL: "http://localhost:8000", // Backend URL
});

apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken(); // Retrieve Firebase ID token
    config.headers.Authorization = `Bearer ${token}`; // Attach token to Authorization header
  } else {
    console.error("No user is logged in");
  }
  return config;
});

export default apiClient;
