import { createRoute } from '@hono/zod-openapi'
import {
  createDataDesc,
  createDataSuccessDesc,
  createFailedDesc,
  deleteFailedDesc,
  deleteSuccessDesc,
  duplicateDataDesc,
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
import { createIdParamsOpenapiSchema } from '@mac/validators/general'
import {
  createMenuItemValidator,
  menuItemFiltersValidator,
  readMenuItemsValidator,
  readMenuItemValidator,
  updateMenuItemValidator,
} from '@mac/validators/menu-item'

import { jsonContent, jsonContentRequired } from '@/lib/openapi/helpers'
import { createErrorSchema, createMessageObjectSchema } from '@/lib/openapi/schemas'
import { isAdmin, protect } from '@/middlewares'

const tags = ['Menu Items']

export const entity = 'Menu Item' as const

const menuItemIdParamsSchema = createIdParamsOpenapiSchema(entity)

const entityDuplicateDataDesc = duplicateDataDesc(entity)
const entityNotFoundDesc = notFoundDesc(entity)

export const entityFailedToGetDesc = getDataFailedDesc(entity)
export const entityUpdateFailedDesc = updateFailedDesc(entity)
export const entityCreateFailedDesc = createFailedDesc(entity)
export const entityDeleteFailedDesc = deleteFailedDesc(entity)

export const getMenuItems = createRoute({
  description: 'Get all menu items with filtering, search, and pagination.',
  method: 'get',
  path: '/',
  request: {
    query: menuItemFiltersValidator,
  },
  responses: {
    [OK]: jsonContent(readMenuItemsValidator, getDataSuccessDesc(entity)),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(menuItemFiltersValidator),
      VALIDATION_ERROR_DESC
    ),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(entityFailedToGetDesc),
      entityFailedToGetDesc
    ),
  },
  summary: 'Get Menu Items',
  tags,
})

export const getMenuItemById = createRoute({
  description: 'Get a menu item by ID.',
  method: 'get',
  path: '/:id',
  request: {
    params: menuItemIdParamsSchema,
  },
  responses: {
    [OK]: jsonContent(readMenuItemValidator, getDataSuccessDesc(entity)),
    [NOT_FOUND]: jsonContent(createMessageObjectSchema(entityNotFoundDesc), entityNotFoundDesc),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(menuItemIdParamsSchema),
      invalidIdDesc(entity)
    ),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(entityFailedToGetDesc),
      entityFailedToGetDesc
    ),
  },
  summary: 'Get Menu Item by ID',
  tags,
})

export const createMenuItem = createRoute({
  description: 'Create a new menu item.',
  method: 'post',
  middleware: [protect, isAdmin],
  path: '/',
  request: {
    body: jsonContentRequired(createMenuItemValidator, createDataDesc(entity)),
  },
  responses: {
    [CREATED]: jsonContent(readMenuItemValidator, createDataSuccessDesc(entity)),
    [CONFLICT]: jsonContent(
      createMessageObjectSchema(entityDuplicateDataDesc),
      entityDuplicateDataDesc
    ),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(createMenuItemValidator),
      VALIDATION_ERROR_DESC
    ),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(entityCreateFailedDesc),
      entityCreateFailedDesc
    ),
    [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
    [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
  },
  summary: 'Create Menu Item',
  tags,
})

export const updateMenuItem = createRoute({
  description: 'Update a menu item by ID.',
  method: 'post',
  middleware: [protect, isAdmin],
  path: '/:id',
  request: {
    body: jsonContentRequired(updateMenuItemValidator, updateDataDesc(entity)),
    params: menuItemIdParamsSchema,
  },
  responses: {
    [OK]: jsonContent(readMenuItemValidator, updateSuccessDesc(entity)),
    [CONFLICT]: jsonContent(
      createMessageObjectSchema(entityDuplicateDataDesc),
      entityDuplicateDataDesc
    ),
    [NOT_FOUND]: jsonContent(createMessageObjectSchema(entityNotFoundDesc), entityNotFoundDesc),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(updateMenuItemValidator),
      VALIDATION_ERROR_DESC
    ),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(entityUpdateFailedDesc),
      entityUpdateFailedDesc
    ),
    [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
    [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
  },
  summary: 'Update Menu Item',
  tags,
})

export const deleteMenuItem = createRoute({
  description: 'Delete a menu item by ID.',
  method: 'delete',
  middleware: [protect, isAdmin],
  path: '/:id',
  request: {
    params: menuItemIdParamsSchema,
  },
  responses: {
    [NO_CONTENT]: {
      description: deleteSuccessDesc(entity),
    },
    [NOT_FOUND]: jsonContent(createMessageObjectSchema(entityNotFoundDesc), entityNotFoundDesc),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(menuItemIdParamsSchema),
      invalidIdDesc(entity)
    ),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(entityDeleteFailedDesc),
      entityDeleteFailedDesc
    ),
    [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
    [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
  },
  summary: 'Delete Menu Item',
  tags,
})
