import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
// import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: '../server/public',
    sourcemap: false,
  },
  plugins: [
    tsconfigPaths({
      projects: ['./tsconfig.json', './tsconfig.app.json'],
    }),
    tanstackRouter({
      autoCodeSplitting: true,
      target: 'react',
    }),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
    // visualizer({
    //   brotliSize: true,
    //   emitFile: true,
    //   filename: 'stats.html',
    //   gzipSize: true,
    //   open: true,
    //   sourcemap: true,
    //   template: 'treemap',
    // }) as PluginOption,
  ],
  server: {
    cors: false,
    proxy: {
      '/api/v1': 'http://localhost:8787',
    },
  },
})
