import { createRoute, z } from '@hono/zod-openapi'
import { SelectAllergenSchema } from '@mac/db/schemas'
import {
  createDataSuccessDesc,
  getDataFailedDesc,
  getDataSuccessDesc,
  NOT_AUTHENTICATED,
  NOT_AUTHORIZED,
  notFoundDesc,
  VALIDATION_ERROR_DESC,
} from '@mac/resources/general'
import {
  CONFLICT,
  CREATED,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NO_CONTENT,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from '@mac/resources/http-status-codes'
import { createIdParamsOpenapiSchema, paginationValidator } from '@mac/validators/general'

import { jsonContent, jsonContentRequired } from '@/lib/openapi/helpers'
import { createErrorSchema, createMessageObjectSchema } from '@/lib/openapi/schemas'
import { protect } from '@/middlewares'

const tags = ['Allergens']

export const entity = 'Allergen' as const
export const menuItemEntity = 'Menu Item' as const

export const entityFailedToGetDesc = getDataFailedDesc(entity)
export const menuItemNotFoundDesc = notFoundDesc(menuItemEntity)

export const menuItemIdParamsSchema = createIdParamsOpenapiSchema(menuItemEntity)

export const getAllergens = createRoute({
  description: 'Get all allergens.',
  method: 'get',
  path: '/',
  request: {
    query: paginationValidator,
  },
  responses: {
    [OK]: jsonContent(z.array(SelectAllergenSchema), getDataSuccessDesc(entity)),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(paginationValidator),
      VALIDATION_ERROR_DESC
    ),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(entityFailedToGetDesc),
      entityFailedToGetDesc
    ),
  },
  summary: 'Get All Allergens',
  tags,
})

export const getMenuItemAllergens = createRoute({
  description: 'Get allergens for a specific menu item.',
  method: 'get',
  path: '/:menuItemId/allergens',
  request: {
    params: menuItemIdParamsSchema,
  },
  responses: {
    [OK]: jsonContent(
      z.array(
        z.object({
          allergen: SelectAllergenSchema,
          severity: z.string(),
        })
      ),
      getDataSuccessDesc(entity)
    ),
    [NOT_FOUND]: jsonContent(createMessageObjectSchema(menuItemNotFoundDesc), menuItemNotFoundDesc),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(menuItemIdParamsSchema),
      VALIDATION_ERROR_DESC
    ),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(entityFailedToGetDesc),
      entityFailedToGetDesc
    ),
  },
  summary: 'Get Menu Item Allergens',
  tags,
})

export const addMenuItemAllergen = createRoute({
  description: 'Add an allergen to a menu item.',
  method: 'post',
  middleware: [protect],
  path: '/:menuItemId/allergens',
  request: {
    body: jsonContentRequired(
      z.object({
        allergenId: z.string(),
        severity: z.string().optional().default('contains'),
      }),
      'Allergen data to add'
    ),
    params: menuItemIdParamsSchema,
  },
  responses: {
    [CREATED]: {
      description: createDataSuccessDesc('Menu Item Allergen'),
    },
    [NOT_FOUND]: jsonContent(createMessageObjectSchema(menuItemNotFoundDesc), menuItemNotFoundDesc),
    [CONFLICT]: jsonContent(
      createMessageObjectSchema('Allergen already exists for this menu item'),
      'Allergen already exists for this menu item'
    ),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(
        z.object({
          allergenId: z.string(),
          severity: z.string().optional(),
        })
      ),
      VALIDATION_ERROR_DESC
    ),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema('Failed to add allergen'),
      'Failed to add allergen'
    ),
    [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
    [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
  },
  summary: 'Add Menu Item Allergen',
  tags,
})

export const removeMenuItemAllergen = createRoute({
  description: 'Remove an allergen from a menu item.',
  method: 'delete',
  middleware: [protect],
  path: '/:menuItemId/allergens/:allergenId',
  request: {
    params: z.object({
      allergenId: z.string(),
      menuItemId: z.string(),
    }),
  },
  responses: {
    [NO_CONTENT]: {
      description: 'Allergen removed successfully',
    },
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(
        z.object({
          allergenId: z.string(),
          menuItemId: z.string(),
        })
      ),
      VALIDATION_ERROR_DESC
    ),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema('Failed to remove allergen'),
      'Failed to remove allergen'
    ),
    [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
    [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
  },
  summary: 'Remove Menu Item Allergen',
  tags,
})
