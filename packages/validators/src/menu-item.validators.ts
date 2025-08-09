import { z } from '@hono/zod-openapi'
import {
  InsertMenuItemSchema,
  SelectCategorySchema,
  SelectMenuItemSchema,
  UpdateMenuItemSchema,
} from '@mac/db/schemas'
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@mac/resources/constants'

import {
  type ColumnsOf,
  createSortingValidator,
  paginationValidator,
  rowCountValidator,
} from './general.validators'

export const readMenuItemValidator = z.object({
  ...SelectMenuItemSchema.shape,
  category: z
    .object({
      displayOrder: SelectCategorySchema.shape.displayOrder,
      id: SelectCategorySchema.shape.id,
      name: SelectCategorySchema.shape.name,
    })
    .nullable(),
})
export const readMenuItemsValidator = z.object({
  result: readMenuItemValidator.array(),
  rowCount: rowCountValidator,
})
export const createMenuItemValidator = InsertMenuItemSchema
export const updateMenuItemValidator = UpdateMenuItemSchema

export type MenuItem = z.output<typeof readMenuItemValidator>
export type CreateMenuItem = z.infer<typeof createMenuItemValidator>
export type UpdateMenuItem = z.infer<typeof updateMenuItemValidator>

const menuItemSortableColumns = ['displayOrder', 'name'] as const satisfies ColumnsOf<MenuItem>

// TODO: add max and min price
export const menuItemFiltersValidator = z
  .object({
    availableOnly: readMenuItemValidator.shape.isAvailable,
    categoryId: SelectCategorySchema.shape.id,
    glutenFree: readMenuItemValidator.shape.isGlutenFree,
    popular: readMenuItemValidator.shape.isPopular,
    search: InsertMenuItemSchema.shape.name,
    sortBy: createSortingValidator(menuItemSortableColumns, 'displayOrder', false),
    vegan: readMenuItemValidator.shape.isVegan,
    vegetarian: readMenuItemValidator.shape.isVegetarian,
    ...paginationValidator.shape,
  })
  .partial()
  .openapi({
    description: 'Filters for querying menu items',
    example: {
      availableOnly: true,
      categoryId: '123',
      glutenFree: false,
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
      popular: true,
      search: 'Pizza',
      sortBy: 'name',
      vegan: false,
      vegetarian: true,
    },
  })
  .openapi('MenuItemFilters')

export const menuItemFiltersValidatorWithCatch = z
  .object({
    availableOnly: readMenuItemValidator.shape.isAvailable.catch(true),
    categoryId: SelectCategorySchema.shape.id.catch(''),
    glutenFree: readMenuItemValidator.shape.isGlutenFree.catch(false),
    pageIndex: paginationValidator.shape.pageIndex.catch(DEFAULT_PAGE_INDEX),
    pageSize: paginationValidator.shape.pageSize.catch(DEFAULT_PAGE_SIZE),
    popular: readMenuItemValidator.shape.isPopular.catch(false),
    sortBy: createSortingValidator(menuItemSortableColumns, 'displayOrder', true).catch(
      'displayOrder'
    ),
    vegan: readMenuItemValidator.shape.isVegan.catch(false),
    vegetarian: readMenuItemValidator.shape.isVegetarian.catch(false),
  })
  .partial()

export type MenuItemFilters = z.infer<typeof menuItemFiltersValidator>
