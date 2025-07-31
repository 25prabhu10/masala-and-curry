import { z } from '@hono/zod-openapi'
import { invalidIdDesc } from '@mac/resources/general'
import { USER_ID_PARAM } from '@mac/resources/user'

export function createIdParamsOpenapiSchema(entity: Readonly<string>) {
  return z
    .object({
      id: z
        .string(invalidIdDesc(entity))
        .trim()
        .openapi({
          description: USER_ID_PARAM,
          example: 'fbaefaadebc4a0b8b9c1d2e3f4g5h6i',
          param: {
            name: 'id',
          },
          required: ['id'],
        }),
    })
    .openapi({
      description: `${entity} ID parameter schema`,
    })
    .openapi(`${entity} ID`)
}

export type UserIdParams = z.input<ReturnType<typeof createIdParamsOpenapiSchema>>
