import { getUserByIdQuery } from '@mac/queries/user'
import { Separator } from '@mac/web-ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@mac/web-ui/sidebar'
import { Skeleton } from '@mac/web-ui/skeleton'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Suspense } from 'react'

import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { ModeToggle } from '@/components/header/mode-toggle'
import { UserProfileDropdown } from '@/components/header/user-profile-dropdown'

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
  const { session } = Route.useLoaderData()

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <div className="flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center justify-between gap-4 px-4 lg:gap-6">
            <ModeToggle />
            <Separator className="h-6" orientation="vertical" />
            <Suspense fallback={<Skeleton className="size-10 rounded-full" />}>
              <UserProfileDropdown session={session} />
            </Suspense>
          </div>
        </div>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
