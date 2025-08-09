import { z } from '@hono/zod-openapi'
import { MAX_STRING_LENGTH, MIN_PASSWORD_LENGTH } from '@mac/resources/constants'
import { invalidDesc, maxLengthDesc, minLengthDesc } from '@mac/resources/general'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createSchemaFactory } from 'drizzle-zod'

import { user } from './user.schema'

const { createInsertSchema } = createSchemaFactory({
  zodInstance: z,
})

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

export const InsertAccountSchema = createInsertSchema(account, {
  password: (schema) =>
    z
      .string(invalidDesc('Password', schema.def.type))
      .trim()
      .min(MIN_PASSWORD_LENGTH, { message: minLengthDesc('Password') })
      .max(MAX_STRING_LENGTH, { message: maxLengthDesc('Password') })
      .openapi({
        description: 'Password',
        example: '********',
      }),
}).pick({
  password: true,
})
