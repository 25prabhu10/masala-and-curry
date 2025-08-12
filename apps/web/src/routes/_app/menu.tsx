import { getCategoriesQuery } from '@mac/queries/category'
import { getMenuItemsQuery } from '@mac/queries/menu-item'
import { menuItemFiltersValidatorWithCatch } from '@mac/validators/menu-item'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

import { MenuFilters } from '@/components/menu/menu-filters'
import MenuItemsList from '@/components/menu/menu-items-list'
import { MenuLoadingSkeleton } from '@/components/menu/menu-loading-skeleton'
import MenuTotalSelection from '@/components/menu/menu-total-selection'
import { useFilters } from '@/hooks/use-filters'

export const Route = createFileRoute('/_app/menu')({
  beforeLoad: ({ search }) => {
    return { search }
  },
  component: RouteComponent,
  loader: async ({ context: { queryClient, search } }) => {
    await Promise.all([
      queryClient.ensureQueryData(getMenuItemsQuery(search)),
      queryClient.ensureQueryData(getCategoriesQuery({ activeOnly: true })),
    ])
  },
  pendingComponent: () => (
    <div className="container">
      <MenuLoadingSkeleton />
    </div>
  ),
  validateSearch: menuItemFiltersValidatorWithCatch,
})

function RouteComponent() {
  const { filters, setFilters, resetFilters } = useFilters(Route.id)

  const { data: categoriesData } = useSuspenseQuery(getCategoriesQuery({ activeOnly: true }))

  return (
    <main className="flex-1 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
      <section className="container mx-auto px-4 py-8 space-y-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Masala and Curry Menu</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our authentic Indian cuisine with traditional flavors and modern twists. All
            prices include tax.
          </p>
        </div>
        <MenuTotalSelection />
        <MenuFilters
          categories={categoriesData.result}
          filters={filters}
          resetFilters={resetFilters}
          setFilters={setFilters}
        />

        <Suspense fallback={<MenuLoadingSkeleton />}>
          <MenuItemsList categories={categoriesData.result} filters={filters} />
        </Suspense>

        <div className="mt-12 text-center">
          <div className="text-sm text-muted-foreground">
            <p>Menu availability may vary based on time of day and ingredient availability.</p>
            <p className="mt-1">
              For orders over 50 items per dish, please contact the restaurant directly.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
