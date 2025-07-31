import { z } from '@hono/zod-openapi'
import {
  MAX_CURRENCY_VALUE,
  MAX_NUMBER_IN_APP,
  MAX_STRING_LENGTH,
  MIN_CURRENCY_VALUE,
  MIN_STRING_LENGTH,
  NANOID_LENGTH,
} from '@mac/resources/constants'
import { maxLengthDesc, minLengthDesc } from '@mac/resources/general'
import { sql } from 'drizzle-orm'
import { index, integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { createSchemaFactory } from 'drizzle-zod'

import { generatePublicId } from '../utils'
import { menuItem } from './menu-item.schema'

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({
  zodInstance: z,
})

export const menuItemVariant = sqliteTable(
  'menu_item_variant',
  {
    calories: integer({ mode: 'number' }),
    createdAt: integer({ mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    description: text({ length: MAX_STRING_LENGTH }),
    displayOrder: integer({ mode: 'number' }).notNull().default(0),
    id: text({ length: NANOID_LENGTH })
      .$defaultFn(() => generatePublicId())
      .primaryKey(),
    isAvailable: integer({ mode: 'boolean' }).notNull().default(true),
    isDefault: integer({ mode: 'boolean' }).notNull().default(false),
    menuItemId: text({ length: NANOID_LENGTH })
      .notNull()
      .references(() => menuItem.id, { onDelete: 'cascade' }),
    name: text({ length: MAX_STRING_LENGTH }).notNull(), // e.g., "Small", "Large", "Family Size"
    priceModifier: real().notNull().default(0), // Added to base price
    servingSize: text({ length: MAX_STRING_LENGTH }), // e.g., "8 oz", "12 oz", "16 oz"
    updatedAt: integer({ mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`)
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex('idx_variant_menu_item_name_unique').on(table.menuItemId, table.name),
    index('idx_variant_menu_item_id').on(table.menuItemId),
    index('idx_variant_available').on(table.isAvailable),
  ]
)

export const SelectMenuItemVariantSchema = createSelectSchema(menuItemVariant, {
  calories: (schema) =>
    schema.nonnegative().max(MAX_NUMBER_IN_APP).optional().openapi({
      description: 'Calories for this variant',
      example: 650,
    }),
  createdAt: (schema) =>
    schema.openapi({
      description: 'Variant creation timestamp',
      example: '2023-01-01T00:00:00Z',
    }),
  description: (schema) =>
    schema
      .trim()
      .max(MAX_STRING_LENGTH, {
        message: maxLengthDesc('Variant description'),
      })
      .optional()
      .openapi({
        description: 'Variant description',
        example: 'Generous portion perfect for sharing',
      }),
  displayOrder: (schema) =>
    schema.nonnegative().max(MAX_NUMBER_IN_APP).openapi({
      description: 'Display order for variants',
      example: 2,
    }),
  id: (schema) =>
    schema
      .max(NANOID_LENGTH, {
        message: maxLengthDesc('Variant ID', NANOID_LENGTH),
      })
      .openapi({
        description: 'Unique variant identifier',
        example: 'variant_large_001',
      }),
  isAvailable: (schema) =>
    schema.default(true).openapi({
      description: 'Whether this variant is available',
      example: true,
    }),
  isDefault: (schema) =>
    schema.default(false).openapi({
      description: 'Whether this is the default variant',
      example: false,
    }),
  menuItemId: (schema) =>
    schema
      .max(NANOID_LENGTH, {
        message: maxLengthDesc('Menu Item ID', NANOID_LENGTH),
      })
      .openapi({
        description: 'Menu item identifier',
        example: 'item_chicken_curry_001',
      }),
  name: (schema) =>
    schema
      .trim()
      .min(MIN_STRING_LENGTH, { message: minLengthDesc('Variant name', MIN_STRING_LENGTH) })
      .max(MAX_STRING_LENGTH, { message: maxLengthDesc('Variant name', MAX_STRING_LENGTH) })
      .openapi({
        description: 'Variant name',
        example: 'Large',
      }),
  priceModifier: (schema) =>
    schema.min(MIN_CURRENCY_VALUE).max(MAX_CURRENCY_VALUE).openapi({
      description: 'Price modifier added to base price',
      example: 5.99,
    }),
  servingSize: (schema) =>
    schema
      .trim()
      .max(MAX_STRING_LENGTH, {
        message: maxLengthDesc('Serving description'),
      })
      .optional()
      .openapi({
        description: 'Serving size description',
        example: '16 oz',
      }),
  updatedAt: (schema) =>
    schema.openapi({
      description: 'Last update timestamp',
      example: '2023-01-01T00:00:00Z',
    }),
}).openapi('MenuItemVariant')

export const InsertMenuItemVariantSchema = createInsertSchema(menuItemVariant, {
  calories: () => SelectMenuItemVariantSchema.shape.calories,
  description: () => SelectMenuItemVariantSchema.shape.description,
  displayOrder: () => SelectMenuItemVariantSchema.shape.displayOrder,
  isAvailable: () => SelectMenuItemVariantSchema.shape.isAvailable,
  isDefault: () => SelectMenuItemVariantSchema.shape.isDefault,
  menuItemId: () => SelectMenuItemVariantSchema.shape.menuItemId,
  name: () => SelectMenuItemVariantSchema.shape.name,
  priceModifier: () => SelectMenuItemVariantSchema.shape.priceModifier,
  servingSize: () => SelectMenuItemVariantSchema.shape.servingSize,
})
  .omit({
    createdAt: true,
    id: true,
    updatedAt: true,
  })
  .openapi('MenuItemVariantInsert')

export const UpdateMenuItemVariantSchema = createUpdateSchema(menuItemVariant, {
  calories: () => SelectMenuItemVariantSchema.shape.calories,
  description: () => SelectMenuItemVariantSchema.shape.description,
  displayOrder: () => SelectMenuItemVariantSchema.shape.displayOrder,
  isAvailable: () => SelectMenuItemVariantSchema.shape.isAvailable,
  isDefault: () => SelectMenuItemVariantSchema.shape.isDefault,
  menuItemId: () => SelectMenuItemVariantSchema.shape.menuItemId,
  name: () => SelectMenuItemVariantSchema.shape.name,
  priceModifier: () => SelectMenuItemVariantSchema.shape.priceModifier,
  servingSize: () => SelectMenuItemVariantSchema.shape.servingSize,
})
  .omit({
    createdAt: true,
    id: true,
    updatedAt: true,
  })
  .openapi('MenuItemVariantUpdate')

export type InsertMenuItemVariantDB = z.input<typeof InsertMenuItemVariantSchema>
export type UpdateMenuItemVariantDB = z.input<typeof UpdateMenuItemVariantSchema>
