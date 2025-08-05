import { getSessionQuery } from '@mac/queries/auth'
import { Toaster } from '@mac/web-ui/sonner'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

import Header from '@/components/header/header'
import { RouterLoader } from '@/components/router-loader'
import { Spinner } from '@/components/spinner'
import { useTheme } from '@/context/theme-context'
import { authClient, type Session } from '@/lib/auth-client'

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : lazy(async () => {
      const res = await import('@tanstack/react-router-devtools')
      return {
        default: res.TanStackRouterDevtools,
      }
    })

const ReactQueryDevtools = import.meta.env.PROD
  ? () => null
  : lazy(async () => {
      const res = await import('@tanstack/react-query-devtools')
      return {
        default: res.ReactQueryDevtools,
      }
    })

function RootLayout() {
  const { theme } = useTheme()

  return (
    <div className="min-h-svh overflow-auto border-2 border-border/60 flex flex-col">
      <RouterLoader />
      <Header />
      <hr />
      <Outlet />
      <Toaster richColors theme={theme} />
      <Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
      </Suspense>
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </div>
  )
}

type RouterContext = {
  queryClient: QueryClient
  session: Session | undefined | null
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context }) => {
    const data = await context.queryClient.fetchQuery(getSessionQuery(authClient))

    return { session: data?.session }
  },
  component: RootLayout,
  pendingComponent: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner />
      </div>
    </div>
  ),
  wrapInSuspense: true,
})
