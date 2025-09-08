import { z } from '@hono/zod-openapi'
import {
  MAX_NUMBER_IN_APP,
  MAX_STRING_LENGTH,
  MIN_STRING_LENGTH,
  NANOID_LENGTH,
  SELECTION_TYPES,
} from '@mac/resources/constants'
import { maxLengthDesc, minLengthDesc } from '@mac/resources/general'
import { sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { createSchemaFactory } from 'drizzle-zod'

import { generatePublicId } from '../utils'
import { menuItem } from './menu-item.schema'

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({
  zodInstance: z,
})

const selectionTypeEnum = z.enum(SELECTION_TYPES, {
  error: (issue) => `Selection type must be one of: ${issue.options}`,
})

export const menuOptionGroup = sqliteTable(
  'menu_option_group',
  {
    createdAt: integer({ mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    displayOrder: integer({ mode: 'number' }).notNull().default(0),
    id: text({ length: NANOID_LENGTH })
      .$defaultFn(() => generatePublicId())
      .primaryKey(),
    isAvailable: integer({ mode: 'boolean' }).notNull().default(true),
    maxSelect: integer({ mode: 'number' }).notNull().default(1),
    menuItemId: text({ length: NANOID_LENGTH })
      .notNull()
      .references(() => menuItem.id, { onDelete: 'cascade' }),
    minSelect: integer({ mode: 'number' }).notNull().default(0),
    name: text({ length: MAX_STRING_LENGTH }).notNull(),
    required: integer({ mode: 'boolean' }).notNull().default(false),
    selectionType: text({ length: 16 }).notNull().default('single'),
    updatedAt: integer({ mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`)
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex('idx_group_menu_item_name_unique').on(table.menuItemId, table.name),
    index('idx_group_menu_item_id').on(table.menuItemId),
    index('idx_group_available').on(table.isAvailable),
    index('idx_group_display_order').on(table.displayOrder),
  ]
)

export const SelectMenuOptionGroupSchema = createSelectSchema(menuOptionGroup, {
  createdAt: (schema) =>
    schema.openapi({ description: 'Creation timestamp', example: '2023-01-01T00:00:00Z' }),
  displayOrder: (schema) =>
    schema
      .nonnegative()
      .max(MAX_NUMBER_IN_APP)
      .openapi({ description: 'Display order for groups', example: 1 }),
  id: (schema) =>
    schema
      .max(NANOID_LENGTH, {
        message: maxLengthDesc('Option Group ID', NANOID_LENGTH),
      })
      .openapi({ description: 'Unique option group identifier', example: 'mog_size_001' }),
  isAvailable: (schema) =>
    schema.default(true).openapi({ description: 'Group availability', example: true }),
  maxSelect: (schema) =>
    schema
      .positive()
      .max(MAX_NUMBER_IN_APP)
      .openapi({ description: 'Maximum selections allowed', example: 1 }),
  menuItemId: (schema) =>
    schema
      .max(NANOID_LENGTH, {
        message: maxLengthDesc('Menu Item ID', NANOID_LENGTH),
      })
      .openapi({ description: 'Menu item identifier', example: 'item_chicken_curry_001' }),
  minSelect: (schema) =>
    schema
      .nonnegative()
      .max(MAX_NUMBER_IN_APP)
      .openapi({ description: 'Minimum selections required', example: 1 }),
  name: (schema) =>
    schema
      .trim()
      .min(MIN_STRING_LENGTH, { message: minLengthDesc('Group name', MIN_STRING_LENGTH) })
      .max(MAX_STRING_LENGTH, { message: maxLengthDesc('Group name', MAX_STRING_LENGTH) })
      .openapi({ description: 'Option group name', example: 'Size' }),
  required: (schema) =>
    schema.default(false).openapi({ description: 'Is selection required?', example: true }),
  selectionType: () =>
    selectionTypeEnum.openapi({
      description: 'Selection behavior for the group',
      example: 'single',
    }),
  updatedAt: (schema) =>
    schema.openapi({ description: 'Update timestamp', example: '2023-01-01T00:00:00Z' }),
})
  .omit({ createdAt: true, updatedAt: true })
  .superRefine((val, ctx) => {
    if (val.selectionType === 'single' && val.maxSelect !== 1) {
      ctx.addIssue({ code: 'custom', message: 'For single selection groups, maxSelect must be 1' })
    }
    if (val.minSelect < 0) {
      ctx.addIssue({ code: 'custom', message: 'minSelect must be >= 0' })
    }
    if (val.maxSelect < 1) {
      ctx.addIssue({ code: 'custom', message: 'maxSelect must be >= 1' })
    }
    if (val.minSelect > val.maxSelect) {
      ctx.addIssue({ code: 'custom', message: 'minSelect cannot exceed maxSelect' })
    }
    if (val.selectionType === 'single' && val.required && val.minSelect < 1) {
      ctx.addIssue({
        code: 'custom',
        message: 'Required single-select groups must have minSelect >= 1',
      })
    }
  })
  .openapi('MenuOptionGroup')

export const InsertMenuOptionGroupSchema = createInsertSchema(menuOptionGroup, {
  displayOrder: () => SelectMenuOptionGroupSchema.shape.displayOrder,
  isAvailable: () => SelectMenuOptionGroupSchema.shape.isAvailable,
  maxSelect: () => SelectMenuOptionGroupSchema.shape.maxSelect,
  menuItemId: () => SelectMenuOptionGroupSchema.shape.menuItemId,
  minSelect: () => SelectMenuOptionGroupSchema.shape.minSelect,
  name: () => SelectMenuOptionGroupSchema.shape.name,
  required: () => SelectMenuOptionGroupSchema.shape.required,
  selectionType: () => SelectMenuOptionGroupSchema.shape.selectionType,
})
  .omit({ createdAt: true, id: true, updatedAt: true })
  .superRefine((val, ctx) => {
    if (val.selectionType === 'single' && val.maxSelect !== 1) {
      ctx.addIssue({ code: 'custom', message: 'For single selection groups, maxSelect must be 1' })
    }
    if (
      val.minSelect !== undefined &&
      val.maxSelect !== undefined &&
      val.minSelect > val.maxSelect
    ) {
      ctx.addIssue({ code: 'custom', message: 'minSelect cannot exceed maxSelect' })
    }
    if (val.selectionType === 'single' && val.required && (val.minSelect ?? 0) < 1) {
      ctx.addIssue({
        code: 'custom',
        message: 'Required single-select groups must have minSelect >= 1',
      })
    }
  })
  .openapi('MenuOptionGroupCreate')

export const UpdateMenuOptionGroupSchema = createUpdateSchema(menuOptionGroup, {
  displayOrder: () => SelectMenuOptionGroupSchema.shape.displayOrder,
  isAvailable: () => SelectMenuOptionGroupSchema.shape.isAvailable,
  maxSelect: () => SelectMenuOptionGroupSchema.shape.maxSelect,
  menuItemId: () => SelectMenuOptionGroupSchema.shape.menuItemId,
  minSelect: () => SelectMenuOptionGroupSchema.shape.minSelect,
  name: () => SelectMenuOptionGroupSchema.shape.name,
  required: () => SelectMenuOptionGroupSchema.shape.required,
  selectionType: () => SelectMenuOptionGroupSchema.shape.selectionType,
})
  .omit({ createdAt: true, updatedAt: true })
  .superRefine((val, ctx) => {
    if (val.selectionType === 'single' && val.maxSelect !== undefined && val.maxSelect !== 1) {
      ctx.addIssue({ code: 'custom', message: 'For single selection groups, maxSelect must be 1' })
    }
    if (
      val.minSelect !== undefined &&
      val.maxSelect !== undefined &&
      val.minSelect > val.maxSelect
    ) {
      ctx.addIssue({ code: 'custom', message: 'minSelect cannot exceed maxSelect' })
    }
  })
  .openapi('MenuOptionGroupUpdate')

export type InsertMenuOptionGroupDB = z.input<typeof InsertMenuOptionGroupSchema>
export type UpdateMenuOptionGroupDB = z.input<typeof UpdateMenuOptionGroupSchema>
