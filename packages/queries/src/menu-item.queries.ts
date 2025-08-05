import { INTERNAL_SERVER_ERROR } from '@mac/resources/http-status-codes'
import type { MenuItemFilters } from '@mac/validators/menu-item'
import { queryOptions } from '@tanstack/react-query'

import apiClient from './api-client'

export const menuItemKeys = {
  all: ['menuItems'] as const,
  list: (query: MenuItemFilters) => [...menuItemKeys.lists(), query] as const,
  lists: () => [...menuItemKeys.all, 'lists'] as const,
} as const

export function getMenuItemsQuery(query: MenuItemFilters = {}, abortController?: AbortController) {
  return queryOptions({
    queryFn: async () => {
      const res = await apiClient.api.v1['menu-items'].$get(
        {
          query,
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

      throw new Error('Failed to fetch menu items')
    },
    queryKey: menuItemKeys.list(query),
  })
}
