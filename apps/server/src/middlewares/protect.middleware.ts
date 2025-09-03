import { NOT_AUTHENTICATED } from '@mac/resources/general'
import { UNAUTHORIZED } from '@mac/resources/http-status-codes'
import { createMiddleware } from 'hono/factory'

import { auth } from '@/lib/auth'
import type { AppOpenAPI } from '@/lib/create-router'

// Middleware to protect routes from unauthorized access
export const protect = createMiddleware<AppOpenAPI>(async (c, next) => {
  // Extract the session from the incoming request headers
  const session = await auth.api.getSession({ headers: c.req.raw.headers })

  // If no valid session or user is found, return an unauthorized response
  if (!session || !session.user) {
    return c.json(
      {
        message: NOT_AUTHENTICATED,
      },
      UNAUTHORIZED
    )
  }

  c.set('user', session.user)
  c.set('session', session.session)

  // Continue to the next middleware/handler
  await next()
})
