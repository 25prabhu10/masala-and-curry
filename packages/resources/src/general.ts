import { MAX_STRING_LENGTH, MIN_STRING_LENGTH } from './constants'

export const VALIDATION_ERROR_DESC: string = 'Validation error(s). Check your input!'

export const FORM_SUBMISSION_ERROR_DESC: string =
  'Please fix the errors in the form before submitting'
export const FORM_SUBMISSION_GENERIC_DESC: string = 'Please check your input(s) and try again'

export const UNEXPECTED_ERROR_DESC: string = 'An unexpected error occurred. Please try again.'

export const UPDATE_NO_CHANGES: string = 'No changes made.'

export const NOT_AUTHENTICATED: string = 'You are not authenticated. Please sign-in to continue.'

export const NOT_AUTHORIZED: string = 'You are not authorized to perform this action.'

export const UPDATE_SUCCESS_DESC: string = 'Update successful.'

export const PAGINATION_ERROR_DESC: string = 'Must be a valid position number (e.g. 1, 10)'

export function duplicateDataDesc(entity: string): string {
  return `${entity} with same data already exists.`
}

export function invalidIdDesc(entity: Readonly<string>): string {
  return `id should be a valid ${entity} ID`
}

export function notEmptyDesc(name: Readonly<string>): string {
  return `${name} must not be empty.`
}

export function maxLengthDesc(name: Readonly<string>, maxLength?: Readonly<number>): string {
  return `${name} must be at most ${maxLength ?? MAX_STRING_LENGTH} characters long`
}

export function minLengthDesc(name: Readonly<string>, minLength?: Readonly<number>): string {
  return `${name} must be at least ${minLength ?? MIN_STRING_LENGTH} characters long`
}

export function getDataSuccessDesc(name: Readonly<string>): string {
  return `${name} data retrieved successfully.`
}

export function createDataDesc(entity: string): string {
  return `${entity} data to create`
}

export function createDataSuccessDesc(entity: string): string {
  return `${entity} created successfully`
}

export function createFailedDesc(entity: string): string {
  return `Failed to create ${entity}`
}

export function deleteSuccessDesc(entity: string): string {
  return `${entity} deleted successfully`
}

export function deleteFailedDesc(entity: string): string {
  return `Failed to delete ${entity}`
}

export function getDataFailedDesc(name: Readonly<string>): string {
  return `Failed to retrieve ${name} data. Please try again later.`
}

export function updateDataDesc(name: Readonly<string>): string {
  return `${name} data to update.`
}

export function updateSuccessDesc(name: Readonly<string>): string {
  return `${name} updated successfully.`
}

export function updateFailedDesc(name: Readonly<string>): string {
  return `Failed to update ${name}. Please try again later.`
}

export function notFoundDesc(name: Readonly<string>): string {
  return `${name} not found.`
}
