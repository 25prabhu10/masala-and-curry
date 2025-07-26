import { HeaderActions } from './header-actions'
import { Logo } from './logo'
import { MainNavigation } from './main-navigation'

export default function Header() {
  return (
    <header className="bg-background/95 sticky top-0 z-50 backdrop-blur-2xl border-b border-border/60 shadow-sm">
      <nav className="container flex h-20 items-center gap-8 px-4 lg:px-6">
        <Logo />
        <MainNavigation />
        <HeaderActions />
      </nav>
    </header>
  )
}
