// oxlint-disable no-console
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { DefaultCatchBoundary } from '@/components/default-error-boundary'
import { NotFound } from '@/components/not-found'
import { Spinner } from '@/components/spinner'
import queryClient from '@/lib/query-client'
import { routeTree } from './routeTree.gen'

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    userSession: undefined,
  },
  defaultErrorComponent: DefaultCatchBoundary,
  defaultNotFoundComponent: () => <NotFound />,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  // defaultPendingComponent: () => (
  //   <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-b border-border/40 backdrop-blur-sm">
  //     <div className="container flex items-center justify-center py-3 px-4">
  //       <div className="flex items-center gap-3">
  //         <Spinner/>
  //       </div>
  //     </div>
  //   </div>
  // ),
  defaultStructuralSharing: true,
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// TODO: Remove this when the issue is fixed
router.subscribe('onBeforeLoad', console.log)
router.subscribe('onBeforeNavigate', console.log)
router.subscribe('onBeforeRouteMount', console.log)
router.subscribe('onLoad', console.log)
router.subscribe('onRendered', console.log)
router.subscribe('onResolved', console.log)

export default function App() {
  return <RouterProvider router={router} />
}
