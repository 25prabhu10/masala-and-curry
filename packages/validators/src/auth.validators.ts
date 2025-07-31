import { InsertUserSchema } from '@mac/db/schemas'
import { z } from 'zod'

import type { Session } from './session.validators'
import type { User } from './user.validators'

export const signUpUserValidator = z.object({
  ...InsertUserSchema.shape,
})

export type UserSession = {
  user: User
  session: Session
}
