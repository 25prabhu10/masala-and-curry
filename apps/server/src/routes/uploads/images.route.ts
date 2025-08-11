import { INTERNAL_SERVER_ERROR, OK } from '@mac/resources/http-status-codes'

import createRouter from '@/lib/create-router'
import { handleApiError } from '@/lib/handle-errors'
import { generateR2PresignedPutUrl } from '@/routes/uploads/utils/r2-presign'

import * as routes from './images.presign.openapi'

const router = createRouter().openapi(routes.presignImageUpload, async (c) => {
  const { contentLength, contentType, folder } = c.req.valid('json')
  const expiresIn = 300 // 5 minutes

  try {
    const env = c.env as CloudflareBindings & {
      R2_ACCOUNT_ID: string
      R2_ACCESS_KEY_ID: string
      R2_SECRET_ACCESS_KEY: string
      R2_BUCKET_NAME: string
    }
    // derive extension from contentType
    const extRaw = contentType.split('/')[1] ?? 'jpg'
    const ext = (extRaw === 'jpeg' ? 'jpg' : extRaw) as 'jpg' | 'png' | 'webp' | 'avif'
    const id = crypto.randomUUID()
    const imageKey = `${folder}/${id}/image`
    const originalKey = `${imageKey}.original.${ext}`

    const { url, headers } = await generateR2PresignedPutUrl({
      accessKeyId: env.R2_ACCESS_KEY_ID,
      accountId: env.R2_ACCOUNT_ID,
      bucket: env.R2_BUCKET_NAME,
      contentLength,
      contentType,
      expiresIn,
      key: originalKey,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    })

    return c.json(
      {
        expiresInSeconds: expiresIn,
        imageKey,
        originalExt: ext,
        originalKey,
        requiredHeaders: headers,
        uploadUrl: url,
      },
      OK
    )
  } catch (error) {
    handleApiError(error, routes.entity)
    return c.json({ message: routes.entityCreateFailedDesc }, INTERNAL_SERVER_ERROR)
  }
})

export default router
