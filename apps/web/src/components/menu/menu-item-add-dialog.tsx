import { cn } from '@mac/tailwind-config/utils'
import type { MenuItem } from '@mac/validators/menu-item'
import type { MenuItemVariant } from '@mac/validators/menu-item-variant'
import { Button } from '@mac/web-ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@mac/web-ui/dialog'
import { useState } from 'react'

import { formatCurrencyUSD } from '@/lib/utils'
import { useCartStore } from '@/stores/cart-store'

import { QuantitySelector } from './quantity-selector'

interface MenuItemAddDialogProps {
  menuItem: MenuItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MenuItemAddDialog({ menuItem, open, onOpenChange }: MenuItemAddDialogProps) {
  const addItem = useCartStore((s) => s.addItem)

  const hasVariants = (menuItem.variants?.length ?? 0) > 0
  const defaultVariant = menuItem.variants?.find((v) => v.isDefault) || menuItem.variants?.[0]
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(defaultVariant?.id)
  const [quantity, setQuantity] = useState(1)

  function handleAdd() {
    const variant: MenuItemVariant | undefined = menuItem.variants?.find(
      (v) => v.id === selectedVariantId
    )
    addItem(
      menuItem,
      {
        variantId: variant?.id,
        variantName: variant?.name,
        variantPriceModifier: variant?.priceModifier,
      },
      quantity
    )
    setQuantity(1)
    onOpenChange(false)
  }

  const unitPrice = (() => {
    const variant = menuItem.variants?.find((v) => v.id === selectedVariantId)
    const modifier = variant?.priceModifier ?? 0
    return menuItem.basePrice + modifier
  })()

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">Add {menuItem.name}</DialogTitle>
          <DialogDescription>
            Choose {hasVariants ? 'a variant and ' : ''}quantity to add to your cart.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {hasVariants && (
            <div>
              <h4 className="text-sm font-medium mb-2">Variants</h4>
              <div className="max-h-60 pr-2 overflow-y-auto">
                <div className="space-y-2">
                  {menuItem.variants?.map((variant) => {
                    const price = menuItem.basePrice + (variant.priceModifier || 0)
                    return (
                      <label
                        className={cn(
                          'flex items-start gap-3 rounded-md border p-3 cursor-pointer transition-colors',
                          selectedVariantId === variant.id
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-primary/50'
                        )}
                        htmlFor={variant.id}
                        key={variant.id}
                        onClick={() => {
                          setSelectedVariantId(variant.id)
                        }}
                      >
                        <input
                          checked={selectedVariantId === variant.id}
                          className="mt-1 h-4 w-4 border-primary text-primary focus:ring-primary"
                          id={variant.id}
                          name="variant"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (e.target.checked) {
                              setSelectedVariantId(variant.id)
                            }
                          }}
                          type="radio"
                          value={variant.id}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium leading-none">{variant.name}</p>
                            <span className="text-sm font-semibold">
                              {formatCurrencyUSD(price, menuItem.currency)}
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
                Subtotal: {formatCurrencyUSD(unitPrice * quantity, menuItem.currency)}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button onClick={() => onOpenChange(false)} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={!menuItem.isAvailable} onClick={handleAdd} type="button">
            Add to cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
