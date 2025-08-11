import { createRoute, z } from '@hono/zod-openapi'
import {
  createDataDesc,
  createDataSuccessDesc,
  createFailedDesc,
  NOT_AUTHENTICATED,
  NOT_AUTHORIZED,
  VALIDATION_ERROR_DESC,
} from '@mac/resources/general'
import {
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  OK,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from '@mac/resources/http-status-codes'

import { jsonContent, jsonContentRequired } from '@/lib/openapi/helpers'
import { createErrorSchema, createMessageObjectSchema } from '@/lib/openapi/schemas'
import { isAdmin, protect } from '@/middlewares'

export const entity = 'Image Upload'
export const entityCreateFailedDesc = createFailedDesc(entity)

export const allowedContentTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const

export const presignUploadBody = z
  .object({
    contentLength: z
      .number()
      .int()
      .positive()
      .max(5 * 1024 * 1024)
      .openapi({
        description: 'File size in bytes (max 5MB)',
        example: 1024,
      }),
    contentType: z.enum(allowedContentTypes).openapi({
      description: 'MIME type of the image',
      example: 'image/jpeg',
    }),
    folder: z
      .enum(['menu-items'])
      .default('menu-items')
      .openapi({ description: 'Target folder prefix for storage', example: 'menu-items' }),
  })
  .openapi('PresignUploadBody')

export const presignUploadResponse = z
  .object({
    expiresInSeconds: z.number().int().positive().openapi({ example: 300 }),
    imageKey: z.string().openapi({ example: 'menu-items/abcd123/image' }),
    originalExt: z.enum(['jpg', 'png', 'webp', 'avif']),
    originalKey: z.string().openapi({ example: 'menu-items/abcd123/image.original.jpg' }),
    requiredHeaders: z
      .object({
        'content-length': z.string().openapi({ example: '1024' }),
        'content-type': z.string().openapi({ example: 'image/jpeg' }),
      })
      .openapi({ description: 'Headers to include with the PUT request' }),
    uploadUrl: z.string().url().openapi({ description: 'Presigned PUT URL' }),
  })
  .openapi('PresignUploadResponse')

export const presignImageUpload = createRoute({
  description: 'Get a short-lived presigned PUT URL to upload an image directly to R2. Admin only.',
  method: 'post',
  middleware: [protect, isAdmin],
  path: '/images/presign',
  request: {
    body: jsonContentRequired(presignUploadBody, createDataDesc(entity)),
  },
  responses: {
    [OK]: jsonContent(presignUploadResponse, createDataSuccessDesc(entity)),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(presignUploadBody),
      VALIDATION_ERROR_DESC
    ),
    [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
    [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(entityCreateFailedDesc),
      entityCreateFailedDesc
    ),
  },
  summary: 'Presign Image Upload',
  tags: ['Uploads'],
})
