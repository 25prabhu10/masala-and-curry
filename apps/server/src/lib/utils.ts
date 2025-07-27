import { customAlphabet, nanoid } from 'nanoid'

import type { User } from './auth'
import { NANOID_ALPHABET, NANOID_LENGTH } from './constants'

export function generateId() {
  return nanoid()
}

export function generatePublicId() {
  const customNanoid = customAlphabet(NANOID_ALPHABET, NANOID_LENGTH)
  return customNanoid()
}

export function canAccess(id: string, user: User | null) {
  return id !== user?.id && !user?.role?.includes('admin')
}
