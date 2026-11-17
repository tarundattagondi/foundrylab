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
        manualChunks: {
          react: ['react', 'react-dom'],
          codemirror: ['codemirror', '@codemirror/lang-python', '@codemirror/theme-one-dark', '@codemirror/view', '@codemirror/state'],
        },
      },
    },
  },
})
