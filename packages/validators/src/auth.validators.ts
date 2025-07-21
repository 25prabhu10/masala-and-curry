import type { Session } from './session.validators'
import type { User } from './user.validators'
import { InsertUserSchema } from '@mac/db/schemas'
import * as z from 'zod'

export const signUpUserValidator = z.object({
  ...InsertUserSchema.shape,
})

export type UserSession = {
  user: User
  session: Session
}
