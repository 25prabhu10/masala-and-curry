import { createRoute } from '@hono/zod-openapi'
import {
  createDataDesc,
  createDataSuccessDesc,
  createFailedDesc,
  deleteFailedDesc,
  deleteSuccessDesc,
  getDataFailedDesc,
  getDataSuccessDesc,
  invalidIdDesc,
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
import {
  createMenuItemVariantValidator,
  readMenuItemVariantsValidator,
  readMenuItemVariantValidator,
  updateMenuItemVariantValidator,
} from '@mac/validators/menu-item-variant'

import { jsonContent, jsonContentRequired } from '@/lib/openapi/helpers'
import { createErrorSchema, createMessageObjectSchema } from '@/lib/openapi/schemas'
import { isAdmin, protect } from '@/middlewares'
import { entity as menuItemEntity } from '@/routes/menu-items/menu-items.openapi'

const tags = ['Menu Item Variants']

export const entity = 'Menu Item Variant' as const

export const menuItemNotFoundDesc = notFoundDesc(menuItemEntity)

export const entityNotFoundDesc = notFoundDesc(entity)
export const entityFailedToGetDesc = getDataFailedDesc(entity)
export const entityUpdateFailedDesc = updateFailedDesc(entity)
export const entityCreateFailedDesc = createFailedDesc(entity)
export const entityDeleteFailedDesc = deleteFailedDesc(entity)

export const menuItemIdParamsSchema = createIdParamsOpenapiSchema(menuItemEntity)
export const variantIdParamsSchema = createIdParamsOpenapiSchema(entity)

export const getMenuItemVariants = createRoute({
  description: 'Get all variants for a menu item.',
  method: 'get',
  path: '/:id/variants',
  request: {
    params: menuItemIdParamsSchema,
  },
  responses: {
    [OK]: jsonContent(readMenuItemVariantsValidator, getDataSuccessDesc(entity)),
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
  middleware: [protect, isAdmin],
  path: '/:id/variants',
  request: {
    body: jsonContentRequired(createMenuItemVariantValidator, createDataDesc(entity)),
    params: menuItemIdParamsSchema,
  },
  responses: {
    [CREATED]: jsonContent(readMenuItemVariantValidator, createDataSuccessDesc(entity)),
    [NOT_FOUND]: jsonContent(createMessageObjectSchema(menuItemNotFoundDesc), menuItemNotFoundDesc),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(createMenuItemVariantValidator),
      VALIDATION_ERROR_DESC
    ),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(entityCreateFailedDesc),
      entityCreateFailedDesc
    ),
    [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
    [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
  },
  summary: 'Create Menu Item Variant',
  tags,
})

export const updateMenuItemVariant = createRoute({
  description: 'Update a variant by ID.',
  method: 'post',
  middleware: [protect, isAdmin],
  path: '/variants/:id',
  request: {
    body: jsonContentRequired(updateMenuItemVariantValidator, updateDataDesc(entity)),
    params: variantIdParamsSchema,
  },
  responses: {
    [OK]: jsonContent(readMenuItemVariantValidator, updateSuccessDesc(entity)),
    [NOT_FOUND]: jsonContent(createMessageObjectSchema(entityNotFoundDesc), entityNotFoundDesc),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(updateMenuItemVariantValidator),
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
  middleware: [protect, isAdmin],
  path: '/variants/:id',
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
      invalidIdDesc(entity)
    ),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(entityDeleteFailedDesc),
      entityDeleteFailedDesc
    ),
    [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
    [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
  },
  summary: 'Delete Menu Item Variant',
  tags,
})
