import { getSessionQuery } from '@mac/queries/auth'
import { Toaster } from '@mac/web-ui/sonner'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, useRouterState } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

import Header from '@/components/header'
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

function RouterSpinner() {
  const isLoading = useRouterState({ select: (s) => s.status === 'pending' })
  return isLoading ? (
    <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-b border-border/40 backdrop-blur-sm">
      <div className="container flex items-center justify-center py-3 px-4">
        <div className="flex items-center gap-3">
          <Spinner show={isLoading} />
        </div>
      </div>
    </div>
  ) : null
}

function RootLayout() {
  const { theme } = useTheme()

  return (
    <div className="min-h-svh border-2 border-border/60 flex flex-col">
      <RouterSpinner />
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
    const data = await context.queryClient.fetchQuery(
      getSessionQuery(authClient, context.queryClient)
    )

    return { session: data?.session }
  },
  component: RootLayout,
  pendingComponent: () => (
    <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-b border-border/40 backdrop-blur-sm">
      <div className="container flex items-center justify-center py-3 px-4">
        <div className="flex items-center gap-3">
          <Spinner />
        </div>
      </div>
    </div>
  ),
  wrapInSuspense: true,
})
