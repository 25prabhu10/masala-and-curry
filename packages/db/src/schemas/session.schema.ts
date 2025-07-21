import { MAX_STRING_LENGTH } from '@mac/resources/constants'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createSelectSchema } from 'drizzle-zod'
import { user } from './user.schema'

export const session = sqliteTable('session', {
  createdAt: integer({ mode: 'timestamp' }).notNull(),
  expiresAt: integer({ mode: 'timestamp' }).notNull(),
  id: text({ length: MAX_STRING_LENGTH }).primaryKey(),
  impersonatedBy: text({ length: MAX_STRING_LENGTH }),
  ipAddress: text({ length: MAX_STRING_LENGTH }),
  token: text().notNull().unique(),
  updatedAt: integer({ mode: 'timestamp' }).notNull(),
  userAgent: text({ length: MAX_STRING_LENGTH }),
  userId: text({ length: MAX_STRING_LENGTH })
    .notNull()
    .references(() => user.id, {
      onDelete: 'cascade',
    }),
})

export const SelectSessionSchema = createSelectSchema(session).omit({ impersonatedBy: true })
