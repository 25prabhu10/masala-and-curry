import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, type PluginOption } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    tsconfigPaths({
      projects: ['./tsconfig.json', './tsconfig.app.json'],
    }),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    visualizer({
      filename: 'stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
      sourcemap: true,
      emitFile: true,
    }) as PluginOption,
  ],
  build: {
    sourcemap: true,
    emptyOutDir: true,
  },
  server: {
    cors: false,
    proxy: {
      '/api/v1': 'http://localhost:8787',
    },
  },
})
