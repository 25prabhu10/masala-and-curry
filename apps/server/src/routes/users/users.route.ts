import { createRoute } from '@hono/zod-openapi'
import {
  getDataFailedDesc,
  getDataSuccessDesc,
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
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from '@mac/resources/http-status-codes'
import { EMAIL_ALREADY_EXISTS, INVALID_USER_ID } from '@mac/resources/user'
import { readUserValidator, updateUserValidator } from '@mac/validators/user'

import { jsonContent, jsonContentRequired } from '@/lib/openapi/helpers'
import {
  createErrorSchema,
  createMessageObjectSchema,
  userIdParamsSchema,
} from '@/lib/openapi/schemas'
import { protect } from '@/middlewares'

const tags = ['Users']

export const entity: Readonly<string> = 'User'

export const getUserById = createRoute({
  description: 'Get a user by User ID.',
  method: 'get',
  middleware: protect,
  path: '/:id',
  request: {
    params: userIdParamsSchema,
  },
  responses: {
    [OK]: jsonContent(readUserValidator, getDataSuccessDesc(entity)),
    [NOT_FOUND]: jsonContent(createMessageObjectSchema(notFoundDesc(entity)), notFoundDesc(entity)),
    [UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(userIdParamsSchema), INVALID_USER_ID),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(getDataFailedDesc(entity)),
      getDataFailedDesc(entity)
    ),
    [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
    [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
  },
  summary: 'Get User',
  tags,
})

export const updateUser = createRoute({
  description: 'Update a user by User ID.',
  method: 'post',
  middleware: protect,
  path: '/:id',
  request: {
    body: jsonContentRequired(updateUserValidator, updateDataDesc(entity)),
    params: userIdParamsSchema,
  },
  responses: {
    [OK]: jsonContent(
      updateUserValidator.or(createMessageObjectSchema(UPDATE_NO_CHANGES)),
      updateSuccessDesc(entity)
    ),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(updateUserValidator),
      VALIDATION_ERROR_DESC
    ),
    [NOT_FOUND]: jsonContent(createMessageObjectSchema(notFoundDesc(entity)), notFoundDesc(entity)),
    [CONFLICT]: jsonContent(createMessageObjectSchema(EMAIL_ALREADY_EXISTS), EMAIL_ALREADY_EXISTS),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(updateFailedDesc(entity)),
      updateFailedDesc(entity)
    ),
    [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
    [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
  },
  summary: 'Update User',
  tags,
})
