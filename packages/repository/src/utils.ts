import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@mac/resources/constants'
import type { SQLiteSelect } from 'drizzle-orm/sqlite-core'

export function withPagination<T extends SQLiteSelect>(
  qb: T,
  page: number = DEFAULT_PAGE_INDEX,
  pageSize: number = DEFAULT_PAGE_SIZE
): T {
  return qb.limit(pageSize).offset(page * pageSize)
}
