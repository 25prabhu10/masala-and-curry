import type { AuthClient } from '@mac/auth-client'
import { queryOptions } from '@tanstack/react-query'

import { userKeys } from './user.queries'

export const authKeys = {
  all: [...userKeys.all, 'session'] as const,
}

export function getSessionQuery(authClient: AuthClient) {
  return queryOptions({
    queryFn: async () => {
      const res = await authClient.getSession()
      if (res.error) {
        throw new Error(res.error.message)
      }

      return res.data
    },
    queryKey: authKeys.all,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    retry: false,
    select: (data) => {
      if (!data) {
        return null
      }
      return data.session
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
