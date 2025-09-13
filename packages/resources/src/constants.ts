export const MAX_NUMBER_IN_APP = 10_000

export const MAX_STRING_LENGTH = 255
export const MAX_URL_LENGTH = 2048
export const MIN_PASSWORD_LENGTH = 8
export const MIN_STRING_LENGTH = 1
export const MAX_PHONE_NUMBER_LENGTH = 12

export const MIN_CURRENCY_VALUE = 0.01
export const MAX_CURRENCY_VALUE = 999_999.99
export const NUMBER_STEPS = 0.01

export const NANOID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz'
export const NANOID_LENGTH = 30

export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_PAGE_INDEX = 0

export const MAX_FILE_NAME_LENGTH = 100
export const MIN_FILE_SIZE = 1000 // 1KB
export const MAX_FILE_SIZE = 5_242_880 // 5MB
export const MIN_FILE_SIZE_MB = 1
export const MAX_FILE_SIZE_MB = 5

export const IMAGE_MIME_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp', 'image/avif']

export const SELECTION_TYPES = ['single', 'multiple'] as const

export const SPICE_LABELS = {
  0: 'No Spice',
  1: 'Mild',
  2: 'Medium',
  3: 'Hot',
  4: 'Very Hot',
  5: 'Extremely Hot',
} as const
