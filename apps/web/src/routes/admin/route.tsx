import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    console.log('Admin route beforeLoad', context.userSession)
    if (!context.userSession?.user?.role?.includes('admin')) {
      throw redirect({
        to: '/not-authorized',
        replace: true,
        search: { callback: location.pathname + location.search },
      })
    }
  },
})

function RouteComponent() {
  return <Outlet />
}
