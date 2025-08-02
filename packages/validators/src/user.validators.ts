import type { z } from '@hono/zod-openapi'
import { InsertUserSchema, SelectUserSchema } from '@mac/db/schemas'

export const createUserValidator = InsertUserSchema
export const readUserValidator = SelectUserSchema
export const updateUserValidator = createUserValidator.partial()

export type User = z.output<typeof readUserValidator>
export type CreateUser = z.input<typeof readUserValidator>
export type UpdateUser = z.input<typeof updateUserValidator>
