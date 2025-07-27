import { type Hook, z } from '@hono/zod-openapi'
import { UNPROCESSABLE_ENTITY } from '@mac/resources/http-status-codes'

import type { APIErrorResponse } from '../types'

// oxlint-disable-next-line no-explicit-any
const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (result.success === false) {
    const data = z.treeifyError(result.error) as APIErrorResponse

    const convertedObject: Record<string, string | string[]> = {}

    for (const key in data.properties) {
      if (Object.prototype.hasOwnProperty.call(data.properties, key)) {
        if (data.properties[key] && data.properties[key].errors) {
          convertedObject[key] = data.properties[key].errors
        }
      }
    }
    return c.json(convertedObject, UNPROCESSABLE_ENTITY)
  }
}

export default defaultHook
