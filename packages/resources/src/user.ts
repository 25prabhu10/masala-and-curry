import { MAX_PHONE_NUMBER_LENGTH, MAX_STRING_LENGTH, MAX_URL_LENGTH } from './constants'

export const USER_ID_PARAM: string = 'User ID of the user to fetch'
export const USER_NOT_FOUND: string = 'User not found.'

export const FULL_NAME_INVALID: string = 'Name must be a string.'
export const FULL_NAME_EMPTY: string = 'Name must not be empty.'
export const FULL_NAME_MAX_LENGTH: string = `Name must be at most ${MAX_STRING_LENGTH} characters long`

export const EMAIL_INVALID: string = 'Email must be a valid email address.'
export const EMAIL_MAX_LENGTH: string = `Email must be at most ${MAX_STRING_LENGTH} characters long`

export const EMAIL_ALREADY_EXISTS: string = 'Email already exists.'
export const EMAIL_VERIFIED_INVALID: string = 'Email verified must be a boolean.'

export const PHONE_INVALID: string = 'Phone number must be a valid US number.'
export const PHONE_NUMBER_MAX_LENGTH: string = `Phone number must be at most ${MAX_PHONE_NUMBER_LENGTH} characters long`

export const USER_IMAGE_MAX_LENGTH: string = `Image URL must be at most ${MAX_URL_LENGTH} characters long`

export const UPDATE_USER_SUMMARY: string = 'Update User'
export const UPDATE_USER_DESC: string = 'Update a user by User ID.'

export const UPDATE_FAILED_DESC: string = 'Update failed unexpectedly.'
export const UPDATE_NO_CHANGES: string = 'No changes made.'
export const UPDATE_USER_FAILED: string = 'Failed to update user. Please try again later.'
export const UPDATE_USER_REQUEST_BODY_DESC: string = 'User data to update.'
export const UPDATE_USER_SUCCESS_DESC: string = 'User updated.'
