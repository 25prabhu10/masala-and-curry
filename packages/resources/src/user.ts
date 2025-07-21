import { MAX_STRING_LENGTH, MAX_URL_LENGTH } from './constants.js'

export const USER_FULL_NAME_INVALID: string = 'Name must be a string.'
export const USER_FULL_NAME_MAX_LENGTH: string = `Name must be at most ${MAX_STRING_LENGTH} characters long`
export const USER_EMAIL_INVALID: string = 'Email must be a valid email address.'
export const USER_EMAIL_MAX_LENGTH: string = `Email must be at most ${MAX_STRING_LENGTH} characters long`
export const USER_IMAGE_MAX_LENGTH: string = `Image URL must be at most ${MAX_URL_LENGTH} characters long`
