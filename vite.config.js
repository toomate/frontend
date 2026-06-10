import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const SSE_URL = env.VITE_SSE_URL

  return {
    plugins: [react()],
    server: {
      host: true,
      proxy: {
        '/sse': {
          target: SSE_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/sse/, '')
        }
      }
    }
  }
})