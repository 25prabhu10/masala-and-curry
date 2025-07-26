import { useAuthentication } from '@/lib/auth-client'

import { AuthButtons } from './auth-buttons'
import { ModeToggle } from './mode-toggle'
import { UserProfileDropdown } from './user-profile-dropdown'

export function HeaderActions() {
  const { userSession } = useAuthentication()
  return (
    <div className="ml-auto flex items-center gap-4 lg:gap-6">
      <ModeToggle />
      <div className="h-6 w-px bg-border/60" />
      {userSession ? <UserProfileDropdown user={userSession.user} /> : <AuthButtons />}
    </div>
  )
}
