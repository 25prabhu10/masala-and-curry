import { OpenAPIHono } from '@hono/zod-openapi'
import defaultHook from './openapi/default-hook'

export default function createRouter() {
  return new OpenAPIHono<{ Bindings: CloudflareBindings }>({
    strict: false,
    defaultHook,
  })
}
