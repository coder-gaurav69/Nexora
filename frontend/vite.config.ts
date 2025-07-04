import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'e1b8-103-110-19-243.ngrok-free.app'  // 👈 Add your Ngrok hostname here
    ]
  }
})
