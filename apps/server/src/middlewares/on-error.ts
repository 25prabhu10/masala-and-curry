import type { ErrorHandler } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { INTERNAL_SERVER_ERROR, OK } from '@/lib/constants/http-status-codes'

const onError: ErrorHandler = (err, c) => {
  const currentStatus = 'status' in err ? err.status : c.newResponse(null).status
  const statusCode =
    currentStatus !== OK ? (currentStatus as ContentfulStatusCode) : INTERNAL_SERVER_ERROR
  const env = c.env?.NODE_ENV || process.env?.NODE_ENV

  if (err.name === 'LibsqlError') {
    err.message = env === 'production' ? '' : err.message
  }

  console.error(err)

  return c.json(
    {
      message: err.message || 'Could not complete the request, try again later',
      stack: env === 'production' ? undefined : err.stack,
    },
    statusCode
  )
}

export default onError
