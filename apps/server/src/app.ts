import { API_SERVER_DESCRIPTION, TITLE } from '@mac/resources/app'
import { Scalar } from '@scalar/hono-api-reference'
import packageJSON from '@/../package.json' with { type: 'json' }
import { authClient } from '@/lib/auth'
import { BASE_PATH, OPEN_API_SCHEMA_FILE } from '@/lib/constants'
import app from '@/routes'

app.on(['POST', 'GET'], '/auth/**', async (c) => (await authClient(c.env)).handler(c.req.raw))

app
  .doc31(`/${OPEN_API_SCHEMA_FILE}`, (c) => {
    return {
      openapi: '3.1.1',
      info: {
        version: packageJSON.version,
        title: TITLE,
        description: packageJSON.description,
      },
      servers: [
        {
          url: `${new URL(c.req.url).origin}`,
          description: API_SERVER_DESCRIPTION,
        },
      ],
      // TODO: add tags
    }
  })
  .get(
    '/reference',
    Scalar({
      url: `${BASE_PATH}/${OPEN_API_SCHEMA_FILE}`,
      // proxyUrl: '',
      pageTitle: TITLE,
      defaultHttpClient: {
        targetKey: 'js',
        clientKey: 'fetch',
      },
      theme: 'kepler',
    })
  )

export default app
