import { API_SERVER_DESCRIPTION, TITLE } from '@mac/resources/app'
import { Scalar } from '@scalar/hono-api-reference'

import packageJSON from '@/../package.json' with { type: 'json' }
import { BASE_PATH, OPEN_API_SCHEMA_FILE } from '@/lib/constants'
import app from '@/routes'

app.openAPIRegistry.registerComponent('securitySchemes', 'apiKeyCookie', {
  description: 'API Key authentication via cookie',
  in: 'cookie',
  name: 'apiKeyCookie',
  type: 'apiKey',
})

app.openAPIRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  description: 'Bearer token authentication',
  scheme: 'bearer',
  type: 'http',
})

app
  .doc31(`/${OPEN_API_SCHEMA_FILE}`, (c) => ({
    info: {
      description: packageJSON.description,
      title: TITLE,
      version: packageJSON.version,
    },
    openapi: '3.1.1',
    security: [
      {
        apiKeyCookie: [],
        bearerAuth: [],
      },
    ],
    servers: [
      {
        description: API_SERVER_DESCRIPTION,
        url: `${new URL(c.req.url).origin}`,
      },
    ],
    // TODO: add tags
  }))
  .get(
    '/reference',
    Scalar({
      defaultHttpClient: {
        clientKey: 'fetch',
        targetKey: 'js',
      },
      // proxyUrl: '',
      pageTitle: TITLE,
      theme: 'kepler',
      url: `${BASE_PATH}/${OPEN_API_SCHEMA_FILE}`,
    })
  )

export default app
