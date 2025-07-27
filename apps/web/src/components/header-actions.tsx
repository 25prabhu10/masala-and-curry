import { Skeleton } from '@mac/web-ui/skeleton'
import { Suspense } from 'react'

import { ModeToggle } from './mode-toggle'
import { UserHeaderActions } from './user-header-actions'

export function HeaderActions() {
  return (
    <div className="ml-auto flex items-center gap-4 lg:gap-6">
      <ModeToggle />
      <div className="h-6 w-px bg-border/60" />
      <Suspense fallback={<Skeleton className="size-10 rounded-full" />}>
        <UserHeaderActions />
      </Suspense>
    </div>
  )
}
