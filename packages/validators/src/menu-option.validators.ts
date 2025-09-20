import { z } from '@hono/zod-openapi'
import {
  InsertMenuOptionSchema,
  SelectMenuOptionSchema,
  UpdateMenuOptionSchema,
} from '@mac/db/schemas'

export const readMenuOptionValidator = SelectMenuOptionSchema
export const readMenuOptionsValidator = z.array(SelectMenuOptionSchema)
export const createMenuOptionValidator = z.object({
  ...InsertMenuOptionSchema.shape,
})
export const updateMenuOptionValidator = z.object({
  ...UpdateMenuOptionSchema.shape,
})

export type MenuOption = z.infer<typeof readMenuOptionValidator>
export type CreateMenuOption = z.infer<typeof createMenuOptionValidator>
export type UpdateMenuOptionInput = z.input<typeof updateMenuOptionValidator>
export type UpdateMenuOptionParsed = z.output<typeof updateMenuOptionValidator>
