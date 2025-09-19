import { z } from '@hono/zod-openapi'
import { MAX_STRING_LENGTH, MIN_STRING_LENGTH, NANOID_LENGTH } from '@mac/resources/constants'
import { maxLengthDesc, minLengthDesc } from '@mac/resources/general'
import { sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createSchemaFactory } from 'drizzle-zod'

import { generatePublicId } from '../utils'

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({
  zodInstance: z,
})

export const allergen = sqliteTable(
  'allergen',
  {
    createdAt: integer({ mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
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
  (table) => [index('idx_allergen_active').on(table.isActive)]
)

export const SelectAllergenSchema = createSelectSchema(allergen, {
  createdAt: (schema) =>
    schema.openapi({
      description: 'Allergen creation timestamp',
      example: '2023-01-01T00:00:00Z',
    }),
  id: (schema) =>
    schema
      .max(NANOID_LENGTH, {
        error: maxLengthDesc('Allergen ID', NANOID_LENGTH),
      })
      .openapi({
        description: 'Unique allergen identifier',
        example: 'allergen_nuts_001',
      }),
  isActive: (schema) =>
    schema.default(true).openapi({
      description: 'Whether the allergen is active',
      example: true,
    }),
  name: (schema) =>
    schema
      .trim()
      .min(MIN_STRING_LENGTH, { error: minLengthDesc('Allergen name') })
      .max(MAX_STRING_LENGTH, { error: maxLengthDesc('Allergen name') })
      .openapi({
        description: 'Allergen name',
        example: 'Nuts',
      }),
  updatedAt: (schema) =>
    schema.openapi({
      description: 'Last update timestamp',
      example: '2023-01-01T00:00:00Z',
    }),
}).openapi('Allergen')

export const InsertAllergenSchema = createInsertSchema(allergen, {
  isActive: () => SelectAllergenSchema.shape.isActive,
  name: () => SelectAllergenSchema.shape.name,
})
  .omit({
    createdAt: true,
    id: true,
    updatedAt: true,
  })
  .openapi('AllergenCreate')

export const UpdateAllergenSchema = createUpdateSchema(allergen, {
  isActive: () => SelectAllergenSchema.shape.isActive,
  name: () => SelectAllergenSchema.shape.name,
})
  .omit({
    createdAt: true,
    id: true,
    updatedAt: true,
  })
  .openapi('AllergenUpdate')
