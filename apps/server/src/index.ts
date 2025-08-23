import { env } from 'cloudflare:workers'
import { showRoutes } from 'hono/dev'

import app from './app'

// TODO: Remove this in production
showRoutes(
  app,
  env.ENVIRONMENT === 'development'
    ? {
        verbose: true,
      }
    : {}
)

export default app
