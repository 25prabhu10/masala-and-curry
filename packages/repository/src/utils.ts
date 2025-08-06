import { DEFAULT_PAGE_SIZE } from '@mac/resources/constants'
import type { SQLiteSelect } from 'drizzle-orm/sqlite-core'

export function withPagination<T extends SQLiteSelect>(
  qb: T,
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE
): T {
  return qb.limit(pageSize).offset((page - 1) * pageSize)
}
