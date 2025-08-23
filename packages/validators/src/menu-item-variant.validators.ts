import { z } from '@hono/zod-openapi'
import {
  InsertMenuItemVariantSchema,
  SelectMenuItemVariantSchema,
  UpdateMenuItemVariantSchema,
} from '@mac/db/schemas'

export const readMenuItemVariantValidator = SelectMenuItemVariantSchema
export const readMenuItemVariantsValidator = z.array(SelectMenuItemVariantSchema)
export const createMenuItemVariantValidator = z.object({
  ...InsertMenuItemVariantSchema.shape,
  _tempId: z.uuid().optional(),
})
export const updateMenuItemVariantValidator = z.object({
  ...UpdateMenuItemVariantSchema.shape,
  _tempId: z.uuid().optional(),
})

export type MenuItemVariant = z.infer<typeof readMenuItemVariantValidator>
export type CreateMenuItemVariant = z.infer<typeof createMenuItemVariantValidator>
export type UpdateMenuItemVariantInput = z.input<typeof updateMenuItemVariantValidator>
export type UpdateMenuItemVariantParsed = z.output<typeof updateMenuItemVariantValidator>
