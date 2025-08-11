import type { z } from '@hono/zod-openapi'

function imageContentType<T extends z.ZodType<unknown>>(schema: T, description: string) {
  return {
    content: {
      'application/octet-stream': { schema },
    },
    description,
  }
}

export default imageContentType
