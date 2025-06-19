import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      '1f8f-38-25-16-212.ngrok-free.app', //CAMBIAR A NUEVA RUTA NGROK
    ]
  }
})