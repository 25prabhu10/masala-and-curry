import { createRoute, z } from '@hono/zod-openapi'
import {
  getDataFailedDesc,
  NOT_AUTHENTICATED,
  NOT_AUTHORIZED,
  notFoundDesc,
  uploadFileDesc,
  uploadFileFailedDesc,
  uploadFileSuccessDesc,
  VALIDATION_ERROR_DESC,
} from '@mac/resources/general'
import {
  CREATED,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from '@mac/resources/http-status-codes'
import { imageKeyValidator, imageURLValidator, uploadImageSchemaAPI } from '@mac/validators/image'

import { formData, imageContentType, jsonContent } from '@/lib/openapi/helpers'
import { createErrorSchema, createMessageObjectSchema } from '@/lib/openapi/schemas'

const tags = ['Images']

export const entity = 'Image' as const

const entityNotFoundDesc = notFoundDesc(entity)
export const entityFailedToGetDesc = getDataFailedDesc(entity)
export const entityCreateFailedDesc = uploadFileFailedDesc(entity)

export const uploadImage = createRoute({
  description: 'Upload an image',
  method: 'put',
  path: '/',
  request: {
    body: formData(uploadImageSchemaAPI, uploadFileDesc(entity)),
  },
  responses: {
    [CREATED]: jsonContent(imageURLValidator, uploadFileSuccessDesc(entity)),
    [UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(z.file()), VALIDATION_ERROR_DESC),
    [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
    [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(entityCreateFailedDesc),
      entityCreateFailedDesc
    ),
  },
  tags,
})

export const getImage = createRoute({
  description: 'Get an image',
  method: 'get',
  path: '/:key/:filename',
  request: {
    params: imageKeyValidator,
  },
  responses: {
    [OK]: imageContentType(uploadImageSchemaAPI.shape.file, uploadFileSuccessDesc(entity)),
    [NOT_FOUND]: jsonContent(createMessageObjectSchema(entityNotFoundDesc), entityNotFoundDesc),
    [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
    [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(entityCreateFailedDesc),
      entityCreateFailedDesc
    ),
  },
  tags,
})
