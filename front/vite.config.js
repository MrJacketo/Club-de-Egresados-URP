import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      '62eb-38-25-17-64.ngrok-free.app', //CAMBIAR A NUEVA RUTA NGROK
    ]
  }
})