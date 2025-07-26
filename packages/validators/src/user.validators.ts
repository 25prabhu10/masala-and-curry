import { InsertUserSchema, SelectUserSchema, UpdateUserSchema } from '@mac/db/schemas'
import { MAX_STRING_LENGTH, MIN_STRING_LENGTH } from '@mac/resources/constants'
import { USER_ID_PARAM } from '@mac/resources/user'
import * as z from 'zod'

export const createUserValidator = z.object({
  ...InsertUserSchema.shape,
})

export const readUserValidator = z.object({
  ...SelectUserSchema.shape,
})

export const updateUserValidator = z.object({
  ...UpdateUserSchema.shape,
})

export const userIdParamsSchema = z.object({
  id: z
    .string()
    .min(MIN_STRING_LENGTH)
    .max(MAX_STRING_LENGTH)
    .openapi({
      description: USER_ID_PARAM,
      example: 'johndoe',
      param: {
        name: 'id',
      },
      required: ['id'],
    }),
})

export type User = z.output<typeof readUserValidator>
export type CreateUser = z.input<typeof readUserValidator>
export type UpdateUser = z.input<typeof updateUserValidator>
