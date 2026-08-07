import { defineConfig, normalizePath } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const manifestPath = normalizePath(path.resolve(__dirname, 'manifest.webapp.json'))

export default defineConfig({
  base: './',   
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    viteStaticCopy({
      targets: [
        {
          src: manifestPath,
          dest: '.',
          rename: 'manifest.webapp'
        }
      ]
    })
  ],
})
