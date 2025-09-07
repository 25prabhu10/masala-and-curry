import { cn } from '@mac/tailwind-config/utils'
import type { MenuItem } from '@mac/validators/menu-item'
import { Button } from '@mac/web-ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@mac/web-ui/card'
import { Clock, ShoppingCart, Star } from 'lucide-react'

import { formatCurrencyUSD, formatPrepTime } from '@/lib/utils'
import { useCartStore } from '@/stores/cart-store'

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
        'flex flex-col justify-between group motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:shadow-lg',
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg font-semibold leading-tight">{menuItem.name}</CardTitle>
              {menuItem.isPopular && (
                <div className="flex items-center gap-1 px-2 py-1 bg-accent text-accent-foreground rounded-full">
                  <Star className="h-3 w-3 fill-current" />
                  <span className="text-xs font-medium">Popular</span>
                </div>
              )}
            </div>

            {menuItem.description && (
              <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                {menuItem.description}
              </CardDescription>
            )}
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-xl font-bold text-primary">
              {formatCurrencyUSD(menuItem.basePrice, menuItem.currency)}
            </div>
            {!menuItem.isAvailable && (
              <div className="text-xs text-destructive font-medium mt-1">Unavailable</div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3">
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

          {menuItem.preparationTime && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-xs">{formatPrepTime(menuItem.preparationTime)}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {menuItem.ingredients && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Ingredients</h4>
            <p className="text-sm text-muted-foreground">{menuItem.ingredients}</p>
          </div>
        )}

        {menuItem.calories && (
          <div className="mb-4">
            <span className="text-sm text-muted-foreground">
              {menuItem.calories} calories per serving
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="w-full flex items-center justify-between gap-3 pt-3 border-t">
          {currentCartQuantity > 0 ? (
            <span className="text-sm text-muted-foreground">{currentCartQuantity} in cart</span>
          ) : (
            <span className="text-sm text-muted-foreground">&nbsp;</span>
          )}
          <MenuItemAddDrawer
            closeButton={
              <Button
                className="flex items-center gap-2 min-w-[140px]"
                disabled={!menuItem.isAvailable}
                size="sm"
              >
                <ShoppingCart className="h-4 w-4" />
                {menuItem.variants?.length ? 'Select Options' : 'Add to Cart'}
              </Button>
            }
            menuItem={menuItem}
          />
        </div>
      </CardFooter>
    </Card>
  )
}
