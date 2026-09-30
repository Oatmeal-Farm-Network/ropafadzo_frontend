import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/saige': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        // Document navigations (typing /saige in the address bar) must hit
        // the React app. Only XHR/fetch (Accept: application/json) go to FastAPI.
        bypass(req) {
          if (req.headers.accept?.includes('text/html')) {
            return '/index.html';
          }
        },
      },
      '/cm': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      // Yahoo Finance chart API (CORS-safe same-origin proxy for commodity quotes fallback)
      '/yf': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/yf/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; OFN/1.0)',
          Accept: 'application/json',
        },
      },
    },
    // Don't watch the large static images folder — it has 33k+ files and
    // kills dev server startup and HMR performance.
    watch: {
      ignored: [
        '**/public/images/**',
        '**/public/locales/**',
        '**/node_modules/**',
      ],
    },
  },
});
