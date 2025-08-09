import { DrizzleQueryError } from '@mac/db/types'
import { HTTPException } from 'hono/http-exception'

import { formatDBError } from './response-helpers'

export function handleApiError(error: unknown, entity: string): void {
  if (error instanceof HTTPException) {
    throw error
  } else if (error instanceof DrizzleQueryError) {
    const formattedError = formatDBError(error, entity)

    if (formattedError !== undefined) {
      throw new HTTPException(formattedError.status, { message: formattedError.message })
    }
  }
}
