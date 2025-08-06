import { z } from '@hono/zod-openapi'
import { InsertCategorySchema, SelectCategorySchema, UpdateCategorySchema } from '@mac/db/schemas'

import {
  type ColumnsOf,
  createSortingValidator,
  paginationValidator,
  rowCountValidator,
} from './general.validators'

export const readCategoryValidator = SelectCategorySchema
export const readCategoriesValidator = SelectCategorySchema.array()
export const readCategoriesValidatorWithPagination = z.object({
  result: readCategoriesValidator,
  rowCount: rowCountValidator,
})
export const createCategoryValidator = InsertCategorySchema
export const updateCategoryValidator = UpdateCategorySchema

export type Category = z.infer<typeof readCategoryValidator>
export type CreateCategory = z.infer<typeof createCategoryValidator>
export type UpdateCategory = z.infer<typeof updateCategoryValidator>

const categorySortableColumns = ['displayOrder', 'name'] as const satisfies ColumnsOf<Category>

export function getCategoryFiltersValidator(urlSafe: boolean = false) {
  return z
    .object({
      activeOnly: SelectCategorySchema.shape.isActive,
      sortBy: createSortingValidator(categorySortableColumns, 'displayOrder', urlSafe),
      ...paginationValidator.shape,
    })
    .partial()
    .openapi({
      description: 'Get Categories filters',
    })
    .openapi('CategoriesFilters')
}

export type CategoryFilters = z.output<ReturnType<typeof getCategoryFiltersValidator>>
