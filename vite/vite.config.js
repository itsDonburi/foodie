import { defineConfig } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        inspiration: resolve(rootDir, 'index.html'),
        favorites: resolve(rootDir, 'favorites.html'),
      },
    },
  },
})
