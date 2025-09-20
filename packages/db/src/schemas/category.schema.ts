import { z } from '@hono/zod-openapi'
import {
  MAX_NUMBER_IN_APP,
  MAX_STRING_LENGTH,
  MIN_STRING_LENGTH,
  NANOID_LENGTH,
} from '@mac/resources/constants'
import { invalidDesc, maxLengthDesc, maxValueDesc, minLengthDesc } from '@mac/resources/general'
import { sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createSchemaFactory } from 'drizzle-zod'

import { generatePublicId } from '../utils'

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({
  zodInstance: z,
})

export const category = sqliteTable(
  'category',
  {
    createdAt: integer({ mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    description: text({ length: MAX_STRING_LENGTH }),
    displayOrder: integer({ mode: 'number' }).notNull().default(0),
    id: text({ length: NANOID_LENGTH })
      .$defaultFn(() => generatePublicId())
      .primaryKey(),
    isActive: integer({ mode: 'boolean' }).notNull().default(true),
    name: text({ length: MAX_STRING_LENGTH }).unique().notNull(),
    updatedAt: integer({ mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`)
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('idx_category_display_order').on(table.displayOrder, table.name),
    index('idx_category_active').on(table.isActive),
  ]
)

export const SelectCategorySchema = createSelectSchema(category, {
  createdAt: (schema) =>
    schema.openapi({
      description: 'Category creation timestamp',
      example: '2023-01-01T00:00:00Z',
    }),
  description: (schema) =>
    z
      .string(invalidDesc('Category description', schema.def.type))
      .trim()
      .max(MAX_STRING_LENGTH, {
        error: maxLengthDesc('Category description'),
      })
      .optional()
      .openapi({
        description: 'Category description',
        example: 'Delicious starters to begin your meal',
      }),
  displayOrder: (schema) =>
    schema
      .nonnegative()
      .max(MAX_NUMBER_IN_APP, {
        error: maxValueDesc('Category Display Order'),
      })
      .openapi({
        description: 'Display order for category listing',
        example: 1,
      }),
  id: (schema) =>
    schema
      .max(NANOID_LENGTH, {
        error: maxLengthDesc('Category ID', NANOID_LENGTH),
      })
      .openapi({
        description: 'Unique category identifier',
        example: 'cat_appetizers_001',
      }),
  isActive: (schema) =>
    z
      .union([
        schema,
        z.string(invalidDesc('Category Active', schema.def.type)).transform((val, ctx) => {
          if (val === 'true') {
            return true
          }
          if (val === 'false') {
            return false
          }
          ctx.addIssue({
            code: 'custom',
            error: 'Category Active must be "true" or "false"',
          })
          return z.NEVER
        }),
      ])
      .pipe(schema)
      .default(true)
      .openapi({
        description: 'Whether the category is active and visible',
        example: true,
      }),
  name: (schema) =>
    z
      .string(invalidDesc('Category name', schema.def.type))
      .trim()
      .min(MIN_STRING_LENGTH, { error: minLengthDesc('Category name') })
      .max(MAX_STRING_LENGTH, { error: maxLengthDesc('Category name') })
      .openapi({
        description: 'Category name',
        example: 'Appetizers',
      }),
  updatedAt: (schema) =>
    schema.openapi({
      description: 'Last update timestamp',
      example: '2023-01-01T00:00:00Z',
    }),
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .openapi('Category')

export const InsertCategorySchema = createInsertSchema(category, {
  description: () => SelectCategorySchema.shape.description,
  displayOrder: () => SelectCategorySchema.shape.displayOrder,
  isActive: () => SelectCategorySchema.shape.isActive,
  name: () => SelectCategorySchema.shape.name,
})
  .omit({
    createdAt: true,
    id: true,
    updatedAt: true,
  })
  .openapi('CategoryCreate')

export const UpdateCategorySchema = createUpdateSchema(category, {
  description: () => SelectCategorySchema.shape.description,
  displayOrder: () => SelectCategorySchema.shape.displayOrder,
  isActive: () => SelectCategorySchema.shape.isActive,
  name: () => SelectCategorySchema.shape.name,
})
  .omit({
    createdAt: true,
    id: true,
    updatedAt: true,
  })
  .openapi('CategoryUpdate')

export type InsertCategoryDB = z.infer<typeof InsertCategorySchema>
export type UpdateCategoryDB = z.infer<typeof UpdateCategorySchema>
