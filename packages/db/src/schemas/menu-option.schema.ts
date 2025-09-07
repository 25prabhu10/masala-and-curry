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
import { menuOptionGroup } from './menu-option-group.schema'

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({
  zodInstance: z,
})

export const menuOption = sqliteTable(
  'menu_option',
  {
    caloriesModifier: integer({ mode: 'number' }).notNull().default(0),
    createdAt: integer({ mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    displayOrder: integer({ mode: 'number' }).notNull().default(0),
    groupId: text({ length: NANOID_LENGTH })
      .notNull()
      .references(() => menuOptionGroup.id, { onDelete: 'cascade' }),
    id: text({ length: NANOID_LENGTH })
      .$defaultFn(() => generatePublicId())
      .primaryKey(),
    isAvailable: integer({ mode: 'boolean' }).notNull().default(true),
    isDefault: integer({ mode: 'boolean' }).notNull().default(false),
    name: text({ length: MAX_STRING_LENGTH }).notNull(),
    priceModifier: real().notNull().default(0),
    updatedAt: integer({ mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`)
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex('idx_option_group_name_unique').on(table.groupId, table.name),
    uniqueIndex('idx_option_group_single_default')
      .on(table.groupId)
      .where(sql`${table.isDefault} = 1`),
    index('idx_option_group_id').on(table.groupId),
    index('idx_option_available').on(table.isAvailable),
    index('idx_option_display_order').on(table.displayOrder),
  ]
)

export const SelectMenuOptionSchema = createSelectSchema(menuOption, {
  caloriesModifier: (schema) =>
    schema
      .min(-MAX_NUMBER_IN_APP)
      .max(MAX_NUMBER_IN_APP)
      .openapi({ description: 'Calorie delta relative to base', example: 150 }),
  createdAt: (schema) =>
    schema.openapi({ description: 'Creation timestamp', example: '2023-01-01T00:00:00Z' }),
  displayOrder: (schema) =>
    schema
      .nonnegative()
      .max(MAX_NUMBER_IN_APP)
      .openapi({ description: 'Display order for options', example: 2 }),
  groupId: (schema) =>
    schema
      .max(NANOID_LENGTH, { message: maxLengthDesc('Option Group ID', NANOID_LENGTH) })
      .openapi({ description: 'Option group identifier', example: 'mog_size_001' }),
  id: (schema) =>
    schema
      .max(NANOID_LENGTH, { message: maxLengthDesc('Option ID', NANOID_LENGTH) })
      .openapi({ description: 'Unique option identifier', example: 'mo_large_001' }),
  isAvailable: (schema) =>
    schema.default(true).openapi({ description: 'Option availability', example: true }),
  isDefault: (schema) =>
    schema.default(false).openapi({ description: 'Default option in group', example: false }),
  name: (schema) =>
    schema
      .trim()
      .min(MIN_STRING_LENGTH, { message: minLengthDesc('Option name', MIN_STRING_LENGTH) })
      .max(MAX_STRING_LENGTH, { message: maxLengthDesc('Option name', MAX_STRING_LENGTH) })
      .openapi({ description: 'Option name', example: 'Large' }),
  priceModifier: (schema) =>
    schema
      .min(MIN_CURRENCY_VALUE)
      .max(MAX_CURRENCY_VALUE)
      .openapi({ description: 'Price modifier added to base price', example: 5.99 }),
  updatedAt: (schema) =>
    schema.openapi({ description: 'Update timestamp', example: '2023-01-01T00:00:00Z' }),
})
  .omit({ createdAt: true, updatedAt: true })
  .openapi('MenuOption')

export const InsertMenuOptionSchema = createInsertSchema(menuOption, {
  caloriesModifier: () => SelectMenuOptionSchema.shape.caloriesModifier,
  displayOrder: () => SelectMenuOptionSchema.shape.displayOrder,
  groupId: () => SelectMenuOptionSchema.shape.groupId,
  isAvailable: () => SelectMenuOptionSchema.shape.isAvailable,
  isDefault: () => SelectMenuOptionSchema.shape.isDefault,
  name: () => SelectMenuOptionSchema.shape.name,
  priceModifier: () => SelectMenuOptionSchema.shape.priceModifier,
})
  .omit({ createdAt: true, id: true, updatedAt: true })
  .openapi('MenuOptionCreate')

export const UpdateMenuOptionSchema = createUpdateSchema(menuOption, {
  caloriesModifier: () => SelectMenuOptionSchema.shape.caloriesModifier,
  displayOrder: () => SelectMenuOptionSchema.shape.displayOrder,
  groupId: () => SelectMenuOptionSchema.shape.groupId,
  isAvailable: () => SelectMenuOptionSchema.shape.isAvailable,
  isDefault: () => SelectMenuOptionSchema.shape.isDefault,
  name: () => SelectMenuOptionSchema.shape.name,
  priceModifier: () => SelectMenuOptionSchema.shape.priceModifier,
})
  .omit({ createdAt: true, updatedAt: true })
  .openapi('MenuOptionUpdate')

export type InsertMenuOptionDB = z.input<typeof InsertMenuOptionSchema>
export type UpdateMenuOptionDB = z.input<typeof UpdateMenuOptionSchema>
