import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schemas'

export async function createDb(env: CloudflareBindings) {
  return drizzle(env.DB, {
    casing: 'snake_case',
    logger: true,
    schema,
  })
}
