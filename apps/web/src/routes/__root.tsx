import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@mac/web-ui/sonner'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Header from '@/components/header'
import { useTheme } from '@/context/theme-context'

function RootLayout() {
  const { theme } = useTheme()
  return (
    <div className="min-h-svh border-2 border-border/60 flex flex-col">
      <Header />
      <hr />
      <Outlet />
      <Toaster richColors theme={theme} />
      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools />
    </div>
  )
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
})
