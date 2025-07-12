import { Scalar } from '@scalar/hono-api-reference'
import packageJSON from '@/../package.json' with { type: 'json' }
import { auth } from '@/lib/auth'
import { BASE_PATH, OPEN_API_SCHEMA_FILE } from '@/lib/constants'
import { appResources } from '@/resources/en'
import app from '@/routes'

app.on(['POST', 'GET'], '/auth/**', async (c) => (await auth(c.env)).handler(c.req.raw))

app
  .doc31(`/${OPEN_API_SCHEMA_FILE}`, (c) => {
    console.log(`Generating OpenAPI schema for ${new URL(c.req.url).origin}`)
    return {
      openapi: '3.1.1',
      info: {
        version: packageJSON.version,
        title: appResources.en.TITLE,
        description: packageJSON.description,
      },
      servers: [
        {
          url: new URL(c.req.url).origin,
          description: c.req.url, //appResources.en.API_SERVER_DESCRIPTION,
        },
      ],
    }
  })
  .get(
    '/reference',
    Scalar({
      url: `${BASE_PATH}/${OPEN_API_SCHEMA_FILE}`,
      layout: 'classic',
      defaultHttpClient: {
        targetKey: 'js',
        clientKey: 'fetch',
      },
      theme: 'kepler',
    })
  )

export default app
