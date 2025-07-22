import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense>
      <Outlet />
    </Suspense>
  )
}
