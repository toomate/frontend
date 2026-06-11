import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // OneDrive/pastas sincronizadas nao disparam o file watcher nativo de
    // forma confiavel -> o HMR "perde" alteracoes. O polling garante que o
    // Vite detecte as mudancas e recompile.
    watch: {
      usePolling: true,
      interval: 300
    }
  }
})