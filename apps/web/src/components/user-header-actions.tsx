import { getSessionQuery } from '@mac/queries/auth'
import { Skeleton } from '@mac/web-ui/skeleton'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'

import { authClient } from '@/lib/auth-client'

import { AuthButtons } from './auth-buttons'
import { UserProfileDropdown } from './user-profile-dropdown'

export function UserHeaderActions() {
  const queryClient = useQueryClient()
  const { data: session } = useSuspenseQuery(getSessionQuery(authClient, queryClient))

  return session ? (
    <Suspense fallback={<Skeleton className="size-10 rounded-full" />}>
      <UserProfileDropdown session={session} />
    </Suspense>
  ) : (
    <AuthButtons />
  )
}
