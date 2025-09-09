import { cn } from '@mac/tailwind-config/utils'
import type { MenuItem } from '@mac/validators/menu-item'
import { Button } from '@mac/web-ui/button'
import { Card, CardContent, CardHeader } from '@mac/web-ui/card'
import { Plus, Star } from 'lucide-react'

import { formatCurrencyUSD, getImageURL } from '@/lib/utils'
import { useCartStore } from '@/stores/cart-store'

import ImageUI from '../image-ui'
import { DietaryTags } from './dietary-tags'
import { MenuItemAddDrawer } from './menu-item-add-drawer'
import { SpiceLevelIndicator } from './spice-level-indicator'

interface MenuItemCardProps {
  menuItem: MenuItem
  className?: string
}

export function MenuItemCard({ menuItem, className }: MenuItemCardProps) {
  const getItemQuantity = useCartStore((state) => state.getItemQuantity)
  const currentCartQuantity = getItemQuantity(menuItem.id)

  return (
    <Card
      className={cn(
        'group grid gap-2 overflow-hidden rounded-lg border bg-background motion-safe:transition-shadow motion-safe:duration-200 hover:shadow-md',
        className
      )}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden">
          {menuItem.image ? (
            <ImageUI alt={menuItem.name} url={getImageURL(menuItem.image)} />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground bg-muted">
              <span aria-hidden className="text-4xl">
                🍜
              </span>
            </div>
          )}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-black/0"
          />
          {menuItem.isPopular && (
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-accent/90 px-2 py-0.5 text-accent-foreground backdrop-blur-sm">
              <Star className="h-3 w-3 fill-current" />
              <span className="text-[10px] font-medium">Popular</span>
            </div>
          )}
          <div className="absolute right-2 top-2 rounded-md bg-background/80 px-2 py-1 text-sm font-semibold text-foreground shadow-sm backdrop-blur-sm">
            {formatCurrencyUSD(menuItem.basePrice, menuItem.currency)}
          </div>
          <MenuItemAddDrawer
            closeButton={
              <div className="absolute bottom-2 right-2">
                <Button
                  aria-label={
                    currentCartQuantity > 0
                      ? `Add more ${menuItem.name}. Currently ${currentCartQuantity} in cart.`
                      : `Add ${menuItem.name} to cart`
                  }
                  className="relative h-10 w-10 rounded-full shadow-md"
                  disabled={!menuItem.isAvailable}
                  size="icon"
                  type="button"
                >
                  <Plus className="h-5 w-5" />
                  <span className="sr-only">Add {menuItem.name}</span>
                  {currentCartQuantity > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground">
                      {currentCartQuantity}
                    </span>
                  )}
                </Button>
              </div>
            }
            menuItem={menuItem}
          />
        </div>
      </CardHeader>

      <CardContent className="p-2">
        <div className="grid gap-1 p-3 pt-0">
          <h3 className="text-sm font-semibold leading-tight truncate" title={menuItem.name}>
            {menuItem.name}
          </h3>
          {menuItem.description && (
            <p className="text-xs text-muted-foreground truncate" title={menuItem.description}>
              {menuItem.description}
            </p>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <DietaryTags
              isGlutenFree={menuItem.isGlutenFree}
              isVegan={menuItem.isVegan}
              isVegetarian={menuItem.isVegetarian}
              maxDisplay={3}
              size="sm"
            />
            {(menuItem.spiceLevel ?? 0) > 0 && (
              <SpiceLevelIndicator level={menuItem.spiceLevel ?? 0} showLabel={false} size="sm" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
