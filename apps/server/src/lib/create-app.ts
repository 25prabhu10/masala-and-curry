import { env } from 'cloudflare:workers'
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'
import { requestId } from 'hono/request-id'
import { secureHeaders } from 'hono/secure-headers'

import { notFound, onError } from '@/middlewares'

import { BASE_PATH } from './constants'
import createRouter from './create-router'

// oxlint-disable-next-line explicit-module-boundary-types
export default function createApp() {
  const app = createRouter()

  app.use(requestId()).use('*', (c, next) => {
    if (c.req.path.startsWith(BASE_PATH)) {
      return next()
    }
    // SPA redirect to /index.html
    const requestUrl = new URL(c.req.raw.url)
    return c.env.ASSETS.fetch(new URL('/index.html', requestUrl.origin))
  })

  if (env.ENVIRONMENT !== 'development') {
    app
      .use(
        secureHeaders({
          contentSecurityPolicy: {
            baseUri: ["'self'"],
            childSrc: ["'self'"],
            connectSrc: ["'self'"],
            defaultSrc: ["'self'"],
            fontSrc: ["'self'", 'https:', 'data:'],
            formAction: ["'self'"],
            frameAncestors: ["'self'"],
            frameSrc: ["'self'"],
            imgSrc: ["'self'", 'data:'],
            manifestSrc: ["'self'"],
            mediaSrc: ["'self'"],
            objectSrc: ["'none'"],
            reportTo: 'endpoint-1',
            sandbox: ['allow-same-origin', 'allow-scripts'],
            scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
            scriptSrcAttr: ["'none'"],
            scriptSrcElem: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
            styleSrcAttr: ["'none'"],
            styleSrcElem: ["'self'", 'https:', "'unsafe-inline'"],
            upgradeInsecureRequests: [],
            workerSrc: ["'self'"],
          },
          crossOriginEmbedderPolicy: true,
        })
      )
      .use(
        cors({
          allowMethods: ['POST'],
          credentials: true,
          exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
          maxAge: 600,
          origin: env.URL,
        })
      )
      .use(csrf({ origin: env.URL }))
  }

  app.notFound(notFound).onError(onError)

  return app.basePath(BASE_PATH)
}
