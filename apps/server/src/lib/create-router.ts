import { OpenAPIHono } from '@hono/zod-openapi'

import type { Session, User } from './auth'
import defaultHook from './openapi/default-hook'

export type AppOpenAPI = {
  Bindings: CloudflareBindings
  Variables: {
    user: User | null
    session: Session | null
  }
}

export default function createRouter() {
  return new OpenAPIHono<AppOpenAPI>({
    defaultHook,
    strict: false,
  })
}
