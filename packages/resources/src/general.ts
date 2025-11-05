import { MAX_STRING_LENGTH, MAX_VALUE_IN_APP, MIN_STRING_LENGTH } from './constants'

export const VALIDATION_ERROR_DESC: string = 'Validation error(s). Check your input!'

export const FORM_SUBMISSION_ERROR_DESC: string =
  'Please fix the errors in the form before submitting.'
export const FORM_SUBMISSION_GENERIC_DESC: string = 'Please check your input(s) and try again.'

export const UNEXPECTED_ERROR_DESC: string = 'An unexpected error occurred. Please try again.'

export const NOT_AUTHENTICATED: string = 'You are not authenticated. Please sign-in to continue.'

export const NOT_AUTHORIZED: string = 'You are not authorized to perform this action.'

export const UPDATE_SUCCESS_DESC: string = 'Update successful.'

export const PAGINATION_ERROR_DESC: string = 'Must be a valid position number (e.g. 0, 1, 10).'

export const INVALID_URL_DESC: string = 'Must be a valid URL.'

export function duplicateDataDesc(entity: Readonly<string>): string {
  return `${entity} with same data already exists.`
}

export function invalidDesc(entity: Readonly<string>, type: Readonly<string>): string {
  return `${entity} must be a valid ${type}.`
}

export function invalidIdDesc(entity: Readonly<string>): string {
  return `id should be a valid ${entity} ID.`
}

export function notEmptyDesc(name: Readonly<string>): string {
  return `${name} must not be empty.`
}

export function maxValueDesc(name: Readonly<string>, maxValue?: Readonly<number>): string {
  return `${name} must be at most ${maxValue ?? MAX_VALUE_IN_APP}.`
}

export function minValueDesc(name: Readonly<string>, minValue?: Readonly<number>): string {
  return `${name} must be at least ${minValue ?? 0}.`
}

export function maxLengthDesc(name: Readonly<string>, maxLength?: Readonly<number>): string {
  return `${name} must be at most ${maxLength ?? MAX_STRING_LENGTH} characters long.`
}

export function minLengthDesc(name: Readonly<string>, minLength?: Readonly<number>): string {
  return `${name} must be at least ${minLength ?? MIN_STRING_LENGTH} characters long.`
}

export function getDataSuccessDesc(name: Readonly<string>): string {
  return `${name} data retrieved successfully.`
}

export function createDataDesc(entity: Readonly<string>): string {
  return `${entity} data to create.`
}

export function createDataSuccessDesc(entity: Readonly<string>): string {
  return `${entity} created successfully.`
}

export function createFailedDesc(entity: Readonly<string>): string {
  return `Failed to create ${entity}.`
}

export function deleteSuccessDesc(entity: Readonly<string>): string {
  return `${entity} deleted successfully.`
}

export function deleteFailedDesc(entity: Readonly<string>): string {
  return `Failed to delete ${entity}.`
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

export function uploadFileDesc(name: Readonly<string>): string {
  return `${name} file to be uploaded.`
}

export function uploadFileSuccessDesc(name: Readonly<string>): string {
  return `${name} file uploaded successfully.`
}

export function uploadFileFailedDesc(name: Readonly<string>): string {
  return `Failed to upload ${name} file. Please try again later.`
}

export function fileMinSizeDesc(name: Readonly<string>, minSize: Readonly<number>): string {
  return `${name} file must be at least ${minSize} MB.`
}

export function fileMaxSizeDesc(name: Readonly<string>, maxSize: Readonly<number>): string {
  return `${name} file must be at most ${maxSize} MB.`
}

export function invalidFileDesc(name: Readonly<string>): string {
  return `The file must be a valid ${name} file.`
}
