import { getUserByIdQuery } from '@mac/queries/user'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/(app)/(protected)')({
  beforeLoad: async ({ context: { session }, location }) => {
    if (!session) {
      throw redirect({
        search: {
          callback: location.href,
        },
        to: '/sign-in',
      })
    }

    return { session }
  },
  component: RouteComponent,
  loader: async ({ context: { queryClient, session } }) => {
    await queryClient.ensureQueryData(getUserByIdQuery(session.userId))
    return session
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
