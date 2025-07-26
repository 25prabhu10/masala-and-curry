import { z } from '@hono/zod-openapi'

import type { APIErrorResponse } from '@/lib/types'

export default function createErrorSchema<T extends z.ZodType<unknown>>(schema: T) {
  const { error } = schema.safeParse(schema.type === 'array' ? [] : {})

  const treeError = error
    ? (z.treeifyError(error) as APIErrorResponse)
    : ({
        errors: ['Validation failed'],
        properties: {
          field_name_example: {
            errors: ['Invalid input'],
          },
        },
      } as APIErrorResponse)

  console.log('Tree Error:', JSON.stringify(treeError, null, 2))

  return z
    .object({
      errors: z
        .array(z.string())
        .optional()
        .openapi({
          description: 'Top-level validation errors',
          example:
            treeError.errors && treeError.errors?.length > 0
              ? treeError.errors
              : ['Validation failed'],
        }),
      properties: z
        .record(
          z.string().openapi({
            description: 'Field name that caused the error',
            example: 'email',
          }),
          z
            .object({
              errors: z
                .array(z.string())
                .optional()
                .openapi({
                  description: 'Field-specific validation errors',
                  example: ['Field is required', 'Invalid format'],
                }),
              items: z
                .array(
                  z.union([
                    z.null(),
                    z.object({
                      errors: z
                        .array(z.string())
                        .optional()
                        .openapi({
                          description: 'Field-specific validation errors',
                          example: ['Field is required', 'Invalid format'],
                        }),
                    }),
                  ])
                )
                .optional()
                .openapi({
                  description:
                    'Errors for items within an array/tuple field (e.g., for `items[0]` or `items[1]`)',
                  example: [undefined, { errors: ['Item 1 must be a number'] }],
                }),
            })
            .openapi({
              description: 'Structure for errors pertaining to a specific field.',
            })
        )
        .optional()
        .openapi({
          description: 'Validation errors grouped by field name.',
          example: treeError.properties,
        }),
    })
    .openapi({
      description: 'Standard error response format',
    })
    .openapi('Error')
}
