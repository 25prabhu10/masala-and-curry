import type { APIRoutes } from '@mac/server/routes'
import { hc } from 'hono/client'

const client = hc<APIRoutes>('')

function hcWithType(...args: Parameters<typeof hc>): Client {
  return hc<APIRoutes>(...args)
}

export type Client = typeof client
export default hcWithType

export type { APIErrorResponse } from '@mac/server/types'
