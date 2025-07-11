import type { APIRoutes } from '@mac/server/routes'
import { hc } from 'hono/client'

const client = hc<APIRoutes>('http://localhost:5173/')

function hcWithType(...args: Parameters<typeof hc>): Client {
  return hc<APIRoutes>(...args)
}

export type Client = typeof client
export default hcWithType
