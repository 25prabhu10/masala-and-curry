import { createNewClient } from '@mac/auth-client'

export const authClient = createNewClient(
  import.meta.env.VITE_APP_URL,
  import.meta.env.VITE_AUTH_BASE_PATH
)

export const { signIn, signOut, signUp, getSession, useSession } = authClient

export type UserSession = typeof authClient.$Infer.Session

export type User = UserSession['user']
export type Session = UserSession['session']
