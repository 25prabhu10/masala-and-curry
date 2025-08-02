import { InsertUserSchema } from '@mac/db/schemas'

import type { Session } from './session.validators'
import type { User } from './user.validators'

export const signUpUserValidator = InsertUserSchema

export type UserSession = {
  user: User
  session: Session
}
