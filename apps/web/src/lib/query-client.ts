import { MutationCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export default new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      // staleTime: 1000 * 60 * 5 // 2 minutes
    },
  },
  mutationCache: new MutationCache({
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message)
        return
      } else if (typeof error === 'string') {
        toast.error(error)
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        toast.error((error as { message: string }).message)
      }
    },
  }),
})
