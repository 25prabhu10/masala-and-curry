import { createRoute } from '@hono/zod-openapi'
import { API_SERVER_DESCRIPTION } from '@mac/resources/app'
import * as HttpStatusCodes from '@mac/resources/http-status-codes'
import createRouter from '@/lib/create-router'
import { jsonContent } from '@/lib/openapi/helpers'
import { createMessageObjectSchema } from '@/lib/openapi/schemas'

const router = createRouter().openapi(
  createRoute({
    tags: ['Index'],
    method: 'get',
    path: '/',
    summary: 'API Server',
    description: API_SERVER_DESCRIPTION,
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        createMessageObjectSchema(API_SERVER_DESCRIPTION),
        API_SERVER_DESCRIPTION
      ),
    },
  }),
  (c) =>
    c.json(
      {
        message: API_SERVER_DESCRIPTION,
      },
      HttpStatusCodes.OK
    )
)

export default router
