import { NOT_AUTHORIZED } from '@mac/resources/general'
import { FORBIDDEN } from '@mac/resources/http-status-codes'
import { createMiddleware } from 'hono/factory'

import type { AppOpenAPI } from '@/lib/create-router'

export const isAdmin = createMiddleware<AppOpenAPI>(async (c, next) => {
  // Check if the user is an admin
  if (!c.var.user?.role?.includes('admin')) {
    return c.json(
      {
        message: NOT_AUTHORIZED,
      },
      FORBIDDEN
    )
  }

  // Continue to the next middleware/handler
  await next()
})
