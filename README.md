https://tanstack.com/start/latest/docs/framework/react/build-from-scratch

# tanstack-start-prisma

bun init

bun i @tanstack/react-start @tanstack/react-router vinxi
bun i react react-dom
bun i -D @vitejs/plugin-react vite-tsconfig-paths
bun i -D typescript @types/react @types/react-dom

package.json:
"scripts": {
  "dev": "vinxi dev",
  "build": "vinxi build",
  "start": "vinxi start"
}

// app.config.ts
import { defineConfig } from '@tanstack/react-start/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
  },
})  

bun i tailwindcss @tailwindcss/vite
bun i prisma tsx --save-dev
bun i @prisma/client