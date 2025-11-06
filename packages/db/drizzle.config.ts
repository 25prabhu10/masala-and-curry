import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { defineConfig } from 'drizzle-kit'

function getLocalD1() {
  try {
    const basePath = resolve('../../apps/server/.wrangler')
    const dbFile = readdirSync(basePath, { encoding: 'utf8', recursive: true }).find((f) =>
      f.endsWith('.sqlite')
    )

    if (!dbFile) {
      throw new Error(`.sqlite file not found in ${basePath}`)
    }

    return pathToFileURL(resolve(basePath, dbFile)).href
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error getting local D1 database: ${error.message}`)
      return ''
    }
    console.error(`Error: `, error)
  }
}

function isProd() {
  return process.env.NODE_ENV === 'production'
}

function getCredentials() {
  const production = {
    dbCredentials: {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? '',
      databaseId: process.env.CLOUDFLARE_DATABASE_ID ?? '',
      token: process.env.CLOUDFLARE_D1_TOKEN ?? '',
    },
    driver: 'd1-http',
  }

  const development = {
    dbCredentials: {
      url: getLocalD1(),
    },
  }

  return isProd() ? production : development
}

export default defineConfig({
  breakpoints: true,
  casing: 'snake_case',
  dialect: 'sqlite',
  out: './src/migrations',
  schema: './src/schemas',
  strict: true,
  verbose: true,
  ...getCredentials(),
})
