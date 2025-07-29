import { DEFAULT_PAGE_SIZE, NANOID_ALPHABET, NANOID_LENGTH } from '@mac/resources/constants'
import type { SQLiteSelect } from 'drizzle-orm/sqlite-core'
import { customAlphabet, nanoid } from 'nanoid'

export function generateId() {
  return nanoid()
}

export function generatePublicId() {
  const customNanoid = customAlphabet(NANOID_ALPHABET, NANOID_LENGTH)
  return customNanoid()
}

export function enumToString(input: Readonly<string[]>) {
  return input.map((x) => `'${x}'`).join(', ')
}

export function withPagination<T extends SQLiteSelect>(
  qb: T,
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE
) {
  return qb.limit(pageSize).offset((page - 1) * pageSize)
}
