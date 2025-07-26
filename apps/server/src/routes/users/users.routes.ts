import { createRoute } from '@hono/zod-openapi'
import { VALIDATION_ERROR_DESC } from '@mac/resources/general'
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  UNPROCESSABLE_ENTITY,
} from '@mac/resources/http-status-codes'
import {
  EMAIL_ALREADY_EXISTS,
  UPDATE_FAILED_DESC,
  UPDATE_NO_CHANGES,
  UPDATE_USER_DESC,
  UPDATE_USER_FAILED,
  UPDATE_USER_REQUEST_BODY_DESC,
  UPDATE_USER_SUCCESS_DESC,
  UPDATE_USER_SUMMARY,
  USER_NOT_FOUND,
} from '@mac/resources/user'
import { updateUserValidator, userIdParamsSchema } from '@mac/validators/user'

import { jsonContent, jsonContentRequired } from '@/lib/openapi/helpers'
import { createErrorSchema, createMessageObjectSchema } from '@/lib/openapi/schemas'

const tags = ['Users']

export const updateUser = createRoute({
  description: UPDATE_USER_DESC,
  method: 'post',
  path: '/users/:id',
  request: {
    body: jsonContentRequired(updateUserValidator, UPDATE_USER_REQUEST_BODY_DESC),
    params: userIdParamsSchema,
  },
  responses: {
    [OK]: jsonContent(
      updateUserValidator.or(createMessageObjectSchema(UPDATE_NO_CHANGES)),
      UPDATE_USER_SUCCESS_DESC
    ),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(updateUserValidator),
      VALIDATION_ERROR_DESC
    ),
    [NOT_FOUND]: jsonContent(createMessageObjectSchema(USER_NOT_FOUND), USER_NOT_FOUND),
    [CONFLICT]: jsonContent(createMessageObjectSchema(EMAIL_ALREADY_EXISTS), EMAIL_ALREADY_EXISTS),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(UPDATE_USER_FAILED),
      UPDATE_FAILED_DESC
    ),
  },
  summary: UPDATE_USER_SUMMARY,
  tags,
})

export type UpdateUser = typeof updateUser
