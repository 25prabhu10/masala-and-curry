// oxlint-disable no-console
import { QueryClient } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'

import { DefaultCatchBoundary } from '@/components/default-error-boundary'
import { NotFound } from '@/components/not-found'

import { routeTree } from './routeTree.gen'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      staleTime: 1000 * 60 * 10,
    },
  },
})

const router = createRouter({
  context: {
    queryClient,
    session: undefined,
  },
  defaultErrorComponent: DefaultCatchBoundary,
  defaultNotFoundComponent: () => <NotFound />,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  defaultStructuralSharing: true,
  routeTree,
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// TODO: Remove this when the issue is fixed
// router.subscribe('onBeforeLoad', console.log)
// router.subscribe('onBeforeNavigate', console.log)
// router.subscribe('onBeforeRouteMount', console.log)
// router.subscribe('onLoad', console.log)
// router.subscribe('onRendered', console.log)
// router.subscribe('onResolved', console.log)

export default function App() {
  return <RouterProvider router={router} />
}
