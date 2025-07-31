import { createFileRoute, Outlet } from '@tanstack/react-router'

import Header from '@/components/header'

export const Route = createFileRoute('/(app)')({
  component: RouteComponent,
  loader: ({ context }) => context.session,
})

function RouteComponent() {
  return (
    <>
      <Header />
      <hr />
      <Outlet />
    </>
  )
}
