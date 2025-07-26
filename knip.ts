import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  biome: true,
  drizzle: true,
  expo: true,
  ignore: ['apps/web/src/vite-env.d.ts', 'apps/web/src/routeTree.gen.ts'],
  ignoreBinaries: ['turbo', 'wrangler', 'expo'],
  ignoreDependencies: ['@types/*', 'catalog:*'],
  lefthook: true,
  oxlint: true,
  tailwind: true,
  typescript: true,
  vite: true,
  vitest: true,
  workspaces: {
    '.': {
      project: ['*.{js,ts,mjs,cjs,json,jsonc,yaml,yml}', '!apps/**', '!packages/**', '!tooling/**'],
    },
    'apps/mobile': {
      project: [
        'src/**/*.{ts,tsx}',
        '*.{js,ts,json,jsonc}',
        '!android/**',
        '!metro.config.js',
        '!ios/**',
        '!node_modules/**',
        '!.expo/**',
      ],
    },
    'apps/server': {
      entry: ['src/index.ts'],
      project: [
        'src/**/*.{ts,js}',
        '*.{js,ts,json,jsonc}',
        '!dist/**',
        '!node_modules/**',
        '!.wrangler/**',
      ],
    },
    'apps/web': {
      entry: ['src/main.tsx', 'src/routes/**/*.{ts,tsx}'],
      project: ['src/**/*.{ts,tsx}', '*.{js,ts,json,jsonc}', '!dist/**', '!node_modules/**'],
    },
    'packages/*': {
      project: ['src/**/*.{ts,tsx}', '*.{js,ts,json,jsonc}', '!dist/**', '!node_modules/**'],
    },
    'tooling/*': {
      entry: ['*.{js,ts}', 'src/**/*.{ts,js}'],
      project: ['**/*.{ts,js,json,jsonc}', '!node_modules/**'],
    },
  },
  wrangler: true,
}

export default config
