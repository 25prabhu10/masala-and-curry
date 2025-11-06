import { getMenuItemsQuery } from '@mac/queries/menu-item'
import type { Category } from '@mac/validators/category'
import type { MenuItemFiltersWithCatch } from '@mac/validators/menu-item'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { MenuItemCard } from './menu-item-card'

export default function MenuItemsList({
  categories,
  filters,
}: {
  categories: Category[]
  filters: MenuItemFiltersWithCatch
}) {
  const { data: menuData } = useSuspenseQuery(getMenuItemsQuery(filters))

  const menuItemsPerCategory = useMemo(
    () =>
      categories.reduce(
        (acc, category) => {
          const filteredItems = menuData?.result.filter((item) => item.categoryId === category.id)
          if (filteredItems.length > 0) {
            acc[category.id] = filteredItems
          }
          return acc
        },
        {} as Record<string, (typeof menuData)['result']>
      ),
    [categories, menuData?.result]
  )
  return menuItemsPerCategory && Object.keys(menuItemsPerCategory).length > 0 ? (
    <div>
      {Object.entries(menuItemsPerCategory).map(([categoryId, items]) => (
        <div className="mb-4" key={categoryId}>
          <h2 className="text-xl font-semibold mb-2">
            {categories.find((cat) => cat.id === categoryId)?.name}
          </h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {items.map((menuItem) => (
              <MenuItemCard key={menuItem.id} menuItem={menuItem} />
            ))}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-12">
      <p className="text-lg font-medium mb-2">No menu items found</p>
      <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
    </div>
  )
}
