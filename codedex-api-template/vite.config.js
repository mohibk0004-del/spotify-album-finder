// e:\projects\git spotify album finder\codedex-api-template\vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: '0.0.0.0', // Listen on all network interfaces
    strictPort: false,
  }
})