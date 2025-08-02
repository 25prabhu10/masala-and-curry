import { createRoute, z } from '@hono/zod-openapi'
import {
  InsertMenuItemVariantSchema,
  SelectMenuItemVariantSchema,
  UpdateMenuItemVariantSchema,
} from '@mac/db/schemas'
import {
  createDataDesc,
  createDataSuccessDesc,
  createFailedDesc,
  deleteFailedDesc,
  deleteSuccessDesc,
  getDataFailedDesc,
  getDataSuccessDesc,
  NOT_AUTHENTICATED,
  NOT_AUTHORIZED,
  notFoundDesc,
  updateDataDesc,
  updateFailedDesc,
  updateSuccessDesc,
  VALIDATION_ERROR_DESC,
} from '@mac/resources/general'
import {
  CREATED,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NO_CONTENT,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from '@mac/resources/http-status-codes'
import { createIdParamsOpenapiSchema } from '@mac/validators/general'

import { jsonContent, jsonContentRequired } from '@/lib/openapi/helpers'
import { createErrorSchema, createMessageObjectSchema } from '@/lib/openapi/schemas'
import { protect } from '@/middlewares'

const tags = ['Menu Item Variants']

export const entity = 'Menu Item Variant' as const
export const menuItemEntity = 'Menu Item' as const

export const entityNotFoundDesc = notFoundDesc(entity)
export const entityFailedToGetDesc = getDataFailedDesc(entity)
export const entityUpdateFailedDesc = updateFailedDesc(entity)
export const menuItemNotFoundDesc = notFoundDesc(menuItemEntity)

export const menuItemIdParamsSchema = createIdParamsOpenapiSchema(menuItemEntity)
export const variantIdParamsSchema = createIdParamsOpenapiSchema(entity)

export const getMenuItemVariants = createRoute({
  description: 'Get all variants for a menu item.',
  method: 'get',
  path: '/items/:menuItemId/variants',
  request: {
    params: menuItemIdParamsSchema,
  },
  responses: {
    [OK]: jsonContent(z.array(SelectMenuItemVariantSchema), getDataSuccessDesc(entity)),
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
  summary: 'Get Menu Item Variants',
  tags,
})

export const createMenuItemVariant = createRoute({
  description: 'Create a new variant for a menu item.',
  method: 'post',
  middleware: [protect],
  path: '/items/:menuItemId/variants',
  request: {
    body: jsonContentRequired(InsertMenuItemVariantSchema, createDataDesc(entity)),
    params: menuItemIdParamsSchema,
  },
  responses: {
    [CREATED]: jsonContent(z.array(SelectMenuItemVariantSchema), createDataSuccessDesc(entity)),
    [NOT_FOUND]: jsonContent(createMessageObjectSchema(menuItemNotFoundDesc), menuItemNotFoundDesc),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(InsertMenuItemVariantSchema),
      VALIDATION_ERROR_DESC
    ),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(createFailedDesc(entity)),
      createFailedDesc(entity)
    ),
    [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
    [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
  },
  summary: 'Create Menu Item Variant',
  tags,
})

export const updateMenuItemVariant = createRoute({
  description: 'Update a variant by ID.',
  method: 'put',
  middleware: [protect],
  path: '/variants/:variantId',
  request: {
    body: jsonContentRequired(UpdateMenuItemVariantSchema, updateDataDesc(entity)),
    params: variantIdParamsSchema,
  },
  responses: {
    [OK]: jsonContent(z.array(SelectMenuItemVariantSchema), updateSuccessDesc(entity)),
    [NOT_FOUND]: jsonContent(createMessageObjectSchema(entityNotFoundDesc), entityNotFoundDesc),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(UpdateMenuItemVariantSchema),
      VALIDATION_ERROR_DESC
    ),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(entityUpdateFailedDesc),
      entityUpdateFailedDesc
    ),
    [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
    [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
  },
  summary: 'Update Menu Item Variant',
  tags,
})

export const deleteMenuItemVariant = createRoute({
  description: 'Delete a variant by ID.',
  method: 'delete',
  middleware: [protect],
  path: '/variants/:variantId',
  request: {
    params: variantIdParamsSchema,
  },
  responses: {
    [NO_CONTENT]: {
      description: deleteSuccessDesc(entity),
    },
    [NOT_FOUND]: jsonContent(createMessageObjectSchema(entityNotFoundDesc), entityNotFoundDesc),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(variantIdParamsSchema),
      VALIDATION_ERROR_DESC
    ),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(deleteFailedDesc(entity)),
      deleteFailedDesc(entity)
    ),
    [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
    [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
  },
  summary: 'Delete Menu Item Variant',
  tags,
})
