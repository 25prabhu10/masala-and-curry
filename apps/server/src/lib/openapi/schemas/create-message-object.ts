import { z } from '@hono/zod-openapi'

function createMessageObjectSchema(exampleMessage: string = '42') {
  return z
    .object({
      message: z.string(),
    })
    .openapi({
      description: 'Generic message object',
      required: ['message'],
      example: {
        message: exampleMessage,
      },
    })
    .openapi('Message')
}

export default createMessageObjectSchema
