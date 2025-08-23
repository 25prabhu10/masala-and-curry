import { z } from '@hono/zod-openapi'
import { NANOID_LENGTH } from '@mac/resources/constants'
import { maxLengthDesc } from '@mac/resources/general'
import { sql } from 'drizzle-orm'
import { check, index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createSchemaFactory } from 'drizzle-zod'

import { generatePublicId } from '../utils'
import { menuItem } from './menu-item.schema'

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({
  zodInstance: z,
})

export const menuAvailability = sqliteTable(
  'menu_availability',
  {
    createdAt: integer({ mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    dayOfWeek: integer({ mode: 'number' }).notNull(), // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    endTime: text({ length: 5 }).notNull(), // "HH:MM" format (24-hour)
    id: text({ length: NANOID_LENGTH })
      .$defaultFn(() => generatePublicId())
      .primaryKey(),
    isActive: integer({ mode: 'boolean' }).notNull().default(true),
    menuItemId: text({ length: NANOID_LENGTH })
      .notNull()
      .references(() => menuItem.id, { onDelete: 'cascade' }),
    startTime: text({ length: 5 }).notNull(), // "HH:MM" format (24-hour)
    updatedAt: integer({ mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`)
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check('day_of_week_check', sql`${table.dayOfWeek} >= 0 AND ${table.dayOfWeek} <= 6`),
    index('idx_availability_menu_item_id').on(table.menuItemId),
    index('idx_availability_time_check').on(
      table.menuItemId,
      table.dayOfWeek,
      table.startTime,
      table.endTime,
      table.isActive
    ),
  ]
)

export const SelectMenuAvailabilitySchema = createSelectSchema(menuAvailability, {
  createdAt: (schema) =>
    schema.openapi({
      description: 'Availability creation timestamp',
      example: '2023-01-01T00:00:00Z',
    }),
  dayOfWeek: () =>
    z
      .int()
      .min(0, 'Day of week must be between 0-6')
      .max(6, 'Day of week must be between 0-6')
      .openapi({
        description: 'Day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)',
        example: 1,
      }),
  endTime: () =>
    z.iso.time({ precision: -1 }).openapi({
      description: 'End time in HH:MM format (24-hour)',
      example: '11:30',
    }),
  id: (schema) =>
    schema
      .max(NANOID_LENGTH, {
        message: maxLengthDesc('Menu Availability ID', NANOID_LENGTH),
      })
      .openapi({
        description: 'Unique availability identifier',
        example: 'avail_breakfast_001',
      }),
  isActive: (schema) =>
    schema.default(true).openapi({
      description: 'Whether this availability schedule is active',
      example: true,
    }),
  menuItemId: (schema) =>
    schema
      .max(NANOID_LENGTH, {
        message: maxLengthDesc('Menu item ID', NANOID_LENGTH),
      })
      .openapi({
        description: 'Menu item identifier',
        example: 'item_pancakes_001',
      }),
  startTime: () =>
    z.iso.time({ precision: -1 }).openapi({
      description: 'Start time in HH:MM format (24-hour)',
      example: '08:00',
    }),
  updatedAt: (schema) =>
    schema.openapi({
      description: 'Last update timestamp',
      example: '2023-01-01T00:00:00Z',
    }),
}).openapi('MenuAvailability')

export const InsertMenuAvailabilitySchema = createInsertSchema(menuAvailability, {
  dayOfWeek: () => SelectMenuAvailabilitySchema.shape.dayOfWeek,
  endTime: () => SelectMenuAvailabilitySchema.shape.endTime,
  isActive: () => SelectMenuAvailabilitySchema.shape.isActive,
  menuItemId: () => SelectMenuAvailabilitySchema.shape.menuItemId,
  startTime: () => SelectMenuAvailabilitySchema.shape.startTime,
})
  .omit({
    createdAt: true,
    id: true,
    updatedAt: true,
  })
  .refine((data) => data.startTime <= data.endTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  })
  .openapi('MenuAvailabilityCreate')

export const UpdateMenuAvailabilitySchema = createUpdateSchema(menuAvailability, {
  dayOfWeek: () => SelectMenuAvailabilitySchema.shape.dayOfWeek,
  endTime: () => SelectMenuAvailabilitySchema.shape.endTime,
  isActive: () => SelectMenuAvailabilitySchema.shape.isActive,
  menuItemId: () => SelectMenuAvailabilitySchema.shape.menuItemId,
  startTime: () => SelectMenuAvailabilitySchema.shape.startTime,
})
  .omit({
    createdAt: true,
    id: true,
    updatedAt: true,
  })
  .openapi('MenuAvailabilityUpdate')
