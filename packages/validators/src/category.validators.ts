import { InsertCategorySchema, SelectCategorySchema } from '@mac/db/schemas'
import { z } from 'zod'

export const readCategoryValidator = z.object({
  ...SelectCategorySchema.shape,
  createdAt: SelectCategorySchema.shape.createdAt.transform((date) => date.toISOString()),
  updatedAt: SelectCategorySchema.shape.updatedAt.transform((date) => date.toISOString()),
})

export const createCategoryValidator = z.object({
  ...InsertCategorySchema.shape,
})

export const updateCategoryValidator = createCategoryValidator.partial()

export type Category = z.output<typeof readCategoryValidator>
export type UpdateCategory = z.input<typeof updateCategoryValidator>
