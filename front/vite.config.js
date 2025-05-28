import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      'a3d6-2800-200-e6e0-611-3534-31a4-c1b2-bc1d.ngrok-free.app', //CAMBIAR A NUEVA RUTA NGROK
    ]
  }
})