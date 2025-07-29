import { getUserByIdQuery } from '@mac/queries/user'
import { SidebarProvider, SidebarTrigger } from '@mac/web-ui/sidebar'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { AppSidebar } from '@/components/app-sidebar'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ context: { session, queryClient } }) => {
    if (!session) {
      throw redirect({
        search: { callback: location.href },
        to: '/sign-in',
      })
    }

    const user = await queryClient.fetchQuery(getUserByIdQuery(session.userId))

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
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
