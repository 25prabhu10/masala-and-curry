import type { createDb } from './index'

export { DrizzleQueryError } from 'drizzle-orm/errors'

export type DB = Awaited<ReturnType<typeof createDb>>
