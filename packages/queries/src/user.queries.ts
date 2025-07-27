import { queryOptions } from '@tanstack/react-query'

import apiClient from './api-client'

export const userKeys = {
  all: ['users'] as const,
  user: (id: string) => [...userKeys.all, id] as const,
}

export function getUserQuery(id: string, abortController?: AbortController) {
  return queryOptions({
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000)) // Simulate network delay
      const res = await apiClient.api.v1.users[':id'].$get(
        {
          param: { id },
        },
        {
          init: {
            signal: abortController?.signal,
          },
        }
      )

      if (res.status === 404) {
        throw new Error('User not found')
      }
      return { email: 'john.doe@example.com', id, name: 'John Doe' }
    },
    queryKey: userKeys.user(id),
  })
}

export function updateUserQuery(id: string) {
  return queryOptions({
    queryFn: async () => {
      return { success: true }
    },
    queryKey: userKeys.user(id),
  })
}
