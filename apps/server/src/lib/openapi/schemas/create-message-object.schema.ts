import { z } from '@hono/zod-openapi'

function createMessageObjectSchema(exampleMessage: string = '42') {
  return z
    .object({
      message: z.string(),
    })
    .openapi({
      description: 'Generic message object',
      example: {
        message: exampleMessage,
      },
      required: ['message'],
    })
    .openapi('Message')
}

export default createMessageObjectSchema
