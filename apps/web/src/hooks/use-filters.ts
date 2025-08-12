import {
  getRouteApi,
  type RegisteredRouter,
  type RouteIds,
  useNavigate,
} from '@tanstack/react-router'

import { cleanEmptyParams } from '@/lib/clean-empty-params'

export function useFilters<T extends RouteIds<RegisteredRouter['routeTree']>>(routeId: T) {
  const routeApi = getRouteApi<T>(routeId)
  const navigate = useNavigate()
  const filters = routeApi.useSearch()

  function setFilters(partialFilters: Partial<typeof filters>) {
    return navigate({
      search: (prev) => cleanEmptyParams({ ...prev, ...partialFilters }),
      to: '.',
    })
  }

  function resetFilters() {
    return navigate({ search: {}, to: '.' })
  }

  return { filters, resetFilters, setFilters }
}
