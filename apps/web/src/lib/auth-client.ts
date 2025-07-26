import { createNewClient } from '@mac/auth-client'
import { getSessionQuery } from '@mac/queries/auth'
import { useQuery } from '@tanstack/react-query'

export const authClient = createNewClient(
  import.meta.env.VITE_APP_URL,
  import.meta.env.VITE_AUTH_BASE_PATH
)

export function useAuthentication() {
  const { data: userSession, isLoading, error } = useQuery(getSessionQuery(authClient))

  return { error, isLoading, userSession }
}

export const { signIn, signOut, signUp, getSession, useSession } = authClient

export type UserSession = typeof authClient.$Infer.Session

export type User = UserSession['user']
