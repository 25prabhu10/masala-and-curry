import { callbackSearchParam } from '@mac/validators/general'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Suspense } from 'react'

import { AlreadySignedIn } from '@/components/auth/already-signed-in'

export const Route = createFileRoute('/_app/(auth)')({
  component: RouteComponent,
  gcTime: 0,
  loader: async ({ context: { session } }) => session,
  validateSearch: callbackSearchParam,
})

function RouteComponent() {
  const session = Route.useLoaderData()
  const { callback } = Route.useSearch()

  return (
    <Suspense
      fallback={<div className="flex-1 flex items-center justify-center">Loading Auth...</div>}
    >
      {session ? <AlreadySignedIn callback={callback} userId={session.userId} /> : <Outlet />}
    </Suspense>
  )
}
