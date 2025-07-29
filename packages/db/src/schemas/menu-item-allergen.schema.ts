import { z } from '@hono/zod-openapi'
import { MAX_STRING_LENGTH, NANOID_LENGTH } from '@mac/resources/constants'
import { maxLengthDesc } from '@mac/resources/general'
import { sql } from 'drizzle-orm'
import { check, index, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createSchemaFactory } from 'drizzle-zod'

import { enumToString } from '../utils'
import { allergen } from './allergen.schema'
import { menuItem } from './menu-item.schema'

const { createInsertSchema, createSelectSchema } = createSchemaFactory({
  zodInstance: z,
})

const severities = ['contains', 'may_contain', 'processed_in_facility'] as const
const severitiesStr = enumToString(severities)

export const menuItemAllergen = sqliteTable(
  'menu_item_allergen',
  {
    allergenId: text({ length: NANOID_LENGTH })
      .notNull()
      .references(() => allergen.id, { onDelete: 'cascade' }),
    createdAt: integer({ mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    menuItemId: text({ length: NANOID_LENGTH })
      .notNull()
      .references(() => menuItem.id, { onDelete: 'cascade' }),
    severity: text({ length: MAX_STRING_LENGTH }).notNull().default('contains'), // 'contains', 'may_contain', 'processed_in_facility'
  },
  (table) => [
    primaryKey({ columns: [table.menuItemId, table.allergenId] }),
    check('severity_check', sql`${table.severity} in (${sql.raw(severitiesStr)})`),
    index('idx_menu_item_allergen_allergen_id').on(table.allergenId),
  ]
)

export const SelectMenuItemAllergenSchema = createSelectSchema(menuItemAllergen, {
  allergenId: () =>
    z
      .nanoid()
      .max(NANOID_LENGTH, {
        message: maxLengthDesc('Allergen ID', NANOID_LENGTH),
      })
      .openapi({
        description: 'Allergen identifier',
        example: 'allergen_nuts_001',
      }),
  createdAt: (schema) =>
    schema.openapi({
      description: 'Association creation timestamp',
      example: '2023-01-01T00:00:00Z',
    }),
  menuItemId: () =>
    z
      .nanoid()
      .max(NANOID_LENGTH, {
        message: maxLengthDesc('Menu item ID', NANOID_LENGTH),
      })
      .openapi({
        description: 'Menu item identifier',
        example: 'item_chicken_curry_001',
      }),
  severity: () =>
    z.enum(severities, `Severity must be one of: ${severitiesStr}`).openapi({
      description: 'Allergen severity level',
      enum: [...severities],
      example: 'contains',
    }),
}).openapi('MenuItemAllergen')

export const InsertMenuItemAllergenSchema = createInsertSchema(menuItemAllergen, {
  allergenId: () => SelectMenuItemAllergenSchema.shape.allergenId,
  menuItemId: () => SelectMenuItemAllergenSchema.shape.menuItemId,
  severity: () => SelectMenuItemAllergenSchema.shape.severity,
})
  .omit({
    createdAt: true,
  })
  .openapi('MenuItemAllergenInsert')

export const UpdateMenuItemAllergenSchema = createSelectSchema(menuItemAllergen, {
  severity: () => SelectMenuItemAllergenSchema.shape.severity,
})
  .omit({
    allergenId: true,
    createdAt: true,
    menuItemId: true,
  })
  .openapi('MenuItemAllergenUpdate')
