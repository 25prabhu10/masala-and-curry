import type { Hook } from '@hono/zod-openapi'
import { UNPROCESSABLE_ENTITY } from '../constants/http-status-codes'

// oxlint-disable-next-line no-explicit-any
const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (result.success === false) {
    return c.json(
      {
        success: false,
        error: {
          name: result.error.name,
          issues: result.error.issues.map((issue) => {
            return {
              code: issue.code,
              path: issue.path,
              message: issue.message,
            }
          }),
        },
      },
      UNPROCESSABLE_ENTITY
    )
  }
}

export default defaultHook
