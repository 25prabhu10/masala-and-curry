import { z } from '@hono/zod-openapi'
import { MAX_STRING_LENGTH, MIN_STRING_LENGTH } from '@mac/resources/constants'
import { USER_ID_PARAM } from '@mac/resources/user'

export const userIdParamsSchema = z
  .object({
    id: z
      .string()
      .min(MIN_STRING_LENGTH)
      .max(MAX_STRING_LENGTH)
      .openapi({
        description: USER_ID_PARAM,
        example: 'abc123',
        param: {
          name: 'id',
        },
        required: ['id'],
      }),
  })
  .openapi({
    description: 'User ID parameter schema',
  })
  .openapi('User ID')

export type UserIdParams = z.input<typeof userIdParamsSchema>
