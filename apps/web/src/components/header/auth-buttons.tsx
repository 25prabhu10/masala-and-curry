import { Button } from '@mac/web-ui/button'
import { Link } from '@tanstack/react-router'
import { LogIn, UserPlus } from 'lucide-react'

import { useAppStore } from '@/stores/app-store'

export function AuthButtons() {
  const mobileMenuIsOpen = useAppStore((state) => state.mobileMenuIsOpen)
  const closeMobileMenu = useAppStore((state) => state.closeMobileMenu)
  return (
    <div className="flex items-center gap-3">
      <Button
        asChild
        onClick={mobileMenuIsOpen ? closeMobileMenu : undefined}
        size="sm"
        variant="ghost"
      >
        <Link to="/sign-in">
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </Link>
      </Button>
      <Button
        asChild
        className="shadow-sm"
        onClick={mobileMenuIsOpen ? closeMobileMenu : undefined}
        size="sm"
      >
        <Link to="/sign-up">
          <UserPlus className="h-4 w-4 mr-2" />
          Sign Up
        </Link>
      </Button>
    </div>
  )
}
