import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { MAX_STRING_LENGTH } from '@/lib/constants'

export const verification = sqliteTable('verification', {
  createdAt: integer({ mode: 'timestamp' }).default(sql`(unixepoch())`),
  expiresAt: integer({ mode: 'timestamp' }).notNull(),
  id: text({ length: MAX_STRING_LENGTH }).primaryKey(),
  identifier: text({ length: MAX_STRING_LENGTH }).notNull(),
  updatedAt: integer({ mode: 'timestamp' }).default(sql`(unixepoch())`),
  value: text({ length: MAX_STRING_LENGTH }).notNull(),
})
