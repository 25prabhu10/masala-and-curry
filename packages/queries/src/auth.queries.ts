import type { AuthClient } from '@mac/auth-client'
import { queryOptions } from '@tanstack/react-query'

export function getSessionQuery(authClient: AuthClient) {
  return queryOptions({
    queryKey: ['user', 'auth'] as const,
    queryFn: async () => {
      const session = await authClient.getSession()
      if (session.error) {
        throw new Error(session.error.message)
      }
      return session.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })
}
