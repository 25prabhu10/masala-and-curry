import type { z } from '@hono/zod-openapi'
import { InsertUserSchema, SelectUserSchema, UpdateUserSchema } from '@mac/db/schemas'

export const readUserValidator = SelectUserSchema
export const createUserValidator = InsertUserSchema
export const updateUserValidator = UpdateUserSchema

export type User = z.infer<typeof readUserValidator>
export type CreateUser = z.infer<typeof createUserValidator>
export type UpdateUser = z.input<typeof updateUserValidator>
