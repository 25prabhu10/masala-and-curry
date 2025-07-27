import { getSessionQuery } from '@mac/queries/auth'
import { type QueryClient, useQuery } from '@tanstack/react-query'
import { createContext, use } from 'react'

import { authClient, type Session } from '@/lib/auth-client'

type AuthContextType = {
  session: Session | undefined | null
  isAuthLoading: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthContextProvider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  const { data: session, isLoading: isAuthLoading } = useQuery(
    getSessionQuery(authClient, queryClient)
  )

  console.log('Context: useSession is loading:', isAuthLoading)
  console.log('Context: I am using session', JSON.stringify(session, null, 2))
  return <AuthContext value={{ isAuthLoading, session }}>{children}</AuthContext>
}

export function useAuthContext() {
  const context = use(AuthContext)
  if (!context) {
    throw new Error('useRouterContext must be used within RouterContextProvider')
  }
  return context
}

export function useAuthSession() {
  const { session, isAuthLoading } = useAuthContext()
  return { isAuthLoading, session }
}
