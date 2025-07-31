import { z } from '@hono/zod-openapi'
import { DEFAULT_PAGE_SIZE, MAX_NUMBER_IN_APP } from '@mac/resources/constants'
import { PAGINATION_ERROR_DESC } from '@mac/resources/general'

export const paginationSchema = z.object({
  limit: z.coerce
    .number(PAGINATION_ERROR_DESC)
    .int(PAGINATION_ERROR_DESC)
    .positive(PAGINATION_ERROR_DESC)
    .max(MAX_NUMBER_IN_APP)
    .optional()
    .default(DEFAULT_PAGE_SIZE)
    .openapi({ description: 'Items per page', example: DEFAULT_PAGE_SIZE }),
  page: z.coerce
    .number(PAGINATION_ERROR_DESC)
    .int(PAGINATION_ERROR_DESC)
    .positive(PAGINATION_ERROR_DESC)
    .max(MAX_NUMBER_IN_APP)
    .optional()
    .default(1)
    .openapi({ description: 'Page number', example: 1 }),
})
