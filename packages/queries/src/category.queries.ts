import { UNEXPECTED_ERROR_DESC } from '@mac/resources/general'
import {
  CONFLICT,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
} from '@mac/resources/http-status-codes'
import type { Category, CategoryFilters, UpdateCategory } from '@mac/validators/category'
import { mutationOptions, queryOptions, useQueryClient } from '@tanstack/react-query'

import apiClient from './api-client'

export const categoryKeys = {
  all: ['categories'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  list: (query: CategoryFilters) => [...categoryKeys.all, query] as const,
} as const

export function getCategoriesQuery(query: CategoryFilters = {}, abortController?: AbortController) {
  return queryOptions({
    queryFn: async () => {
      let sortBy: string | undefined

      await new Promise((resolve) => setTimeout(resolve, 5000))

      if (typeof query.sortBy === 'string') {
        sortBy = query.sortBy
      }

      const res = await apiClient.api.v1.categories.$get(
        {
          query: {
            ...query,
            sortBy,
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

      throw new Error('An error occurred while fetching categories')
    },
    queryKey: categoryKeys.list(query),
  })
}

export function getCategoryByIdQuery(id: string, abortController?: AbortController) {
  return queryOptions({
    queryFn: async () => {
      const res = await apiClient.api.v1.categories[':id'].$get(
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

      throw new Error('An error occurred while fetching the category')
    },
    queryKey: categoryKeys.detail(id),
  })
}

export function createCategoryMutation() {
  return mutationOptions({
    mutationFn: async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
      const res = await apiClient.api.v1.categories.$post({
        json: data,
      })

      if (res.ok) {
        return res.json()
      }

      if (res.status === CONFLICT) {
        const errorData = await res.json()
        throw new Error(errorData.message)
      }

      if (res.status === FORBIDDEN || res.status === UNAUTHORIZED) {
        const data = await res.json()
        throw new Error(data.message)
      }

      if (res.status === INTERNAL_SERVER_ERROR) {
        throw new Error(UNEXPECTED_ERROR_DESC)
      }

      throw new Error('An error occurred while creating the category')
    },
    mutationKey: ['categories', 'create'],
  })
}

export function updateCategoryMutation(id: string) {
  return mutationOptions({
    mutationFn: async (data: UpdateCategory) => {
      const res = await apiClient.api.v1.categories[':id'].$post({
        json: data,
        param: { id },
      })

      if (res.ok) {
        return res.json()
      }

      if (res.status === CONFLICT) {
        const errorData = await res.json()
        throw new Error(errorData.message)
      }

      if (res.status === FORBIDDEN || res.status === UNAUTHORIZED || res.status === NOT_FOUND) {
        const data = await res.json()
        throw new Error(data.message)
      }

      if (res.status === INTERNAL_SERVER_ERROR) {
        throw new Error(UNEXPECTED_ERROR_DESC)
      }

      throw new Error('An error occurred while updating the category')
    },
    mutationKey: ['categories', 'update', id],
  })
}

export function deleteCategoryMutation() {
  const queryClient = useQueryClient()
  return mutationOptions({
    mutationFn: async (id: string) => {
      const res = await apiClient.api.v1.categories[':id'].$delete({
        param: { id },
      })

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

      throw new Error('An error occurred while deleting the category')
    },
    mutationKey: ['categories', 'delete'],
    onError: (_, __, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData<Category[]>(categoryKeys.all, context.previousCategories)
      }
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: categoryKeys.all })

      const previousCategories = queryClient.getQueryData<Category[]>(categoryKeys.all)

      if (previousCategories) {
        queryClient.setQueryData<Category[]>(
          categoryKeys.all,
          previousCategories.filter((category) => category.id !== id)
        )
      }

      return { previousCategories }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
    },
  })
}
