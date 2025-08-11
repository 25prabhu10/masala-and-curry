import { CREATED, OK } from '@mac/resources/http-status-codes'

import { InternalServerError } from '@/lib/api-errors'
import createRouter from '@/lib/create-router'
import { handleApiError } from '@/lib/handle-errors'
import { notFound } from '@/lib/response-helpers'
import { generateImageFileKey, getKeyFromImageFilePath } from '@/lib/utils'

import * as routes from './images.openapi'

const router = createRouter()
  .openapi(routes.uploadImage, async (c) => {
    const { file } = c.req.valid('form')

    try {
      const typedFile = file as Blob & { name: string }
      const key = generateImageFileKey(typedFile.name, typedFile.type)
      const result = await c.env.mac_bucket.put(key, typedFile)

      if (!result) {
        throw new InternalServerError(routes.entityCreateFailedDesc)
      }

      return c.json({ url: result.key }, CREATED)
    } catch (error) {
      handleApiError(error, routes.entity)
      throw new InternalServerError(routes.entityCreateFailedDesc)
    }
  })
  .openapi(routes.getImage, async (c) => {
    const { key, filename } = c.req.valid('param')

    try {
      const obj = await c.env.mac_bucket.get(getKeyFromImageFilePath(key, filename))

      if (!obj) {
        return c.json(...notFound(routes.entity))
      }

      const headers = new Headers()
      obj.writeHttpMetadata(headers)
      headers.set('etag', obj.httpEtag)
      return new Response(obj.body, {
        headers,
        status: OK,
      })
    } catch (error) {
      handleApiError(error, routes.entity)
      throw new InternalServerError(routes.entityFailedToGetDesc)
    }
  })
// Serve raw original by key under /raw/{key}
//   .get('/raw/*', async (c) => {
//     const key = c.req.param('0') ?? ''
//     const obj = await c.env.mac_bucket.get(key)
//     if (!obj) {
//       return c.json({ message: 'Not Found' }, NOT_FOUND)
//     }
//     const body = await obj.arrayBuffer()
//     return new Response(body, {
//       headers: {
//         'Cache-Control': 'public, max-age=31536000, immutable',
//         'Content-Type': obj.httpMetadata?.contentType || getContentType(key),
//       },
//       status: OK,
//     })
//   })
//   // Serve any image asset by key under /{key}
//   .get('/*', async (c) => {
//     const key = c.req.param('0') ?? ''
//     const obj = await c.env.mac_bucket.get(key)
//     if (!obj) {
//       return c.json({ message: 'Not Found' }, NOT_FOUND)
//     }
//     const body = await obj.arrayBuffer()
//     return new Response(body, {
//       headers: {
//         'Cache-Control': 'public, max-age=31536000, immutable',
//         'Content-Type': obj.httpMetadata?.contentType || getContentType(key),
//       },
//       status: OK,
//     })
//   })

export default router
