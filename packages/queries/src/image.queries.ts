import { UNEXPECTED_ERROR_DESC } from '@mac/resources/general'
import { INTERNAL_SERVER_ERROR, UNPROCESSABLE_ENTITY } from '@mac/resources/http-status-codes'
import { FieldErrors } from '@mac/validators/api-errors'
import { mutationOptions } from '@tanstack/react-query'

import apiClient from './api-client'

export const imageKeys = {
  all: 'images' as const,
} as const

export function uploadImageMutation() {
  return mutationOptions({
    mutationFn: async (file: File) => {
      const res = await apiClient.api.v1.images.$put({
        form: {
          file,
        },
      })
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
    mutationKey: [...imageKeys.all, 'upload'],
  })
}
