import { UNEXPECTED_ERROR_DESC } from '@mac/resources/general'
import {
  CONFLICT,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from '@mac/resources/http-status-codes'
import { FieldErrors, FormErrors } from '@mac/validators/api-errors'
import type {
  CreateMenuItemInput,
  MenuItem,
  MenuItemFiltersWithCatch,
  UpdateMenuItemInput,
} from '@mac/validators/menu-item'
import { mutationOptions, type QueryClient, queryOptions } from '@tanstack/react-query'

import apiClient from './api-client'

export const menuItemKeys = {
  all: ['menuItems'] as const,
  detail: (id: string) => [...menuItemKeys.all, 'detail', id] as const,
  list: (query: MenuItemFiltersWithCatch) => [...menuItemKeys.lists(), query] as const,
  lists: () => [...menuItemKeys.all, 'list'] as const,
} as const

export function getMenuItemsQuery(
  filters: MenuItemFiltersWithCatch = {},
  abortController?: AbortController
) {
  return queryOptions({
    queryFn: async () => {
      const { sortBy, ...restFilters } = filters

      let resolvedSortBy: string | undefined

      if (typeof sortBy === 'string') {
        resolvedSortBy = sortBy
      }

      const res = await apiClient.api.v1['menu-items'].$get(
        {
          query: {
            ...restFilters,
            sortBy: resolvedSortBy,
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

      throw new Error('An error occurred while fetching menu items')
    },
    queryKey: menuItemKeys.list(filters),
  })
}

export function getMenuItemByIdQuery(
  id: string,
  enabled: boolean = true,
  abortController?: AbortController
) {
  return queryOptions({
    enabled,
    queryFn: async () => {
      const res = await apiClient.api.v1['menu-items'][':id'].$get(
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

      throw new Error('An error occurred while fetching the menu item')
    },
    queryKey: menuItemKeys.detail(id),
  })
}

export function createMenuItemMutation(
  queryClient: QueryClient,
  abortController?: AbortController
) {
  return mutationOptions({
    mutationFn: async (data: CreateMenuItemInput) => {
      const res = await apiClient.api.v1['menu-items'].$post(
        {
          json: data,
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
    mutationKey: [...menuItemKeys.all, 'create'],
    onSuccess: async (newMenuItem) => {
      queryClient.setQueryData(menuItemKeys.detail(newMenuItem.id), newMenuItem)
      await queryClient.invalidateQueries({ queryKey: menuItemKeys.lists() })
    },
  })
}

export function updateMenuItemMutation(
  id: string,
  queryClient: QueryClient,
  abortController?: AbortController
) {
  return mutationOptions({
    mutationFn: async (data: UpdateMenuItemInput) => {
      const res = await apiClient.api.v1['menu-items'][':id'].$post(
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
    mutationKey: [...menuItemKeys.all, 'update', id],
    onSuccess: async (updatedMenuItem) => {
      queryClient.setQueryData(menuItemKeys.detail(id), updatedMenuItem)
      await queryClient.invalidateQueries({ queryKey: menuItemKeys.lists() })
    },
  })
}

export function deleteMenuItemMutation(
  id: string,
  queryClient: QueryClient,
  abortController?: AbortController
) {
  return mutationOptions({
    mutationFn: async () => {
      const res = await apiClient.api.v1['menu-items'][':id'].$delete(
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

      throw new Error('An error occurred while deleting the menu item')
    },
    mutationKey: [...menuItemKeys.all, 'delete', id],
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: menuItemKeys.all })

      const previousMenuItems = queryClient.getQueryData<MenuItem[]>(menuItemKeys.all)

      if (previousMenuItems) {
        queryClient.setQueryData<MenuItem[]>(
          menuItemKeys.all,
          previousMenuItems.filter((menuItem) => menuItem.id !== id)
        )
      }

      return { previousMenuItems }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: menuItemKeys.all })
    },
  })
}
