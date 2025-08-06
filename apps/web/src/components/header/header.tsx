import { HeaderActions } from './header-actions'
import { Logo } from './logo'
import { MainNavigation } from './main-navigation'
import { MobileMenu } from './mobile-menu'

export default function Header() {
  return (
    <header className="bg-background/95 sticky top-0 backdrop-blur-2xl border-b border-border/60 shadow-sm">
      <nav className="container flex h-20 items-center justify-between gap-8 px-4 lg:px-6">
        <Logo />
        <div className="hidden md:flex mr-auto">
          <MainNavigation />
        </div>

        <div className="hidden md:flex">
          <HeaderActions />
        </div>

        <div className="ml-auto md:hidden">
          <MobileMenu />
        </div>
      </nav>
    </header>
  )
}
