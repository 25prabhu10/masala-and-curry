import { queryOptions } from '@tanstack/react-query'

export const allUserKeys = ['user'] as const

export function updateUserQuery(id: string) {
  return queryOptions({
    queryFn: async () => {
      return { success: true }
    },
    queryKey: [...allUserKeys, id],
  })
}
