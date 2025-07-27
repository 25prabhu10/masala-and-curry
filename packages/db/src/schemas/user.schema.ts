import { z } from '@hono/zod-openapi'
import {
  MAX_PHONE_NUMBER_LENGTH,
  MAX_STRING_LENGTH,
  MIN_STRING_LENGTH,
} from '@mac/resources/constants'
import { maxLengthDesc, minLengthDesc } from '@mac/resources/general'
import {
  EMAIL_INVALID,
  EMAIL_VERIFIED_INVALID,
  FULL_NAME_INVALID,
  PHONE_INVALID,
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
  banExpires: (schema) =>
    schema.optional().openapi({
      description: "User's ban expiration date",
      example: '2023-01-01T00:00:00Z',
    }),
  banned: (schema) =>
    schema.optional().openapi({
      description: 'Whether the user is banned',
      example: false,
    }),
  banReason: (schema) =>
    schema.optional().openapi({
      description: "Reason for the user's ban",
      example: 'Violation of terms',
    }),
  createdAt: (schema) =>
    schema.optional().openapi({
      description: "User's account creation date",
      example: '2023-01-01T00:00:00Z',
    }),
  email: () =>
    z
      .email(EMAIL_INVALID)
      .trim()
      .max(MAX_STRING_LENGTH, maxLengthDesc('Email'))
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
  id: (schema) =>
    schema.openapi({
      description: "User's unique identifier",
      example: 'user_12345',
    }),
  // TODO: move to cloud storage
  image: (schema) =>
    schema.optional().openapi({
      description: "User's profile image",
      example: 'https://example.com/image.jpg',
    }),
  name: () =>
    z
      .string(FULL_NAME_INVALID)
      .trim()
      .min(MIN_STRING_LENGTH, minLengthDesc('Full Name'))
      .max(MAX_STRING_LENGTH, maxLengthDesc('Full Name'))
      .openapi({
        description: "User's chosen display name",
        example: 'John Doe',
      }),
  phoneNumber: () =>
    z
      .string()
      .trim()
      .regex(/^\+1\d{10}$/, PHONE_INVALID)
      .max(MAX_PHONE_NUMBER_LENGTH, maxLengthDesc('Phone Number', MAX_PHONE_NUMBER_LENGTH))
      .optional()
      .openapi({
        description: "User's phone number",
        example: '+1234567890',
      }),
  phoneNumberVerified: (schema) =>
    schema.optional().openapi({
      description: "Whether the user's phone number is verified",
      example: false,
    }),
  role: () =>
    z.enum(['admin', 'user']).optional().openapi({
      description: "User's role in the system (e.g., admin, user)",
      example: 'user',
    }),
  updatedAt: (schema) =>
    schema.optional().openapi({
      description: "User's last profile update date",
      example: '2023-01-01T00:00:00Z',
    }),
})

export const InsertUserSchema = createInsertSchema(user, {
  banExpires: () => SelectUserSchema.shape.banExpires,
  banned: () => SelectUserSchema.shape.banned,
  banReason: () => SelectUserSchema.shape.banReason,
  email: () => SelectUserSchema.shape.email,
  emailVerified: () => SelectUserSchema.shape.emailVerified,
  image: () => SelectUserSchema.shape.image,
  name: () => SelectUserSchema.shape.name,
  phoneNumber: () => SelectUserSchema.shape.phoneNumber,
  phoneNumberVerified: () => SelectUserSchema.shape.phoneNumberVerified,
  role: () => SelectUserSchema.shape.role,
}).omit({
  createdAt: true,
  id: true,
  updatedAt: true,
})

export const UpdateUserSchema = createUpdateSchema(user, {
  banExpires: () => SelectUserSchema.shape.banExpires,
  banned: () => SelectUserSchema.shape.banned,
  banReason: () => SelectUserSchema.shape.banReason,
  email: () => SelectUserSchema.shape.email,
  emailVerified: () => SelectUserSchema.shape.emailVerified,
  image: () => SelectUserSchema.shape.image,
  name: () => SelectUserSchema.shape.name,
  phoneNumber: () => SelectUserSchema.shape.phoneNumber,
  phoneNumberVerified: () => SelectUserSchema.shape.phoneNumberVerified,
}).omit({
  createdAt: true,
  id: true,
  updatedAt: true,
})

export type UpdateUserDB = z.input<typeof UpdateUserSchema>
