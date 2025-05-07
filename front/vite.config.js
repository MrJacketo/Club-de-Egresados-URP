import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      '9f12-2800-200-e6e0-611-e58c-b508-5f0d-e69b.ngrok-free.app', //CAMBIAR A NUEVA RUTA LOCALTUNNEL
    ]
  }
})