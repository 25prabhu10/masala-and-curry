import { z } from '@hono/zod-openapi'
import {
  IMAGE_MIME_TYPES,
  MAX_FILE_NAME_LENGTH,
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_MB,
  MIN_FILE_SIZE,
  MIN_FILE_SIZE_MB,
  MIN_STRING_LENGTH,
} from '@mac/resources/constants'
import {
  fileMaxSizeDesc,
  fileMinSizeDesc,
  invalidDesc,
  invalidFileDesc,
  maxLengthDesc,
  minLengthDesc,
  notEmptyDesc,
} from '@mac/resources/general'

export const uploadImageSchema = z.object({
  file: z
    .file(invalidDesc('Image file', 'File'))
    .min(MIN_FILE_SIZE, fileMinSizeDesc('Image', MIN_FILE_SIZE_MB))
    .max(MAX_FILE_SIZE, fileMaxSizeDesc('Image', MAX_FILE_SIZE_MB))
    .mime(IMAGE_MIME_TYPES)
    .refine(
      (file) => {
        const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, '')
        return fileNameWithoutExtension.length >= MIN_STRING_LENGTH
      },
      {
        abort: true,
        message: notEmptyDesc('Image file name'),
      }
    )
    .refine((file) => file.name.length < MAX_FILE_NAME_LENGTH, {
      abort: true,
      message: maxLengthDesc('Image file name', MAX_FILE_NAME_LENGTH),
    }),
})

export const uploadImageSchemaAPI = z.object({
  file: z
    .custom<File>((target) => target instanceof File, {
      error: () => invalidFileDesc('Image'),
    })
    .pipe(uploadImageSchema.shape.file)
    .openapi({
      description: `Image file to upload. Valid formats are: ${IMAGE_MIME_TYPES.join(', ')}`,
      example: '<base64-encoded-image>',
      format: 'binary',
      type: 'string',
    }),
})

export const imageURLValidator = z
  .object({
    url: z
      .string(invalidDesc('Image URL', 'string'))
      .trim()
      .min(MIN_STRING_LENGTH, { message: minLengthDesc('Category name') })
      .max(MAX_FILE_NAME_LENGTH, { message: maxLengthDesc('Category name') })
      .openapi({
        description: 'The URL of the image',
        example: 'menu-items/abcd123/image.webp',
        required: ['url'],
      }),
  })
  .openapi({
    description: 'Image URL parameters',
  })

export const imageKeyValidator = z
  .object({
    filename: imageURLValidator.shape.url,
    key: imageURLValidator.shape.url,
  })
  .openapi({
    description: 'Image key parameters',
  })
  .openapi('URL')
