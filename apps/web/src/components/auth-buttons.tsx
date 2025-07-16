import { Button } from '@mac/web-ui/button'
import { Link } from '@tanstack/react-router'
import { LogIn, UserPlus } from 'lucide-react'

export function AuthButtons() {
  return (
    <div className="flex items-center gap-3">
      <Button asChild className="hidden sm:flex" size="sm" variant="ghost">
        <Link to="/sign-in">
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </Link>
      </Button>
      <Button asChild className="shadow-sm" size="sm">
        <Link to="/sign-up">
          <UserPlus className="h-4 w-4 mr-2" />
          Sign Up
        </Link>
      </Button>
    </div>
  )
}
