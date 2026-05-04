import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4200,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
            if (id.includes('@mantine')) return 'vendor-mantine';
            if (id.includes('framer-motion')) return 'vendor-framer';
            if (id.includes('tabler-icons-react')) return 'vendor-icons';
            if (id.includes('recharts')) return 'vendor-recharts';
            return 'vendor';
          }
        }
      }
    }
  }
})
