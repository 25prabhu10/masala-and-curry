import { getCategoriesQuery } from '@mac/queries/category'
import { getMenuItemsQuery } from '@mac/queries/menu-item'
import { menuItemFiltersValidator } from '@mac/validators/menu-item'
import { Button } from '@mac/web-ui/button'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Phone } from 'lucide-react'
import { useMemo } from 'react'

import { MenuItemCard } from '@/components/menu/menu-item-card'
import { MenuLoadingSkeleton } from '@/components/menu/menu-loading-skeleton'
import { useFilters } from '@/hooks/use-filters'
import { useCartStore } from '@/stores/cart-store'

export const Route = createFileRoute('/_app/menu')({
  beforeLoad: ({ search }) => {
    return { search }
  },
  component: RouteComponent,
  loader: async ({ context: { queryClient, search } }) => {
    await Promise.all([
      queryClient.ensureQueryData(getMenuItemsQuery(search)),
      queryClient.ensureQueryData(getCategoriesQuery()),
    ])
  },
  validateSearch: menuItemFiltersValidator,
})

function RouteComponent() {
  const { filters } = useFilters(Route.id)

  const itemCount = useCartStore((state) => state.itemCount)
  const total = useCartStore((state) => state.total)

  const {
    data: menuData,
    isLoading: isMenuLoading,
    error: menuError,
  } = useSuspenseQuery(getMenuItemsQuery(filters))

  const { data: categoriesData, isLoading: isCategoriesLoading } = useSuspenseQuery(
    getCategoriesQuery()
  )

  function formatPrice(price: number) {
    return new Intl.NumberFormat('en-US', {
      currency: 'USD',
      style: 'currency',
    }).format(price)
  }

  const isLoading = isMenuLoading || isCategoriesLoading
  // const menuItems = menuData?.result ?? []
  // const categories = categoriesData?.result ?? []

  const menuItemsPerCategory = useMemo(
    () =>
      categoriesData?.result.reduce(
        (acc, category) => {
          acc[category.id] = menuData?.result.filter((item) => item.categoryId === category.id)
          return acc
        },
        {} as Record<string, (typeof menuData)['result']>
      ),
    [categoriesData?.result, menuData?.result]
  )

  return (
    <main className="flex-1 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Masala and Curry Menu</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our authentic Indian cuisine with traditional flavors and modern twists. All
            prices include tax.
          </p>
        </div>

        {itemCount > 0 && (
          <div className="bg-primary/10 rounded-lg p-4 mb-6 flex flex-col lg:flex-row gap-2 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Cart: {itemCount} item{itemCount !== 1 ? 's' : ''}
              </div>
              <div className="text-lg font-semibold">{formatPrice(total)}</div>
            </div>
            {/* <div className="text-sm text-muted-foreground">Continue shopping or go to checkout</div> */}
            {/* <Button asChild>
              <Link aria-label="Go to checkout" from={Route.fullPath} to="/checkout">
                Checkout
              </Link>
            </Button> */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                We are building our online ordering system. In the meantime, please call us to place
                your order.
              </span>
              <Button
                asChild
                className="text-lg px-8 py-3 flex items-center"
                size="lg"
                type="button"
                variant="outline"
              >
                <a aria-label="Call Masala & Curry to place your order" href="tel:+13034841535">
                  <Phone className="mr-2 h-5 w-5" />
                  (303) 484-1535
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* <div className="bg-background rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter Menu</h2>
          <MenuFilters categories={categories} filters={filters} onFiltersChange={setFilters} />
        </div> */}

        <div className="space-y-6">
          {/* {!isLoading && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {menuData ? (
                  <>
                    Showing {menuData?.result.length} items
                    {filters?.search && (
                      <span className="ml-2">for &ldquo;{filters.search}&rdquo;</span>
                    )}
                  </>
                ) : (
                  'No items found'
                )}
              </div>
            </div>
          )} */}

          {isLoading && <MenuLoadingSkeleton count={6} />}

          {menuError && (
            <div className="text-center py-12">
              <div className="text-destructive text-lg font-medium mb-2">
                Failed to load menu items
              </div>
              <div className="text-muted-foreground">
                Please try refreshing the page or contact support if the issue persists.
              </div>
            </div>
          )}

          {!isLoading && !menuError && menuData?.result.length === 0 && (
            <div className="text-center py-12">
              <div className="text-lg font-medium mb-2">No menu items found</div>
              <div className="text-muted-foreground">
                Try adjusting your filters or search terms.
              </div>
            </div>
          )}

          {!isLoading && menuItemsPerCategory && Object.keys(menuItemsPerCategory).length > 0 && (
            <div className="mb-8">
              {Object.entries(menuItemsPerCategory).map(([categoryId, items]) => (
                <div className="mb-4" key={categoryId}>
                  <h2 className="text-xl font-semibold mb-2">
                    {categoriesData?.result.find((cat) => cat.id === categoryId)?.name}
                  </h2>
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((menuItem) => (
                      <MenuItemCard key={menuItem.id} menuItem={menuItem} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* {!isLoading && menuData?.result.length > 0 && (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {menuData?.result.map((menuItem) => (
                <MenuItemCard key={menuItem.id} menuItem={menuItem} />
              ))}
            </div>
          )} */}
        </div>

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
