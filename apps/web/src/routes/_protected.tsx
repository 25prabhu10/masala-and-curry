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
  },
  component: RouteComponent,
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
