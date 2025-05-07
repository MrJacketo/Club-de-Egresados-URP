import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      '7cba-2800-200-e6e0-611-a848-7312-19ca-9a9f.ngrok-free.app', //CAMBIAR A NUEVA RUTA NGROK
    ]
  }
})