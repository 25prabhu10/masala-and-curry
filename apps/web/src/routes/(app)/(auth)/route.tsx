import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Suspense } from 'react'
import * as z from 'zod'

import { AlreadySignedIn } from '@/components/auth/already-signed-in'

export const Route = createFileRoute('/(app)/(auth)')({
  component: RouteComponent,
  loader: async ({ context: { session } }) => session,
  validateSearch: z.object({
    callback: z.string().optional(),
  }),
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
