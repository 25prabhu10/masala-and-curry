import { InsertUserSchema, SelectUserSchema } from '@mac/db/schemas'
import * as z from 'zod'

export const createUserValidator = z.object({
  ...InsertUserSchema.shape,
})

export const readUserValidator = z.object({
  ...SelectUserSchema.shape,
})

export const updateUserValidator = createUserValidator.partial()

export type User = z.output<typeof readUserValidator>
export type CreateUser = z.input<typeof readUserValidator>
export type UpdateUser = z.input<typeof updateUserValidator>
