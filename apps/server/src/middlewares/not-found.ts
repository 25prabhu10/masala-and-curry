import type { NotFoundHandler } from 'hono'
import { NOT_FOUND } from '@/lib/constants/http-status-codes'
import { NOT_FOUND as NOT_FOUND_MESSAGE } from '@/lib/constants/http-status-phrases'

const notFound: NotFoundHandler = (c) =>
  c.json(
    {
      message: NOT_FOUND_MESSAGE,
    },
    NOT_FOUND
  )

export default notFound
