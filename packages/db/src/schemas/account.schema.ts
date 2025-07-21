import { MAX_STRING_LENGTH } from '@mac/resources/constants'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { user } from './user.schema'

export const account = sqliteTable('account', {
  accessToken: text(),
  accessTokenExpiresAt: integer({ mode: 'timestamp' }),
  accountId: text().notNull(),
  createdAt: integer({ mode: 'timestamp' }).notNull(),
  id: text({ length: MAX_STRING_LENGTH }).primaryKey(),
  idToken: text(),
  password: text({ length: MAX_STRING_LENGTH }),
  providerId: text({ length: MAX_STRING_LENGTH }).notNull(),
  refreshToken: text(),
  refreshTokenExpiresAt: integer({ mode: 'timestamp' }),
  scope: text(),
  updatedAt: integer({ mode: 'timestamp' }).notNull(),
  userId: text({ length: MAX_STRING_LENGTH })
    .notNull()
    .references(() => user.id, {
      onDelete: 'cascade',
    }),
})
