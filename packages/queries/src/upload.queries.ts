// import { UNEXPECTED_ERROR_DESC } from '@mac/resources/general'
// import {
//   FORBIDDEN,
//   INTERNAL_SERVER_ERROR,
//   UNAUTHORIZED,
//   UNPROCESSABLE_ENTITY,
// } from '@mac/resources/http-status-codes'
// import { FieldErrors, FormErrors } from '@mac/validators/api-errors'
// import { mutationOptions, type QueryClient } from '@tanstack/react-query'

// import apiClient from './api-client'

// export type PresignImageInput = {
//   contentLength: number
//   contentType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif'
//   folder?: 'menu-items'
// }

// export type PresignImageResponse = {
//   uploadUrl: string
//   requiredHeaders: { 'content-type': string; 'content-length': string }
//   imageKey: string
//   originalKey: string
//   originalExt: 'jpg' | 'png' | 'webp' | 'avif'
//   expiresInSeconds: number
// }

// export function presignImageUploadMutation(queryClient: QueryClient) {
//   return mutationOptions({
//     mutationFn: async (data: PresignImageInput) => {
//       const res = await apiClient.api.v1.uploads.images.presign.$post({ json: data })

//       if (res.ok) {
//         return res.json() as Promise<PresignImageResponse>
//       }

//       if (res.status === UNPROCESSABLE_ENTITY) {
//         const data = await res.json()
//         throw new FieldErrors(data)
//       }

//       if (res.status === FORBIDDEN || res.status === UNAUTHORIZED) {
//         const data = await res.json()
//         throw new FormErrors(data.message)
//       }

//       if (res.status === INTERNAL_SERVER_ERROR) {
//         throw new Error(UNEXPECTED_ERROR_DESC)
//       }

//       const responseData = await res.json()
//       throw new Error(responseData.message)
//     },
//     mutationKey: ['uploads', 'images', 'presign'],
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['uploads', 'images'] })
//     },
//   })
// }
