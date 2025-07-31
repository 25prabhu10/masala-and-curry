import { z } from '@hono/zod-openapi'

import { paginationSchema } from './pagination.schema'

export const menuFiltersSchema = z.object({
  availableOnly: z
    .boolean()
    .optional()
    .default(true)
    .openapi({ description: 'Show only available items' }),
  categoryId: z.string().optional().openapi({ description: 'Filter by category ID' }),
  featured: z.boolean().optional().openapi({ description: 'Filter featured items' }),
  glutenFree: z.boolean().optional().openapi({ description: 'Filter gluten-free items' }),
  maxPrice: z.number().positive().optional().openapi({ description: 'Maximum price filter' }),
  minPrice: z.number().positive().optional().openapi({ description: 'Minimum price filter' }),
  popular: z.boolean().optional().openapi({ description: 'Filter popular items' }),
  search: z.string().optional().openapi({ description: 'Search menu items by name' }),
  vegan: z.boolean().optional().openapi({ description: 'Filter vegan items' }),
  vegetarian: z.boolean().optional().openapi({ description: 'Filter vegetarian items' }),
  ...paginationSchema.shape,
})
