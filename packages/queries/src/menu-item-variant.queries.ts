import { UNEXPECTED_ERROR_DESC } from '@mac/resources/general'
import {
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from '@mac/resources/http-status-codes'
import { FieldErrors } from '@mac/validators/api-errors'
import type {
  CreateMenuItemVariant,
  UpdateMenuItemVariantInput,
} from '@mac/validators/menu-item-variant'
import { mutationOptions, type QueryClient, queryOptions } from '@tanstack/react-query'

import apiClient from './api-client'

export const menuItemVariantKeys = {
  all: ['menuItemVariants'] as const,
  detail: (id: string) => [...menuItemVariantKeys.all, 'detail', id] as const,
  list: (menuItemId: string) => [...menuItemVariantKeys.lists(), menuItemId] as const,
  lists: () => [...menuItemVariantKeys.all, 'list'] as const,
} as const

export function getMenuItemVariantsQuery(id: string, abortController?: AbortController) {
  return queryOptions({
    queryFn: async () => {
      const res = await apiClient.api.v1['menu-items'][':id'].variants.$get(
        {
          param: {
            id,
          },
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

      if (res.status === INTERNAL_SERVER_ERROR) {
        const data = await res.json()
        throw new Error(data.message)
      }

      throw new Error('An error occurred while fetching menu item variants')
    },
    queryKey: menuItemVariantKeys.list(id),
  })
}

export function createMenuItemVariantMutation(
  id: string,
  queryClient: QueryClient,
  abortController?: AbortController
) {
  return mutationOptions({
    mutationFn: async (data: CreateMenuItemVariant) => {
      const res = await apiClient.api.v1['menu-items'][':id'].variants.$post(
        {
          json: data,
          param: {
            id,
          },
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

      if (res.status === INTERNAL_SERVER_ERROR) {
        throw new Error(UNEXPECTED_ERROR_DESC)
      }

      const responseData = await res.json()
      throw new Error(responseData.message)
    },
    mutationKey: [...menuItemVariantKeys.all, 'create', id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuItemVariantKeys.list(id) })
    },
  })
}

export function updateMenuItemVariantMutation(
  id: string,
  queryClient: QueryClient,
  abortController?: AbortController
) {
  return mutationOptions({
    mutationFn: async (data: UpdateMenuItemVariantInput) => {
      const res = await apiClient.api.v1['menu-items-variants']['variants'][':id'].$post(
        {
          json: data,
          param: {
            id,
          },
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

      if (res.status === INTERNAL_SERVER_ERROR) {
        throw new Error(UNEXPECTED_ERROR_DESC)
      }

      const responseData = await res.json()
      throw new Error(responseData.message)
    },
    mutationKey: [...menuItemVariantKeys.all, 'update', id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuItemVariantKeys.all })
    },
  })
}

export function deleteMenuItemVariantMutation(
  queryClient: QueryClient,
  abortController?: AbortController
) {
  return mutationOptions({
    mutationFn: async (id: string) => {
      const res = await apiClient.api.v1['menu-items-variants']['variants'][':id'].$delete(
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
        return null
      }

      if (res.status === FORBIDDEN || res.status === UNAUTHORIZED || res.status === NOT_FOUND) {
        const data = await res.json()
        throw new Error(data.message)
      }

      if (res.status === INTERNAL_SERVER_ERROR) {
        throw new Error(UNEXPECTED_ERROR_DESC)
      }
      throw new Error('An error occurred while deleting the variant')
    },
    mutationKey: [...menuItemVariantKeys.all, 'delete'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuItemVariantKeys.all })
    },
  })
}
