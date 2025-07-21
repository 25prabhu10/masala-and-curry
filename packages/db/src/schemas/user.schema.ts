import { z } from '@hono/zod-openapi'
import { MAX_STRING_LENGTH, MAX_URL_LENGTH, MIN_STRING_LENGTH } from '@mac/resources/constants'
import {
  USER_EMAIL_INVALID,
  USER_EMAIL_MAX_LENGTH,
  USER_FULL_NAME_INVALID,
  USER_FULL_NAME_MAX_LENGTH,
  USER_IMAGE_MAX_LENGTH,
} from '@mac/resources/user'
import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createSchemaFactory } from 'drizzle-zod'

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({
  zodInstance: z,
})

export const user = sqliteTable('user', {
  banExpires: integer({ mode: 'timestamp' }),
  banned: integer({ mode: 'boolean' }),
  banReason: text({ length: MAX_STRING_LENGTH }),
  createdAt: integer({ mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  email: text({ length: MAX_STRING_LENGTH }).notNull().unique(),
  emailVerified: integer({ mode: 'boolean' }).notNull().default(false),
  id: text({ length: MAX_STRING_LENGTH }).primaryKey(),
  image: text({ length: MAX_URL_LENGTH }),
  name: text({ length: MAX_STRING_LENGTH }).notNull(),
  role: text({ length: MAX_STRING_LENGTH }),
  updatedAt: integer({ mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date()),
})

export const SelectUserSchema = createSelectSchema(user, {
  email: () =>
    z
      .email(USER_EMAIL_INVALID)
      .trim()
      .max(MAX_STRING_LENGTH, USER_EMAIL_MAX_LENGTH)
      .transform((value) => value.toLocaleUpperCase())
      .openapi({
        description: "User's email address for communication and login",
        example: 'jondoe@email.com',
      }),
  emailVerified: (schema) =>
    schema.default(false).openapi({
      description: "Whether the user's email is verified",
      example: false,
    }),
  image: () =>
    z.url().trim().max(MAX_URL_LENGTH, USER_IMAGE_MAX_LENGTH).optional().openapi({
      description: "User's profile image URL",
      example: 'https://example.com/images/avatar.jpg',
    }),
  name: (schema) =>
    schema
      .trim()
      .min(MIN_STRING_LENGTH, USER_FULL_NAME_INVALID)
      .max(MAX_STRING_LENGTH, USER_FULL_NAME_MAX_LENGTH)
      .openapi({
        description: "User's chosen display name",
        example: 'John Doe',
      }),
}).pick({
  email: true,
  emailVerified: true,
  image: true,
  name: true,
})

export const InsertUserSchema = createInsertSchema(user, {
  email: () => SelectUserSchema.shape.email,
  emailVerified: () => SelectUserSchema.shape.emailVerified,
  image: () => SelectUserSchema.shape.image,
  name: () => SelectUserSchema.shape.name,
}).pick({
  email: true,
  emailVerified: true,
  image: true,
  name: true,
})

export const UpdateUserSchema = createUpdateSchema(user, {
  email: () => SelectUserSchema.shape.email,
  emailVerified: () => SelectUserSchema.shape.emailVerified,
  image: () => SelectUserSchema.shape.image,
  name: () => SelectUserSchema.shape.name,
}).pick({
  email: true,
  emailVerified: true,
  image: true,
  name: true,
})
