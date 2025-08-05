import { notFound, onError } from '@/middlewares'

import { BASE_PATH } from './constants'
import createRouter from './create-router'

export default function createApp() {
  const app = createRouter()

  // TODO: add secure headers and auth middleware
  app
    // .use('/auth/*', authHandler())
    // .use(`${BASE_PATH}/*`, cors())
    // .use(secureHeaders())
    .use('*', (c, next) => {
      if (c.req.path.startsWith(BASE_PATH)) {
        return next()
      }
      // SPA redirect to /index.html
      const requestUrl = new URL(c.req.raw.url)
      return c.env.ASSETS.fetch(new URL('/index.html', requestUrl.origin))
    })
    .notFound(notFound)
    .onError(onError)

  return app.basePath(BASE_PATH)
}
