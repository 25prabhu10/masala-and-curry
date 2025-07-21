import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  casing: 'snake_case',
  dialect: 'sqlite',
  driver: 'd1-http',
  out: './src/migrations',
  schema: './src/schemas',
  strict: true,
  verbose: true,
})
