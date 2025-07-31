import type { User } from './auth'

export function hasAccess(id: string, user: User | null) {
  return id !== user?.id && !user?.role?.includes('admin')
}
