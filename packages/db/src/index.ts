import { type AnyD1Database, drizzle } from 'drizzle-orm/d1'

import * as schema from './schemas'

// oxlint-disable-next-line explicit-module-boundary-types
export async function createDb<TClient extends AnyD1Database = AnyD1Database>(db: TClient) {
  return drizzle(db, {
    casing: 'snake_case',
    logger: true,
    schema,
  })
}

export type DB = Awaited<ReturnType<typeof createDb>>
