import { getSessionQuery } from '@mac/queries/auth'
import { Toaster } from '@mac/web-ui/sonner'
import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import React from 'react'
import Header from '@/components/header'
import { useTheme } from '@/context/theme-context'
import { authClient, type UserSession } from '@/lib/auth-client'

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : React.lazy(async () => {
        const res = await import('@tanstack/react-router-devtools')
        return {
          default: res.TanStackRouterDevtools,
        }
      })

const ReactQueryDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : React.lazy(async () => {
        const res = await import('@tanstack/react-query-devtools')
        return {
          default: res.ReactQueryDevtools,
        }
      })

function RootLayout() {
  const { theme } = useTheme()
  return (
    <div className="min-h-svh border-2 border-border/60 flex flex-col">
      <Header />
      <hr />
      <Outlet />
      <Toaster richColors theme={theme} />
      <React.Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
      </React.Suspense>
      <React.Suspense>
        <TanStackRouterDevtools />
      </React.Suspense>
    </div>
  )
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  userSession: UserSession | undefined
}>()({
  component: RootLayout,
  beforeLoad: async ({ context }) => {
    const userSession = await context.queryClient.fetchQuery(getSessionQuery(authClient))
    return { userSession }
  },
})
