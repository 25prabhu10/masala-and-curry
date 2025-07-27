// oxlint-disable no-console

import { MutationCache, QueryClient } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'

import { DefaultCatchBoundary } from '@/components/default-error-boundary'
import { NotFound } from '@/components/not-found'

import { useAuthSession } from './context/auth-context'
import { routeTree } from './routeTree.gen'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      // staleTime: 1000 * 60 * 5 // 2 minutes
    },
  },
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      console.log('I am called Last')

      // https://tkdodo.eu/blog/automatic-query-invalidation-after-mutations
      queryClient.invalidateQueries({
        queryKey: mutation.options.mutationKey,
      })
    },
  }),
})

const router = createRouter({
  context: {
    isAuthLoading: false,
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
  const { isAuthLoading, session } = useAuthSession()

  console.log('App: useUserSession isAuthLoading:', isAuthLoading)
  console.log('App: I am using session', JSON.stringify(session, null, 2))

  return <RouterProvider context={{ isAuthLoading, session }} router={router} />
}
