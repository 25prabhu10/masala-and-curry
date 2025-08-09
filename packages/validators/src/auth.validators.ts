import { z } from '@hono/zod-openapi'
import { InsertAccountSchema, SelectUserSchema } from '@mac/db/schemas'

export const signInValidator = z.object({
  email: SelectUserSchema.shape.email,
  password: InsertAccountSchema.shape.password.unwrap(),
  rememberMe: z.boolean().optional(),
})

export type SignInSchema = z.input<typeof signInValidator>

export const signUpValidator = z
  .object({
    confirmPassword: z.string(),
    email: SelectUserSchema.shape.email,
    name: SelectUserSchema.shape.name,
    password: InsertAccountSchema.shape.password.unwrap(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type SignUpSchema = z.infer<typeof signUpValidator>
