import { AuthButtons } from './auth-buttons'
import { ModeToggle } from './mode-toggle'

export function HeaderActions() {
  return (
    <div className="flex items-center gap-4 lg:gap-6">
      <ModeToggle />
      <div className="h-6 w-px bg-border/60" />
      <AuthButtons />
    </div>
  )
}
