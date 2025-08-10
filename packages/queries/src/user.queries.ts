import { UNEXPECTED_ERROR_DESC } from '@mac/resources/general'
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNPROCESSABLE_ENTITY,
} from '@mac/resources/http-status-codes'
import { FieldErrors, FormErrors } from '@mac/validators/api-errors'
import type { UpdateUser } from '@mac/validators/user'
import { mutationOptions, type QueryClient, queryOptions } from '@tanstack/react-query'

import apiClient from './api-client'

export const userKeys = {
  all: ['users'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
} as const

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
    queryKey: userKeys.detail(id),
  })
}

export function updateUserQuery(
  id: string,
  queryClient: QueryClient,
  abortController?: AbortController
) {
  return mutationOptions({
    mutationFn: async (data: UpdateUser) => {
      const res = await apiClient.api.v1.users[':id'].$post(
        {
          json: data,
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

      if (res.status === UNPROCESSABLE_ENTITY) {
        const data = await res.json()

        throw new FieldErrors(data)
      }

      if (res.status === CONFLICT) {
        const data = await res.json()
        throw new FormErrors(data.message)
      }

      if (res.status === INTERNAL_SERVER_ERROR) {
        throw new Error(UNEXPECTED_ERROR_DESC)
      }

      const responseData = await res.json()
      throw new Error(responseData.message)
    },
    mutationKey: [...userKeys.all, 'update', id],
    onSuccess: (data) => {
      queryClient.setQueryData(userKeys.detail(id), data)
    },
  })
}
