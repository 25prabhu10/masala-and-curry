import { z } from '@hono/zod-openapi'
import {
  InsertMenuItemSchema,
  SelectCategorySchema,
  SelectMenuItemSchema,
  UpdateMenuItemSchema,
} from '@mac/db/schemas'

import { paginationValidator } from './general.validators'

export const readMenuItemValidator = z.array(
  z.object({
    ...SelectMenuItemSchema.shape,
    category: z.object({
      displayOrder: SelectCategorySchema.shape.displayOrder,
      id: SelectCategorySchema.shape.id,
      name: SelectCategorySchema.shape.name,
    }),
  })
)
export const readMenuItemsValidator = z.array(readMenuItemValidator)
export const createMenuItemValidator = InsertMenuItemSchema
export const updateMenuItemValidator = UpdateMenuItemSchema

export const menuItemFiltersValidator = z
  .object({
    ...paginationValidator.shape,
    availableOnly: SelectMenuItemSchema.shape.isAvailable,
    categoryId: SelectCategorySchema.shape.id,
    glutenFree: SelectMenuItemSchema.shape.isGlutenFree,
    maxPrice: SelectMenuItemSchema.shape.basePrice,
    minPrice: SelectMenuItemSchema.shape.basePrice,
    popular: SelectMenuItemSchema.shape.isPopular,
    search: SelectMenuItemSchema.shape.name.default(''),
    vegan: SelectMenuItemSchema.shape.isVegan,
    vegetarian: SelectMenuItemSchema.shape.isVegetarian,
  })
  .refine((data) => data.minPrice < data.maxPrice, {
    message: 'Maximum price should be more than minimum price',
    path: ['maxPrice'],
  })
  .partial()

export type MenuItem = z.output<typeof readMenuItemValidator>
export type MenuItemFilters = z.infer<typeof menuItemFiltersValidator>
