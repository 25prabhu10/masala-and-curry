import { INTERNAL_SERVER_ERROR } from '@mac/resources/http-status-codes'
import { HTTPException } from 'hono/http-exception'

export class InternalServerError extends HTTPException {
  constructor(message: string) {
    super(INTERNAL_SERVER_ERROR, { message })
    this.name = 'InternalServerError'
    Object.setPrototypeOf(this, InternalServerError.prototype)
  }
}
