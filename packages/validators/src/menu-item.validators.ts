// oxlint-disable prefer-top-level-await
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
  createCategoryValidatorURLSafe,
  createSortingValidator,
  paginationValidator,
  rowCountValidator,
} from './general.validators'
import { uploadImageSchema } from './image.validators'
import {
  createMenuOptionValidator,
  readMenuOptionValidator,
  updateMenuOptionValidator,
} from './menu-option.validators'
import {
  createMenuOptionGroupValidator,
  readMenuOptionGroupValidator,
  updateMenuOptionGroupValidator,
} from './menu-option-group.validators'

export const readMenuItemValidator = z.object({
  ...SelectMenuItemSchema.shape,
  category: z
    .object({
      displayOrder: SelectCategorySchema.shape.displayOrder,
      id: SelectCategorySchema.shape.id,
      name: SelectCategorySchema.shape.name,
    })
    .nullable(),
  optionGroups: z
    .array(
      z.object({
        ...readMenuOptionGroupValidator.shape,
        options: z.array(
          z.object({
            ...readMenuOptionValidator.shape,
          })
        ),
      })
    )
    .optional(),
})
export const readMenuItemsValidator = z.object({
  result: readMenuItemValidator.array(),
  rowCount: rowCountValidator,
})
export const createMenuItemValidator = z.object({
  ...InsertMenuItemSchema.shape,
  optionGroups: z
    .array(
      z.object({
        ...createMenuOptionGroupValidator.shape,
        options: z.array(
          z.object({
            ...createMenuOptionValidator.shape,
          })
        ),
      })
    )
    .optional(),
})
export const updateMenuItemValidator = z.object({
  ...UpdateMenuItemSchema.shape,
  optionGroups: z
    .array(
      z.object({
        ...updateMenuOptionGroupValidator.shape,
        options: z.array(
          z.object({
            ...updateMenuOptionValidator.shape,
          })
        ),
      })
    )
    .optional(),
})

export const createMenuItemWithImageValidator = z.object({
  ...createMenuItemValidator.shape,
  file: uploadImageSchema.shape.file.optional(),
})

export const updateMenuItemWithImageValidator = z.object({
  ...updateMenuItemValidator.shape,
  file: uploadImageSchema.shape.file.optional(),
})

export type MenuItem = z.output<typeof readMenuItemValidator>
export type CreateMenuItem = z.infer<typeof createMenuItemValidator>
export type CreateMenuItemInput = z.infer<typeof createMenuItemWithImageValidator>
export type UpdateMenuItem = z.output<typeof updateMenuItemValidator>
export type UpdateMenuItemInput = z.input<typeof updateMenuItemWithImageValidator>

const menuItemSortableColumns = [
  'displayOrder',
  'name',
  'isPopular',
] as const satisfies ColumnsOf<MenuItem>

// TODO: add max and min price
export const menuItemFiltersValidator = z
  .object({
    availableOnly: readMenuItemValidator.shape.isAvailable.unwrap(),
    categoryId: SelectCategorySchema.shape.id,
    glutenFree: readMenuItemValidator.shape.isGlutenFree.unwrap(),
    popular: readMenuItemValidator.shape.isPopular.unwrap(),
    search: InsertMenuItemSchema.shape.name,
    sortBy: createSortingValidator(menuItemSortableColumns, 'displayOrder'),
    vegan: readMenuItemValidator.shape.isVegan.unwrap(),
    vegetarian: readMenuItemValidator.shape.isVegetarian.unwrap(),
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
    availableOnly: readMenuItemValidator.shape.isAvailable.unwrap().default(true).catch(true),
    categoryId: SelectCategorySchema.shape.id
      .catch('')
      .transform((value) => (value === '_null' ? '' : value)),
    glutenFree: readMenuItemValidator.shape.isGlutenFree.unwrap().catch(false),
    popular: readMenuItemValidator.shape.isPopular.unwrap().catch(false),
    search: InsertMenuItemSchema.shape.name.catch("''"),
    sortBy: createCategoryValidatorURLSafe(menuItemSortableColumns, 'displayOrder').catch(
      'displayOrder'
    ),
    vegan: readMenuItemValidator.shape.isVegan.unwrap().catch(false),
    vegetarian: readMenuItemValidator.shape.isVegetarian.unwrap().catch(false),
  })
  .partial()

export const menuItemFiltersValidatorWithCatchAndPagination = z.object({
  ...menuItemFiltersValidatorWithCatch.shape,
  pageIndex: paginationValidator.shape.pageIndex.catch(DEFAULT_PAGE_INDEX),
  pageSize: paginationValidator.shape.pageSize.catch(DEFAULT_PAGE_SIZE),
})

export type MenuItemFilters = z.infer<typeof menuItemFiltersValidator>
