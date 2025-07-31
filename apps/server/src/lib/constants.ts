import { NOT_AUTHORIZED, UPDATE_NO_CHANGES } from '@mac/resources/general'

export const BASE_PATH = '/api/v1' as const

export const OPEN_API_SCHEMA_FILE = 'open-api-schema.json'

export const NOT_AUTHORIZED_RES = {
  message: NOT_AUTHORIZED,
}

export const UPDATE_NO_CHANGES_RES = { message: UPDATE_NO_CHANGES }
