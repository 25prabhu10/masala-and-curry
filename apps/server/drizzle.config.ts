import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  casing: 'snake_case',
  dialect: 'sqlite',
  driver: 'd1-http',
  out: './src/db/migrations',
  schema: './src/db/schemas',
  strict: true,
  verbose: true,
})
