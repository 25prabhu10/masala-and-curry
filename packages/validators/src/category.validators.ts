// oxlint-disable prefer-top-level-await
import { z } from '@hono/zod-openapi'
import { InsertCategorySchema, SelectCategorySchema, UpdateCategorySchema } from '@mac/db/schemas'
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@mac/resources/constants'

import {
  type ColumnsOf,
  createCategoryValidatorURLSafe,
  createSortingValidator,
  paginationValidator,
  rowCountValidator,
} from './general.validators'

export const readCategoryValidator = SelectCategorySchema
export const readCategoriesWithPaginationValidator = z.object({
  result: SelectCategorySchema.array(),
  rowCount: rowCountValidator,
})
export const createCategoryValidator = InsertCategorySchema
export const updateCategoryValidator = UpdateCategorySchema

export type Category = z.infer<typeof readCategoryValidator>
export type CreateCategory = z.infer<typeof createCategoryValidator>
export type UpdateCategoryInput = z.input<typeof updateCategoryValidator>
export type UpdateCategoryParsed = z.output<typeof updateCategoryValidator>

// Ensures sorting is limited to valid category columns
const categorySortableColumns = ['displayOrder', 'name'] as const satisfies ColumnsOf<Category>

export const categoryFiltersValidator = z
  .object({
    activeOnly: SelectCategorySchema.shape.isActive,
    search: InsertCategorySchema.shape.name,
    sortBy: createSortingValidator(categorySortableColumns, 'displayOrder'),
    ...paginationValidator.shape,
  })
  .partial()
  .openapi({
    description: 'Filters that can be applied when getting Categories',
    example: {
      activeOnly: true,
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
      sortBy: 'displayOrder',
    },
  })
  .openapi('CategoryFilters')

// Hono Zod Openapi throws error when `.catch` is used.
export const categoryFiltersValidatorWithCatch = z
  .object({
    activeOnly: SelectCategorySchema.shape.isActive.unwrap().catch(true),
    pageIndex: paginationValidator.shape.pageIndex.catch(DEFAULT_PAGE_INDEX),
    pageSize: paginationValidator.shape.pageSize.catch(DEFAULT_PAGE_SIZE),
    search: InsertCategorySchema.shape.name.catch("''"),
    sortBy: createCategoryValidatorURLSafe(categorySortableColumns, 'displayOrder').catch(
      'displayOrder'
    ),
  })
  .partial()

export type CategoryFilters = z.output<typeof categoryFiltersValidator>
export type CategoryFiltersWithCatch = z.output<typeof categoryFiltersValidatorWithCatch>
