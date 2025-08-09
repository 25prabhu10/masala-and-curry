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
  Category,
  CategoryFilters,
  CreateCategory,
  UpdateCategoryInput,
} from '@mac/validators/category'
import {
  mutationOptions,
  type QueryClient,
  queryOptions,
  useQueryClient,
} from '@tanstack/react-query'

import apiClient from './api-client'

export const categoryKeys = {
  all: ['categories'] as const,
  detail: (id: string) => [...categoryKeys.all, 'detail', id] as const,
  list: (query: CategoryFilters) => [...categoryKeys.lists(), query] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
} as const

export function getCategoriesQuery(
  filters: CategoryFilters = {},
  abortController?: AbortController
) {
  return queryOptions({
    queryFn: async () => {
      const { sortBy, ...restFilters } = filters

      let resolvedSortBy: string | undefined

      if (typeof sortBy === 'string') {
        resolvedSortBy = sortBy
      }

      const res = await apiClient.api.v1.categories.$get(
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

      throw new Error('An error occurred while fetching categories')
    },
    queryKey: categoryKeys.list(filters),
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

export function createCategoryMutation(queryClient: QueryClient) {
  return mutationOptions({
    mutationFn: async (data: CreateCategory) => {
      const res = await apiClient.api.v1.categories.$post({
        json: data,
      })

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
    mutationKey: [...categoryKeys.all, 'create'],
    onSuccess: (newCategory) => {
      queryClient.setQueryData(categoryKeys.detail(newCategory.id), newCategory)
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
  })
}

export function updateCategoryMutation(id: string, queryClient: QueryClient) {
  return mutationOptions({
    mutationFn: async (data: UpdateCategoryInput) => {
      const res = await apiClient.api.v1.categories[':id'].$post({
        json: data,
        param: { id },
      })

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

    mutationKey: [...categoryKeys.all, 'update', id],
    onSuccess: (updatedCategory) => {
      queryClient.setQueryData(categoryKeys.detail(id), updatedCategory)
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
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
