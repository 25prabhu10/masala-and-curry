import { z } from '@hono/zod-openapi'
import {
  InsertMenuItemSchema,
  SelectCategorySchema,
  SelectMenuItemSchema,
  UpdateMenuItemSchema,
} from '@mac/db/schemas'

import { paginationValidator, rowCountValidator } from './general.validators'

export const readMenuItemValidator = z.object({
  ...SelectMenuItemSchema.shape,
  category: z.object({
    displayOrder: SelectCategorySchema.shape.displayOrder,
    id: SelectCategorySchema.shape.id,
    name: SelectCategorySchema.shape.name,
  }),
})
export const readMenuItemsValidator = z.object({
  result: z.array(readMenuItemValidator),
  rowCount: rowCountValidator,
})
export const createMenuItemValidator = InsertMenuItemSchema
export const updateMenuItemValidator = UpdateMenuItemSchema
export type MenuItem = z.output<typeof readMenuItemValidator>
export type CreateMenuItem = z.infer<typeof createMenuItemValidator>
export type UpdateMenuItem = z.infer<typeof updateMenuItemValidator>

export const menuItemFiltersValidator = z
  .object({
    ...paginationValidator.shape,
    // availableOnly: readMenuItemValidator.shape.isAvailable,
    categoryId: SelectCategorySchema.shape.id,
    // glutenFree: readMenuItemValidator.shape.isGlutenFree.unwrap(),
    // maxPrice: SelectMenuItemSchema.shape.basePrice,
    // minPrice: SelectMenuItemSchema.shape.basePrice,
    // popular: readMenuItemValidator.shape.isPopular.unwrap(),
    // vegan: readMenuItemValidator.shape.isVegan.unwrap(),
    // vegetarian: readMenuItemValidator.shape.isVegetarian.unwrap(),
  })
  // .refine((data) => data.minPrice < data.maxPrice, {
  //   message: 'Maximum price should be more than minimum price',
  //   path: ['maxPrice'],
  // })
  .partial()

export type MenuItemFilters = z.infer<typeof menuItemFiltersValidator>
