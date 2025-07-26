// oxlint-disable no-console
import { createRouter, RouterProvider } from '@tanstack/react-router'

import { DefaultCatchBoundary } from '@/components/default-error-boundary'
import { NotFound } from '@/components/not-found'
import queryClient from '@/lib/query-client'

import { routeTree } from './routeTree.gen'

const router = createRouter({
  context: {
    queryClient,
    userSession: null,
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
