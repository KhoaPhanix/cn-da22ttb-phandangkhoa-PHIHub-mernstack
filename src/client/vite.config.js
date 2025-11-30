import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // Tắt Fast Refresh để tránh reload không cần thiết
      fastRefresh: false,
    }),
  ],
  server: {
    port: 5173,
    strictPort: true, // Báo lỗi nếu port bị chiếm thay vì tự đổi port
    hmr: {
      overlay: false, // Tắt error overlay
      protocol: 'ws',
      host: 'localhost',
    },
    watch: {
      usePolling: false,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/.vscode/**',
      ],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
