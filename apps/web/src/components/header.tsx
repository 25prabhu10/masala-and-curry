import { AuthButtons } from './auth-buttons'
import { Logo } from './logo'
import { MainNavigation } from './main-navigation'
import { ModeToggle } from './mode-toggle'

export default function Header() {
  return (
    <header className="bg-background/95 sticky top-0 z-50 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />
        <MainNavigation />
        <div className="flex items-center gap-4">
          <ModeToggle />
          <AuthButtons />
        </div>
      </nav>
    </header>
  )
}
