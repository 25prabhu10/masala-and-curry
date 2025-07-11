import { createRouter, ErrorComponent, RouterProvider } from '@tanstack/react-router'
import queryClient from '@/lib/query-client'
import { routeTree } from './routeTree.gen'

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
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
