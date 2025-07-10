import { requestId } from 'hono/request-id'
// import { secureHeaders } from 'hono/secure-headers'
import { notFound, onError, serveEmojiFavicon } from '@/middlewares'
import { BASE_PATH } from './constants'
import createRouter from './create-router'

export default function createApp() {
  const app = createRouter().basePath(BASE_PATH)

  // TODO: add secure headers and auth middleware
  app
    // .use('*', async (c, next) => {
    //   c.set('authConfig', createAuthConfig(c.env))
    //   return next()
    // })
    // .use('/auth/*', authHandler())
    // .use(`${BASE_PATH}/*`, cors())
    // .use(secureHeaders())
    .use(requestId())
    .use(serveEmojiFavicon('🍴'))
    .notFound(notFound)
    .onError(onError)

  return app
}
