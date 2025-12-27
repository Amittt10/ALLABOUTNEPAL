import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/ALLABOUTNEPAL',
  server: {
    port: 5173,
    hmr: true
  },
  optimizeDeps: {
    include: ['react-jss']
  }
})
