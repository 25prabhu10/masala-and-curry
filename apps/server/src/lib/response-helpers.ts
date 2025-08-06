import type { DrizzleQueryError } from '@mac/db/types'
import { duplicateDataDesc, notFoundDesc } from '@mac/resources/general'
import { CONFLICT, NOT_FOUND } from '@mac/resources/http-status-codes'

export function notFound(entity: string) {
  return [{ message: notFoundDesc(entity) }, NOT_FOUND] as const
}

type FormatDBErrorMessage = {
  message: string
  status: typeof CONFLICT
}

export function formatDBError(
  error: DrizzleQueryError,
  entity: string
): FormatDBErrorMessage | undefined {
  if (error.cause && error.cause.name === 'Error') {
    if (error.cause.message.includes('SQLITE_CONSTRAINT')) {
      if (error.cause.message.includes('UNIQUE')) {
        return { message: duplicateDataDesc(entity), status: CONFLICT }
      }
    }
  }
}
