import type { LinguiConfig } from '@lingui/conf'

const config: LinguiConfig = {
  format: 'po',
  sourceLocale: 'en-US',
  fallbackLocales: { default: 'en-US' },
  locales: ['en-US', 'hi-IN'],
  catalogs: [
    {
      include: ['<rootDir>/src'],
      path: '<rootDir>/src/locales/{locale}/messages',
    },
  ],
}

export default config
