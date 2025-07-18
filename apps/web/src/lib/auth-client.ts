import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: 'http://localhost:5173',
  basePath: '/api/v1/auth',
})

export const { signIn, signOut, signUp, useSession } = authClient
