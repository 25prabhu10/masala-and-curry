import { createNewClient } from '@mac/auth-client'

export const authClient = createNewClient(
  import.meta.env.VITE_APP_URL,
  import.meta.env.VITE_AUTH_BASE_PATH
)

export const { signIn, signOut, signUp } = authClient

export type Session = (typeof authClient.$Infer.Session)['session']
