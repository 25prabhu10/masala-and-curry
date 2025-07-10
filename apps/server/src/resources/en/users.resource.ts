import { MAX_STRING_LENGTH, MAX_URL_LENGTH } from '@/lib/constants'

export const en = {
  USER_FULL_NAME_INVALID: 'Name must be a string.',
  USER_FULL_NAME_MAX_LENGTH: `Name must be at most ${MAX_STRING_LENGTH} characters long`,
  USERNAME_INVALID: 'Username must be a string.',
  USERNAME_MAX_LENGTH: `Username must be at most ${MAX_STRING_LENGTH} characters long`,
  USER_EMAIL_INVALID: 'Email must be a valid email address.',
  USER_EMAIL_MAX_LENGTH: `Email must be at most ${MAX_STRING_LENGTH} characters long`,
  USER_IMAGE_MAX_LENGTH: `Image URL must be at most ${MAX_URL_LENGTH} characters long`,
}
