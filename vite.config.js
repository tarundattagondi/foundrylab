import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' keeps asset paths relative so the build works on GitHub Pages sub-paths too.
export default defineConfig({
  plugins: [react()],
  worker: { format: 'es' },
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/node_modules\/(@codemirror|codemirror|@lezer|style-mod|w3c-keyname|crelt)/.test(id)) return 'codemirror'
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react'
        },
      },
    },
  },
})
