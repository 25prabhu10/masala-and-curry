import { cn } from '@mac/tailwind-config/utils'
import type { MenuItem } from '@mac/validators/menu-item'
import type { MenuItemVariant } from '@mac/validators/menu-item-variant'
import { Button } from '@mac/web-ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter as DrawerFooterRoot,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@mac/web-ui/drawer'
import { X } from 'lucide-react'
import React, { useState } from 'react'

import { formatCurrencyUSD } from '@/lib/utils'
import { useCartStore } from '@/stores/cart-store'

import { QuantitySelector } from './quantity-selector'

interface MenuItemAddDrawerProps {
  menuItem: MenuItem
  closeButton?: React.ReactNode
}

export function MenuItemAddDrawer({ menuItem, closeButton }: MenuItemAddDrawerProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [openDrawer, setDrawerOpen] = useState(false)

  const hasVariants = (menuItem.variants?.length ?? 0) > 0
  const defaultVariants = (menuItem.variants || []).filter((v) => v.isDefault)
  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>(
    defaultVariants.map((v) => v.id)
  )
  const [quantity, setQuantity] = useState(1)

  function handleAdd() {
    const variants: MenuItemVariant[] =
      menuItem.variants?.filter((v) => selectedVariantIds.includes(v.id)) || []
    addItem(
      menuItem,
      variants.length
        ? {
            variants: variants.map((v) => {
              return {
                id: v.id,
                name: v.name,
                priceModifier: v.priceModifier,
              }
            }),
          }
        : undefined,
      quantity
    )
    setQuantity(1)
    setDrawerOpen(false)
  }

  const unitPrice = (() => {
    const modifiers =
      menuItem.variants
        ?.filter((v) => selectedVariantIds.includes(v.id))
        .map((v) => v.priceModifier || 0) || []
    const modifierSum = modifiers.reduce((s, x) => s + x, 0)
    return menuItem.basePrice + modifierSum
  })()

  return (
    <Drawer onOpenChange={setDrawerOpen} open={openDrawer}>
      <DrawerTrigger asChild>
        {closeButton ?? <Button variant="outline">Open Drawer</Button>}
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerClose asChild>
            <Button
              aria-label="Close"
              className="absolute right-4 top-4"
              size="icon"
              type="button"
              variant="ghost"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DrawerClose>
          <DrawerHeader>
            <DrawerTitle className="text-lg">Add {menuItem.name}</DrawerTitle>
            <DrawerDescription>
              {`Choose ${hasVariants ? 'a variant and ' : ''}quantity to add to your cart.`}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            {hasVariants && (
              <div>
                <h4 className="text-sm font-medium mb-2">Variants (select any)</h4>
                <div className="max-h-svh pr-2 overflow-y-auto">
                  <div className="space-y-2">
                    {menuItem.variants?.map((variant) => {
                      const price = variant.priceModifier ?? 0
                      const checked = selectedVariantIds.includes(variant.id)
                      return (
                        <label
                          className={cn(
                            'flex items-start gap-3 rounded-md border p-3 cursor-pointer transition-colors',
                            checked ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                          )}
                          htmlFor={variant.id}
                          key={variant.id}
                        >
                          <input
                            checked={checked}
                            className="mt-1 h-4 w-4 border-primary text-primary focus:ring-primary"
                            id={variant.id}
                            name="variants"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setSelectedVariantIds((prev) =>
                                e.target.checked
                                  ? [...prev, variant.id]
                                  : prev.filter((id) => id !== variant.id)
                              )
                            }}
                            type="checkbox"
                            value={variant.id}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium leading-none">{variant.name}</p>
                              <span className="text-sm font-semibold">
                                {`+ ${formatCurrencyUSD(price, menuItem.currency)}`}
                              </span>
                            </div>
                            {variant.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {variant.description}
                              </p>
                            )}
                            {variant.servingSize && (
                              <p className="text-[10px] text-muted-foreground mt-1">
                                {variant.servingSize}
                              </p>
                            )}
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t">
              <QuantitySelector
                disabled={!menuItem.isAvailable}
                onChange={setQuantity}
                value={quantity}
              />
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Unit Price</p>
                <p className="font-semibold">{formatCurrencyUSD(unitPrice, menuItem.currency)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {`Subtotal: ${formatCurrencyUSD(unitPrice * quantity, menuItem.currency)}`}
                </p>
              </div>
            </div>
          </div>
          <DrawerFooterRoot>
            <Button disabled={!menuItem.isAvailable} onClick={handleAdd} type="button">
              Add to cart
            </Button>
          </DrawerFooterRoot>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
