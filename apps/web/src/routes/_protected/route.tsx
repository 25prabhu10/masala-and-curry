import { getUserByIdQuery } from '@mac/queries/user'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ context, location }) => {
    if (!context.session) {
      throw redirect({
        search: {
          callback: location.href,
        },
        to: '/sign-in',
      })
    }

    return { session: context.session }
  },
  component: RouteComponent,
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(getUserByIdQuery(context.session.userId))
    return context.session
  },
})

function RouteComponent() {
  return (
    <Suspense
      fallback={<div className="flex-1 flex items-center justify-center">Loading Protected...</div>}
    >
      <Outlet />
    </Suspense>
  )
}
