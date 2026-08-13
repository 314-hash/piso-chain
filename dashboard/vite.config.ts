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
    host: true,
    open: true,
    proxy: {
      // Proxy /tequilapi/* → Mysterium node TequilAPI on 127.0.0.1:4050
      '/tequilapi': {
        target: 'http://127.0.0.1:4050',
        changeOrigin: true,
        rewrite: (p: string) => p.replace(/^\/tequilapi/, ''),
        configure: (proxy: any) => {
          proxy.on('error', (_err: any, _req: any, res: any) => {
            // Silently return empty json if Mysterium node is offline locally
            if (res && !res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Mysterium node offline' }))
            }
          })
        },
      },
      // Proxy /api/* → Python REST API server on 127.0.0.1:8081
      '/api': {
        target: 'http://127.0.0.1:8081',
        changeOrigin: true,
      },
      // Proxy /rpc/* → PISO Chain JSON-RPC on 127.0.0.1:8545
      '/rpc': {
        target: 'http://127.0.0.1:8545',
        changeOrigin: true,
        rewrite: (p: string) => p.replace(/^\/rpc/, ''),
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
