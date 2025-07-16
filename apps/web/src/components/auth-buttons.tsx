import { Button } from '@mac/web-ui/button'
import { Link } from '@tanstack/react-router'

export function AuthButtons() {
  return (
    <div className="flex items-center gap-3">
      <Button asChild>
        <Link to="/sign-in">Sign In</Link>
      </Button>
      <Button asChild className="hidden sm:block" variant="outline">
        <Link to="/sign-up">Sign Up</Link>
      </Button>
    </div>
  )
}
