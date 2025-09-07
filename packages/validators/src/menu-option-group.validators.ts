import { z } from '@hono/zod-openapi'
import {
  InsertMenuOptionGroupSchema,
  SelectMenuOptionGroupSchema,
  UpdateMenuOptionGroupSchema,
} from '@mac/db/schemas'

export const readMenuOptionGroupValidator = SelectMenuOptionGroupSchema
export const readMenuOptionGroupsValidator = z.array(SelectMenuOptionGroupSchema)
export const createMenuOptionGroupValidator = z.object({
  ...InsertMenuOptionGroupSchema.shape,
  _tempId: z.uuid().optional(),
})
export const updateMenuOptionGroupValidator = z.object({
  ...UpdateMenuOptionGroupSchema.shape,
  _tempId: z.uuid().optional(),
})

export type MenuOptionGroup = z.infer<typeof readMenuOptionGroupValidator>
export type CreateMenuOptionGroup = z.infer<typeof createMenuOptionGroupValidator>
export type UpdateMenuOptionGroupInput = z.input<typeof updateMenuOptionGroupValidator>
export type UpdateMenuOptionGroupParsed = z.output<typeof updateMenuOptionGroupValidator>
