import { getSessionQuery } from '@mac/queries/auth'
import { useQuery } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import { HeaderActions } from './header-actions'
import { Logo } from './logo'
import { MainNavigation } from './main-navigation'
import { UserProfileDropdown } from './user-profile-dropdown'

export default function Header() {
  const { data: userSession } = useQuery(getSessionQuery(authClient))

  return (
    <header className="bg-background/95 sticky top-0 z-50 backdrop-blur-2xl border-b border-border/60 shadow-sm">
      <nav className="container flex h-20 items-center gap-8 px-4 lg:px-6">
        <Logo />
        <MainNavigation />

        {userSession !== null && userSession?.user ? (
          <UserProfileDropdown user={userSession.user} />
        ) : (
          <HeaderActions />
        )}
      </nav>
    </header>
  )
}
