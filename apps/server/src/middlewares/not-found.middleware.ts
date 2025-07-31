import { NOT_FOUND } from '@mac/resources/http-status-codes'
import { NOT_FOUND as NOT_FOUND_MESSAGE } from '@mac/resources/http-status-phrases'
import type { NotFoundHandler } from 'hono'

const notFound: NotFoundHandler = (c) =>
  c.json(
    {
      message: NOT_FOUND_MESSAGE,
    },
    NOT_FOUND
  )

export default notFound
