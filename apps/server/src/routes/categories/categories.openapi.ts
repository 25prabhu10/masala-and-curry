import { createRoute, z } from '@hono/zod-openapi'
import { CATEGORY_ALREADY_EXISTS } from '@mac/resources/category'
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
  UPDATE_NO_CHANGES,
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
import {
  createCategoryValidator,
  readCategoryValidator,
  updateCategoryValidator,
} from '@mac/validators/category'

import { jsonContent, jsonContentRequired } from '@/lib/openapi/helpers'
import {
  createErrorSchema,
  createIdParamsOpenapiSchema,
  createMessageObjectSchema,
  paginationSchema,
} from '@/lib/openapi/schemas'
import { isAdmin, protect } from '@/middlewares'

const tags = ['Categories']

export const entity = 'Category' as const

export const entityNotFoundDesc = notFoundDesc(entity)
export const entityFailedToGetDesc = getDataFailedDesc(entity)
export const entityUpdateFailedDesc = updateFailedDesc(entity)

export const categoryIdParamsSchema = createIdParamsOpenapiSchema(entity)

export const getCategories = createRoute({
  description: 'Get all menu categories with optional pagination.',
  method: 'get',
  path: '/',
  request: {
    query: paginationSchema,
  },
  responses: {
    [OK]: jsonContent(z.array(readCategoryValidator), getDataSuccessDesc(entity)),
    [UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(paginationSchema), VALIDATION_ERROR_DESC),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(entityFailedToGetDesc),
      entityFailedToGetDesc
    ),
  },
  summary: 'Get Categories',
  tags,
})

export const getCategoryById = createRoute({
  description: 'Get a category by ID.',
  method: 'get',
  path: '/:id',
  request: {
    params: categoryIdParamsSchema,
  },
  responses: {
    [OK]: jsonContent(readCategoryValidator, getDataSuccessDesc(entity)),
    [NOT_FOUND]: jsonContent(createMessageObjectSchema(entityNotFoundDesc), entityNotFoundDesc),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(categoryIdParamsSchema),
      invalidIdDesc(entity)
    ),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(entityFailedToGetDesc),
      entityFailedToGetDesc
    ),
  },
  summary: 'Get Category by ID',
  tags,
})

export const createCategory = createRoute({
  description: 'Create a new menu category.',
  method: 'post',
  middleware: [protect, isAdmin],
  path: '/',
  request: {
    body: jsonContentRequired(createCategoryValidator, createDataDesc(entity)),
  },
  responses: {
    [CREATED]: jsonContent(readCategoryValidator, createDataSuccessDesc(entity)),
    [CONFLICT]: jsonContent(
      createMessageObjectSchema(CATEGORY_ALREADY_EXISTS),
      CATEGORY_ALREADY_EXISTS
    ),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(createCategoryValidator),
      VALIDATION_ERROR_DESC
    ),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(createFailedDesc(entity)),
      createFailedDesc(entity)
    ),
    [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
    [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
  },
  summary: 'Create Category',
  tags,
})

export const updateCategory = createRoute({
  description: 'Update a category by ID.',
  method: 'post',
  middleware: [protect, isAdmin],
  path: '/:id',
  request: {
    body: jsonContentRequired(updateCategoryValidator, updateDataDesc(entity)),
    params: categoryIdParamsSchema,
  },
  responses: {
    [OK]: jsonContent(
      readCategoryValidator.or(createMessageObjectSchema(UPDATE_NO_CHANGES)),
      updateSuccessDesc(entity)
    ),
    [CONFLICT]: jsonContent(
      createMessageObjectSchema(CATEGORY_ALREADY_EXISTS),
      CATEGORY_ALREADY_EXISTS
    ),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(updateCategoryValidator),
      VALIDATION_ERROR_DESC
    ),
    [NOT_FOUND]: jsonContent(createMessageObjectSchema(entityNotFoundDesc), entityNotFoundDesc),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(entityUpdateFailedDesc),
      entityUpdateFailedDesc
    ),
    [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
    [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
  },
  summary: 'Update Category',
  tags,
})

export const deleteCategory = createRoute({
  description: 'Delete a category by ID.',
  method: 'delete',
  middleware: [protect, isAdmin],
  path: '/:id',
  request: {
    params: categoryIdParamsSchema,
  },
  responses: {
    [NO_CONTENT]: {
      description: deleteSuccessDesc(entity),
    },
    [NOT_FOUND]: jsonContent(createMessageObjectSchema(entityNotFoundDesc), entityNotFoundDesc),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(categoryIdParamsSchema),
      VALIDATION_ERROR_DESC
    ),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(deleteFailedDesc(entity)),
      deleteFailedDesc(entity)
    ),
    [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
    [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
  },
  summary: 'Delete Category',
  tags,
})
