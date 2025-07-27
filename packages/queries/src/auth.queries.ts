import type { AuthClient } from '@mac/auth-client'
import { type QueryClient, queryOptions } from '@tanstack/react-query'

import { userKeys } from './user.queries'

export const authKeys = {
  all: [...userKeys.all, 'session'] as const,
}

export function getSessionQuery(authClient: AuthClient, queryClient: QueryClient) {
  return queryOptions({
    queryFn: async () => {
      const res = await authClient.getSession()
      if (res.error) {
        throw new Error(res.error.message)
      }

      if (res.data) {
        queryClient.setQueryData(userKeys.user(res.data.user.id), res.data.user)
      }

      return res.data
    },
    queryKey: authKeys.all,
    refetchInterval: 60 * 1000, // 1 minute
    retry: false,
    select: (data) => {
      if (!data) {
        return null
      }
      return data.session
    },
    staleTime: 60 * 1000, // 1 minutes
  })
}
