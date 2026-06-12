import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
console.log("-----------------------------------------");
console.log("VITE_API_BASE_URL during build:", process.env.VITE_API_BASE_URL);
console.log("-----------------------------------------");

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // Development server — localhost only (security: not 0.0.0.0)
    host: 'localhost',
    port: 5173,
    proxy: {
      // Proxy /api calls to backend in development
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})

