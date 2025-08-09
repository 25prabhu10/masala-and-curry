import { NOT_AUTHORIZED } from '@mac/resources/general'

export const BASE_PATH = '/api/v1' as const

export const OPEN_API_SCHEMA_FILE = 'open-api-schema.json'

export const NOT_AUTHORIZED_RES = {
  message: NOT_AUTHORIZED,
}
