import { getUserByIdQuery } from '@mac/queries/user'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({
        search: { callback: location.href },
        to: '/sign-in',
      })
    }

    const user = await context.queryClient.fetchQuery(getUserByIdQuery(context.session.userId))

    if (!user.role?.includes('admin')) {
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
