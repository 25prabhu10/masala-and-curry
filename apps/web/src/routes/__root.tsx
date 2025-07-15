import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link className="[&.active]:font-bold" to="/">
          Home
        </Link>{' '}
        <Link className="[&.active]:font-bold" to="/about">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools />
    </>
  ),
})
