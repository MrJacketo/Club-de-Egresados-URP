import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      '2ce9-2800-200-e6e0-611-aca7-8381-60a5-7f62.ngrok-free.app', //CAMBIAR A NUEVA RUTA NGROK
    ]
  }
})