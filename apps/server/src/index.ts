import { showRoutes } from 'hono/dev'

import app from './app'

// TODO: Remove this in production
showRoutes(app, {
  verbose: true,
})

export default app
