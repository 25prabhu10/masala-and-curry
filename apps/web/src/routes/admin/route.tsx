import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ context }) => {
    if (!context.userSession?.user) {
      throw redirect({
        search: { callback: location.href },
        to: '/sign-in',
      })
    } else if (!context.userSession?.user?.role?.includes('admin')) {
      throw redirect({
        replace: true,
        to: '/not-authorized',
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
