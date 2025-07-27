import { createRoute } from '@hono/zod-openapi'
import {
  getDataFailedDesc,
  getDataSuccessDesc,
  notFoundDesc,
  UPDATE_NO_CHANGES,
  updateDataDesc,
  updateFailedDesc,
  updateSuccessDesc,
  VALIDATION_ERROR_DESC,
} from '@mac/resources/general'
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
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

const tags = ['Users']

export const entity: Readonly<string> = 'User'

export const getUserById = createRoute({
  description: 'Get a user by User ID.',
  method: 'get',
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
  },
  summary: 'Get User',
  tags,
})

export const updateUser = createRoute({
  description: 'Update a user by User ID.',
  method: 'post',
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
  },
  summary: 'Update User',
  tags,
})

export type UpdateUser = typeof updateUser
