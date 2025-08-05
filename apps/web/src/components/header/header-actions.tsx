import { Separator } from '@mac/web-ui/separator'
import { Skeleton } from '@mac/web-ui/skeleton'
import { Suspense } from 'react'

import { ModeToggle } from './mode-toggle'
import { UserHeaderActions } from './user-header-actions'

export function HeaderActions() {
  return (
    <div className="flex items-center justify-between gap-4 px-4 lg:gap-6">
      <ModeToggle />
      <Separator className="h-6" orientation="vertical" />
      <Suspense fallback={<Skeleton className="size-10 rounded-full" />}>
        <UserHeaderActions />
      </Suspense>
    </div>
  )
}
