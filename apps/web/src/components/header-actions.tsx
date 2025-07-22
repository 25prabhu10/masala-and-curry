import type { User } from '@/lib/auth-client'
import { AuthButtons } from './auth-buttons'
import { ModeToggle } from './mode-toggle'
import { UserProfileDropdown } from './user-profile-dropdown'

type HeaderActionsProps = {
  user: User | undefined
}

export function HeaderActions({ user }: HeaderActionsProps) {
  return (
    <div className="ml-auto flex items-center gap-4 lg:gap-6">
      <ModeToggle />
      <div className="h-6 w-px bg-border/60" />
      {user ? <UserProfileDropdown user={user} /> : <AuthButtons />}
    </div>
  )
}
