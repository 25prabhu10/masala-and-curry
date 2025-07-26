import { z } from '@hono/zod-openapi'
import {
  MAX_PHONE_NUMBER_LENGTH,
  MAX_STRING_LENGTH,
  MIN_STRING_LENGTH,
} from '@mac/resources/constants'
import {
  EMAIL_INVALID,
  EMAIL_MAX_LENGTH,
  EMAIL_VERIFIED_INVALID,
  FULL_NAME_EMPTY,
  FULL_NAME_INVALID,
  FULL_NAME_MAX_LENGTH,
  PHONE_INVALID,
  PHONE_NUMBER_MAX_LENGTH,
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
  image: text(),
  name: text({ length: MAX_STRING_LENGTH }).notNull(),
  phoneNumber: text({ length: MAX_PHONE_NUMBER_LENGTH }).unique(),
  phoneNumberVerified: integer({ mode: 'boolean' }),
  role: text({ length: MAX_STRING_LENGTH }),
  updatedAt: integer({ mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date()),
})

export const SelectUserSchema = createSelectSchema(user, {
  email: () =>
    z
      .email(EMAIL_INVALID)
      .trim()
      .max(MAX_STRING_LENGTH, EMAIL_MAX_LENGTH)
      .transform((value) => value.toLowerCase())
      .openapi({
        description: "User's email address for communication and login",
        example: 'jondoe@email.com',
      }),
  emailVerified: () =>
    z.boolean(EMAIL_VERIFIED_INVALID).default(false).openapi({
      description: "Whether the user's email is verified",
      example: false,
    }),
  // TODO: move to cloud storage
  image: (schema) =>
    schema.optional().openapi({
      description: "User's profile image",
    }),
  name: () =>
    z
      .string(FULL_NAME_INVALID)
      .trim()
      .min(MIN_STRING_LENGTH, FULL_NAME_EMPTY)
      .max(MAX_STRING_LENGTH, FULL_NAME_MAX_LENGTH)
      .openapi({
        description: "User's chosen display name",
        example: 'John Doe',
      }),
  phoneNumber: () =>
    z
      .string()
      .trim()
      .regex(/^\+1\d{10}$/, PHONE_INVALID)
      .max(MAX_PHONE_NUMBER_LENGTH, PHONE_NUMBER_MAX_LENGTH)
      .optional()
      .openapi({
        description: "User's phone number",
        example: '+1234567890',
      }),
}).pick({
  email: true,
  emailVerified: true,
  image: true,
  name: true,
  phoneNumber: true,
})

export const InsertUserSchema = createInsertSchema(user, {
  email: () => SelectUserSchema.shape.email,
  emailVerified: () => SelectUserSchema.shape.emailVerified,
  image: () => SelectUserSchema.shape.image,
  name: () => SelectUserSchema.shape.name,
  phoneNumber: () => SelectUserSchema.shape.phoneNumber,
}).pick({
  email: true,
  emailVerified: true,
  image: true,
  name: true,
  phoneNumber: true,
})

export const UpdateUserSchema = createUpdateSchema(user, {
  email: () => SelectUserSchema.shape.email,
  image: () => SelectUserSchema.shape.image,
  name: () => SelectUserSchema.shape.name,
  phoneNumber: () => SelectUserSchema.shape.phoneNumber,
}).pick({
  email: true,
  image: true,
  name: true,
  phoneNumber: true,
})

export type UpdateUserDB = z.input<typeof UpdateUserSchema>
