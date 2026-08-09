import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Proxy /tequilapi/* → Mysterium node TequilAPI on localhost:4050
      '/tequilapi': {
        target: 'http://localhost:4050',
        changeOrigin: true,
        rewrite: (p: string) => p.replace(/^\/tequilapi/, ''),
        configure: (proxy: any) => {
          proxy.on('error', () => { /* silently handle if Mysterium node is offline */ })
        },
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['recharts'],
        },
      },
    },
  },
})
