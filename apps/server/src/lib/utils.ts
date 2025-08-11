import { NANOID_ALPHABET, NANOID_LENGTH } from '@mac/resources/constants'
import { customAlphabet } from 'nanoid'

import type { User } from './auth'

export function hasAccess(id: string, user: User | null): boolean {
  return id === user?.id || !!user?.role?.includes('admin')
}

export function generatePublicId(): string {
  const customNanoid = customAlphabet(NANOID_ALPHABET, NANOID_LENGTH)
  return customNanoid()
}

export function generateImageFileKey(
  fileName: Readonly<string>,
  mimeType: Readonly<string>
): string {
  const [_, ext] = mimeType.split('/')
  const filename = fileName.replace(/\.[^/.]+$/, '')
  return `${generatePublicId()}/${filename}.${ext}`
}

export function getKeyFromImageFilePath(key: string, filename: string): string {
  return `${key}/${filename}`
}
