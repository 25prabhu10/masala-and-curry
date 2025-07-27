import { UNEXPECTED_ERROR_DESC } from '@mac/resources/general'
import {
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
} from '@mac/resources/http-status-codes'
import type { UpdateUser } from '@mac/validators/user'
import { mutationOptions, queryOptions } from '@tanstack/react-query'

import apiClient from './api-client'

export const userKeys = {
  all: ['users'] as const,
  user: (id: string) => [...userKeys.all, id] as const,
}

export function getUserByIdQuery(id: string, abortController?: AbortController) {
  return queryOptions({
    queryFn: async () => {
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

      if (res.ok) {
        return res.json()
      }

      if (res.status === NOT_FOUND || res.status === INTERNAL_SERVER_ERROR) {
        const data = await res.json()
        throw new Error(data.message)
      }

      throw new Error('An error occurred while fetching the user')
    },
    queryKey: userKeys.user(id),
  })
}

export function updateUserQuery(id: string) {
  return mutationOptions({
    mutationFn: async (data: UpdateUser) => {
      const res = await apiClient.api.v1.users[':id'].$post({
        json: data,
        param: { id },
      })

      if (!res.ok) {
        if (res.status === FORBIDDEN || res.status === UNAUTHORIZED || res.status === NOT_FOUND) {
          const data = await res.json()
          throw new Error(data.message)
        } else if (res.status === INTERNAL_SERVER_ERROR) {
          throw new Error(UNEXPECTED_ERROR_DESC)
        }
      }

      return res
    },
    mutationKey: userKeys.user(id),
  })
}
