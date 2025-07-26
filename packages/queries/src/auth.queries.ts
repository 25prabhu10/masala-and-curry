import type { AuthClient } from '@mac/auth-client'
import { queryOptions } from '@tanstack/react-query'

import { allUserKeys } from './user.queries'

export const allAuthKeys = [...allUserKeys, 'auth'] as const

export function getSessionQuery(authClient: AuthClient) {
  return queryOptions({
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000))
      const session = await authClient.getSession()
      if (session.error) {
        throw new Error(session.error.message)
      }
      return session.data
    },
    queryKey: allAuthKeys,
    refetchInterval: 60 * 1000, // 1 minute
    retry: false,
    staleTime: 60 * 1000, // 1 minutes
  })
}
