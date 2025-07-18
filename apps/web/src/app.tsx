import { createRouter, RouterProvider } from '@tanstack/react-router'
import { DefaultCatchBoundary } from '@/components/default-error-boundary'
import { NotFound } from '@/components/not-found'
import queryClient from '@/lib/query-client'
import { routeTree } from './routeTree.gen'

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultErrorComponent: DefaultCatchBoundary,
  defaultNotFoundComponent: () => <NotFound />,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  return <RouterProvider router={router} />
}
