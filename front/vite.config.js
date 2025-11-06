import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      "6f3a56cb51cf.ngrok-free.app", //CAMBIAR A NUEVA RUTA NGROK
    ],
  },
});
