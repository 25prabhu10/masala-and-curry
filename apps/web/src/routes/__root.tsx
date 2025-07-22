import type { QueryClient } from '@tanstack/react-query'
import { getSessionQuery } from '@mac/queries/auth'
import { Toaster } from '@mac/web-ui/sonner'
import { createRootRouteWithContext, Outlet, useRouterState } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import Header from '@/components/header'
import { Spinner } from '@/components/spinner'
import { useTheme } from '@/context/theme-context'
import { authClient, type UserSession } from '@/lib/auth-client'

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : lazy(async () => {
        const res = await import('@tanstack/react-router-devtools')
        return {
          default: res.TanStackRouterDevtools,
        }
      })

const ReactQueryDevtools =
  process.env.NODE_ENV === 'production'
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
  const userSession = Route.useLoaderData()
  const { theme } = useTheme()

  console.log('User Session __Root: ', userSession)
  return (
    <div className="min-h-svh border-2 border-border/60 flex flex-col">
      <RouterSpinner />
      <Header user={userSession?.user} />
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

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  userSession: UserSession | undefined
}>()({
  component: RootLayout,
  beforeLoad: async ({ context }) => {
    try {
      console.log('+++++++++++++++++++++ Delay started')
      await new Promise((resolve) => setTimeout(resolve, 5000))
      console.log('----------------- ended')
      const userSession = await context.queryClient.fetchQuery(getSessionQuery(authClient))
      console.log('======================= Fetch completed')
      return { userSession }
    } catch (error) {
      console.log('API --> Error: ', error)
    }
  },
  loader: ({ context }) => context.userSession,
})
