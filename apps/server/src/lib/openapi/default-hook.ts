import { type Hook, z } from '@hono/zod-openapi'
import { UNPROCESSABLE_ENTITY } from '@mac/resources/http-status-codes'

// oxlint-disable-next-line no-explicit-any
const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (result.success === false) {
    return c.json(z.treeifyError(result.error), UNPROCESSABLE_ENTITY)
  }
}

export default defaultHook
