import { createRoute } from '@hono/zod-openapi'
import * as HttpStatusCodes from '@/lib/constants/http-status-codes'
import createRouter from '@/lib/create-router'
import { jsonContent } from '@/lib/openapi/helpers'
import { createMessageObjectSchema } from '@/lib/openapi/schemas'
import { appResources } from '@/resources/en'

const router = createRouter().openapi(
  createRoute({
    tags: ['Index'],
    method: 'get',
    path: '/',
    summary: 'Index',
    description: appResources.en.API_SERVER_DESCRIPTION,
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        createMessageObjectSchema(appResources.en.API_SERVER_DESCRIPTION),
        appResources.en.API_SERVER_DESCRIPTION
      ),
    },
  }),
  (c) =>
    c.json(
      {
        message: appResources.en.API_SERVER_DESCRIPTION,
      },
      HttpStatusCodes.OK
    )
)

export default router
