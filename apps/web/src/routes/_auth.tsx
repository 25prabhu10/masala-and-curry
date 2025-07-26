import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Suspense } from 'react'
import * as z from 'zod'

import { AlreadySignedIn } from '@/components/auth/already-signed-in'

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context, search }) => {
    if (context.userSession) {
      throw redirect({ href: search.callback, replace: true })
    }
  },
  component: RouteComponent,
  loader: async ({ context }) => {
    const { userSession } = context
    return { userSession }
  },
  validateSearch: z.object({
    callback: z.string().optional(),
  }),
})

function RouteComponent() {
  const { userSession } = Route.useLoaderData()

  return (
    <Suspense
      fallback={<div className="flex-1 flex items-center justify-center">Loading Auth...</div>}
    >
      {userSession?.user ? <AlreadySignedIn user={userSession.user} /> : <Outlet />}
    </Suspense>
  )
}
