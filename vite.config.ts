
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
    ],  
    css: {
      postcss: {
        plugins: [autoprefixer({})],
      },
    },
    build: {
      sourcemap: true,
      chunkSizeWarningLimit: 900,
    },
  }
})
