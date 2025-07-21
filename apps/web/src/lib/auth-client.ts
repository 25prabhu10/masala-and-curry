import { createNewClient } from '@mac/auth-client'

export const authClient = createNewClient('http://localhost:5173', '/api/v1/auth')

export const { signIn, signOut, signUp, getSession } = authClient

export type UserSession = typeof authClient.$Infer.Session

export type User = UserSession['user']
