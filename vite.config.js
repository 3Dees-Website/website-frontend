import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward all /api requests to the backend in development.
      // The browser makes requests to localhost:5173/api/... and Vite
      // transparently proxies them to localhost:3000/api/... — no CORS issues.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
