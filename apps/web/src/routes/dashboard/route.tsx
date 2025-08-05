import { getUserByIdQuery } from '@mac/queries/user'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@mac/web-ui/sidebar'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'

export const Route = createFileRoute('/dashboard')({
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

    return { session, user }
  },
  component: RouteComponent,
  // oxlint-disable-next-line arrow-body-style
  loader: async ({ context: { session, user } }) => ({ session, user }),
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </div>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
