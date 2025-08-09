import { NANOID_ALPHABET, NANOID_LENGTH } from '@mac/resources/constants'
import { customAlphabet } from 'nanoid'

export function generatePublicId(): string {
  const customNanoid = customAlphabet(NANOID_ALPHABET, NANOID_LENGTH)
  return customNanoid()
}

export function enumToString(input: Readonly<string[]>): string {
  return input.map((x) => `'${x}'`).join(', ')
}
