import { customAlphabet, nanoid } from 'nanoid'

import { NANOID_ALPHABET, NANOID_LENGTH } from './constants'

export function generateId() {
  return nanoid()
}

export function generatePublicId() {
  const customNanoid = customAlphabet(NANOID_ALPHABET, NANOID_LENGTH)
  return customNanoid()
}
