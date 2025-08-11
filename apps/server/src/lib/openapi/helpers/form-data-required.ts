import type { z } from '@hono/zod-openapi'

function formData<T extends z.ZodType<unknown>>(schema: T, description: string) {
  return {
    content: {
      'multipart/form-data': {
        schema,
      },
    },
    description,
    required: true,
  }
}

export default formData
