import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Suspense } from 'react'
import * as z from 'zod'

import { AlreadySignedIn } from '@/components/auth/already-signed-in'

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context, search }) => {
    if (context.session) {
      throw redirect({ href: search.callback, replace: true })
    }
  },
  component: RouteComponent,
  loader: async ({ context }) => {
    console.log('_Auth: Loader session:', context.session)

    return { session: context.session }
  },
  validateSearch: z.object({
    callback: z.string().optional(),
  }),
})

function RouteComponent() {
  const { session } = Route.useLoaderData()
  console.log('_Auth RouteComponent session:', session)

  return (
    <Suspense
      fallback={<div className="flex-1 flex items-center justify-center">Loading Auth...</div>}
    >
      {session ? <AlreadySignedIn userId={session.userId} /> : <Outlet />}
    </Suspense>
  )
}
