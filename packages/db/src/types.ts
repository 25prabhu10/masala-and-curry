import type { createDb } from './index'

export { DrizzleError, DrizzleQueryError, TransactionRollbackError } from 'drizzle-orm/errors'

export type DB = Awaited<ReturnType<typeof createDb>>
