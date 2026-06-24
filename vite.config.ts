import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  optimizeDeps: {
    include: ['leaflet']
  },
  server: {
    allowedHosts: [
      'cca5-182-253-97-194.ngrok-free.app'
    ],
    proxy: {
      '/api': {
        target: 'https://dash.petrolog.my.id',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
