import type { User } from './auth'

export function hasAccess(id: string, user: User | null): boolean {
  return id === user?.id || !!user?.role?.includes('admin')
}
