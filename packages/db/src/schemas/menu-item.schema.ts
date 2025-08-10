import { z } from '@hono/zod-openapi'
import {
  MAX_CURRENCY_VALUE,
  MAX_NUMBER_IN_APP,
  MAX_STRING_LENGTH,
  MIN_STRING_LENGTH,
  NANOID_LENGTH,
} from '@mac/resources/constants'
import { invalidDesc, maxLengthDesc, minLengthDesc } from '@mac/resources/general'
import { sql } from 'drizzle-orm'
import {
  check,
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'
import { createSchemaFactory } from 'drizzle-zod'

import { generatePublicId } from '../utils'
import { category } from './category.schema'

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({
  zodInstance: z,
})

export const menuItem = sqliteTable(
  'menu_item',
  {
    basePrice: real().notNull(),
    calories: integer({ mode: 'number' }),
    categoryId: text({ length: NANOID_LENGTH })
      .notNull()
      .references(() => category.id, { onDelete: 'cascade' }),
    createdAt: integer({ mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    currency: text({ length: 3 }).notNull().default('USD'),
    description: text({ length: MAX_STRING_LENGTH }),
    displayOrder: integer({ mode: 'number' }).notNull().default(0),
    id: text({ length: NANOID_LENGTH })
      .$defaultFn(() => generatePublicId())
      .primaryKey(),
    image: text(),
    ingredients: text({ length: MAX_STRING_LENGTH }),
    isAvailable: integer({ mode: 'boolean' }).notNull().default(true),
    isGlutenFree: integer({ mode: 'boolean' }).notNull().default(false),
    isPopular: integer({ mode: 'boolean' }).notNull().default(false),
    isSpicy: integer({ mode: 'boolean' }).notNull().default(false),
    isVegan: integer({ mode: 'boolean' }).notNull().default(false),
    isVegetarian: integer({ mode: 'boolean' }).notNull().default(false),
    name: text({ length: MAX_STRING_LENGTH }).notNull(),
    preparationTime: integer({ mode: 'number' }).notNull().default(15), // in minutes
    spiceLevel: integer({ mode: 'number' }).default(0), // 0-5 scale
    updatedAt: integer({ mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`)
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check('base_price_check', sql`${table.basePrice} >= 0`),
    check('currency_check', sql`length(${table.currency}) = 3`),
    check('preparation_time_check', sql`${table.preparationTime} > 0`),
    check('calories_check', sql`${table.calories} >= 0`),
    uniqueIndex('idx_menu_item_category_name_unique').on(table.categoryId, table.name),
    index('idx_menu_item_category_id').on(table.categoryId),
    index('idx_menu_item_available').on(table.isAvailable),
    index('idx_menu_item_popular').on(table.isPopular).where(sql`${table.isPopular} = 1`),
    index('idx_menu_item_name').on(table.name),
    index('idx_menu_item_price').on(table.basePrice),
  ]
)

export const SelectMenuItemSchema = createSelectSchema(menuItem, {
  basePrice: (schema) =>
    schema.nonnegative({ message: 'Price must be positive' }).max(MAX_CURRENCY_VALUE).openapi({
      description: 'Base price of the menu item',
      example: 18.99,
    }),
  calories: (schema) =>
    schema.nonnegative().max(MAX_NUMBER_IN_APP).optional().openapi({
      description: 'Calories per serving',
      example: 450,
    }),
  categoryId: (schema) =>
    schema
      .min(MIN_STRING_LENGTH, { message: minLengthDesc('Category ID', MIN_STRING_LENGTH) })
      .max(NANOID_LENGTH, {
        message: maxLengthDesc('Category ID', NANOID_LENGTH),
      })
      .openapi({
        description: 'Category identifier',
        example: 'cat_main_courses_001',
      }),
  createdAt: (schema) =>
    schema.openapi({
      description: 'Menu item creation timestamp',
      example: '2023-01-01T00:00:00Z',
    }),
  currency: (schema) =>
    schema.openapi({
      description: 'Currency code',
      example: 'USD',
    }),
  description: (schema) =>
    schema
      .trim()
      .max(MAX_STRING_LENGTH, {
        message: maxLengthDesc('Menu item description'),
      })
      .optional()
      .openapi({
        description: 'Menu item description',
        example: 'Tender chicken pieces in a creamy tomato-based curry sauce',
      }),
  displayOrder: (schema) =>
    schema.nonnegative().max(MAX_NUMBER_IN_APP).openapi({
      description: 'Display order within menu items',
      example: 1,
    }),
  id: (schema) =>
    schema
      .max(NANOID_LENGTH, {
        message: maxLengthDesc('Menu Item ID', NANOID_LENGTH),
      })
      .openapi({
        description: 'Unique menu item identifier',
        example: 'item_chicken_curry_001',
      }),
  image: () =>
    z.url().optional().openapi({
      description: 'Menu item image URL',
      example: 'https://example.com/chicken-tikka-masala.jpg',
    }),
  ingredients: (schema) =>
    schema
      .trim()
      .max(MAX_STRING_LENGTH, { message: maxLengthDesc('Ingredients') })
      .optional()
      .openapi({
        description: 'List of ingredients',
        example: 'Chicken, tomatoes, cream, onions, garlic, ginger, spices',
      }),
  isAvailable: (schema) =>
    z
      .union([
        schema,
        z.string(invalidDesc('Menu Item Available', schema.def.type)).transform((val, ctx) => {
          if (val === 'true') {
            return true
          }
          if (val === 'false') {
            return false
          }
          ctx.addIssue({
            code: 'custom',
            message: 'Menu Item Available must be "true" or "false"',
          })
          return z.NEVER
        }),
      ])
      .pipe(schema)
      .default(true)
      .openapi({
        description: 'Whether the item is currently available',
        example: true,
      }),
  isGlutenFree: (schema) =>
    z
      .union([
        schema,
        z.string(invalidDesc('Menu Item Gluten Free', schema.def.type)).transform((val, ctx) => {
          if (val === 'true') {
            return true
          }
          if (val === 'false') {
            return false
          }
          ctx.addIssue({
            code: 'custom',
            message: 'Menu Item Gluten Free must be "true" or "false"',
          })
          return z.NEVER
        }),
      ])
      .pipe(schema)
      .default(false)
      .openapi({
        description: 'Whether the item is gluten-free',
        example: true,
      }),
  isPopular: (schema) =>
    z
      .union([
        schema,
        z.string(invalidDesc('Menu Item Popular', schema.def.type)).transform((val, ctx) => {
          if (val === 'true') {
            return true
          }
          if (val === 'false') {
            return false
          }
          ctx.addIssue({
            code: 'custom',
            message: 'Menu Item Popular must be "true" or "false"',
          })
          return z.NEVER
        }),
      ])
      .pipe(schema)
      .default(false)
      .openapi({
        description: 'Whether the item is marked as popular',
        example: true,
      }),
  isSpicy: (schema) =>
    schema.default(false).openapi({
      description: 'Whether the item is spicy',
      example: true,
    }),
  isVegan: (schema) =>
    z
      .union([
        schema,
        z.string(invalidDesc('Menu Item Vegan', schema.def.type)).transform((val, ctx) => {
          if (val === 'true') {
            return true
          }
          if (val === 'false') {
            return false
          }
          ctx.addIssue({
            code: 'custom',
            message: 'Menu Item Vegan must be "true" or "false"',
          })
          return z.NEVER
        }),
      ])
      .pipe(schema)
      .default(false)
      .openapi({
        description: 'Whether the item is vegan',
        example: false,
      }),
  isVegetarian: (schema) =>
    z
      .union([
        schema,
        z.string(invalidDesc('Menu Item Vegetarian', schema.def.type)).transform((val, ctx) => {
          if (val === 'true') {
            return true
          }
          if (val === 'false') {
            return false
          }
          ctx.addIssue({
            code: 'custom',
            message: 'Menu Item Vegetarian must be "true" or "false"',
          })
          return z.NEVER
        }),
      ])
      .pipe(schema)
      .default(false)
      .openapi({
        description: 'Whether the item is vegetarian',
        example: false,
      }),
  name: (schema) =>
    z
      .string(invalidDesc('Menu Item name', schema.def.type))
      .trim()
      .min(MIN_STRING_LENGTH, { message: minLengthDesc('Menu Item name') })
      .max(MAX_STRING_LENGTH, { message: maxLengthDesc('Menu Item name') })
      .openapi({
        description: 'Menu Item name',
        example: 'Chicken Tikka Masala',
      }),
  preparationTime: (schema) =>
    schema
      .nonnegative({ message: 'Preparation time must be positive' })
      .max(MAX_NUMBER_IN_APP)
      .default(15)
      .openapi({
        description: 'Preparation time in minutes',
        example: 25,
      }),
  spiceLevel: () =>
    z.int().min(0).max(5).default(0).optional().openapi({
      description: 'Spice level on a scale of 0-5',
      example: 3,
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
  .openapi('MenuItem')

export const InsertMenuItemSchema = createInsertSchema(menuItem, {
  basePrice: () => SelectMenuItemSchema.shape.basePrice,
  calories: () => SelectMenuItemSchema.shape.calories,
  categoryId: () => SelectMenuItemSchema.shape.categoryId,
  currency: () => SelectMenuItemSchema.shape.currency,
  description: () => SelectMenuItemSchema.shape.description,
  displayOrder: () => SelectMenuItemSchema.shape.displayOrder,
  image: () => SelectMenuItemSchema.shape.image,
  ingredients: () => SelectMenuItemSchema.shape.ingredients,
  isAvailable: () => SelectMenuItemSchema.shape.isAvailable,
  isGlutenFree: () => SelectMenuItemSchema.shape.isGlutenFree,
  isPopular: () => SelectMenuItemSchema.shape.isPopular,
  isSpicy: () => SelectMenuItemSchema.shape.isSpicy,
  isVegan: () => SelectMenuItemSchema.shape.isVegan,
  isVegetarian: () => SelectMenuItemSchema.shape.isVegetarian,
  name: () => SelectMenuItemSchema.shape.name,
  preparationTime: () => SelectMenuItemSchema.shape.preparationTime,
  spiceLevel: () => SelectMenuItemSchema.shape.spiceLevel,
})
  .omit({
    createdAt: true,
    id: true,
    updatedAt: true,
  })
  .openapi('MenuItemInsert')

export const UpdateMenuItemSchema = createUpdateSchema(menuItem, {
  basePrice: () => SelectMenuItemSchema.shape.basePrice,
  calories: () => SelectMenuItemSchema.shape.calories,
  categoryId: () => SelectMenuItemSchema.shape.categoryId,
  currency: () => SelectMenuItemSchema.shape.currency,
  description: () => SelectMenuItemSchema.shape.description,
  displayOrder: () => SelectMenuItemSchema.shape.displayOrder,
  image: () => SelectMenuItemSchema.shape.image,
  ingredients: () => SelectMenuItemSchema.shape.ingredients,
  isAvailable: () => SelectMenuItemSchema.shape.isAvailable,
  isGlutenFree: () => SelectMenuItemSchema.shape.isGlutenFree,
  isPopular: () => SelectMenuItemSchema.shape.isPopular,
  isSpicy: () => SelectMenuItemSchema.shape.isSpicy,
  isVegan: () => SelectMenuItemSchema.shape.isVegan,
  isVegetarian: () => SelectMenuItemSchema.shape.isVegetarian,
  name: () => SelectMenuItemSchema.shape.name,
  preparationTime: () => SelectMenuItemSchema.shape.preparationTime,
  spiceLevel: () => SelectMenuItemSchema.shape.spiceLevel,
})
  .omit({
    createdAt: true,
    id: true,
    updatedAt: true,
  })
  .openapi('MenuItemUpdate')

export type InsertMenuItemDB = z.infer<typeof InsertMenuItemSchema>
export type UpdateMenuItemDB = z.infer<typeof UpdateMenuItemSchema>
