import { getMenuItemByIdQuery } from '@mac/queries/menu-item'
import type { MenuItem } from '@mac/validators/menu-item'
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
import { Label } from '@mac/web-ui/label'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { getImageURL } from '@/lib/utils'
import { useCartStore } from '@/stores/cart-store'

import ImageUI from '../image-ui'
import OptionGroup from './option-group'
import QuantitySection from './quantity-section'
import { SpiceLevelSelector } from './spice-level-selector'

interface MenuItemAddDrawerProps {
  menuItem: MenuItem
  closeButton: React.ReactNode
}

export function MenuItemAddDrawer({ menuItem, closeButton }: MenuItemAddDrawerProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [openDrawer, setDrawerOpen] = useState(false)
  const [spiceLevel, setSpiceLevel] = useState(menuItem.spiceLevel ?? 0)
  const [specialInstructions, setSpecialInstructions] = useState('')

  const [quantity, setQuantity] = useState(1)
  const menuItemWithOptions = useQuery(getMenuItemByIdQuery(menuItem.id, openDrawer))

  const optionGroups = menuItemWithOptions.data?.optionGroups || []
  function getDefaultSelections() {
    const defaults: Record<string, string[]> = {}
    for (const group of optionGroups) {
      const defaultOptions = (group.options || []).filter((opt) => opt.isDefault)
      defaults[group.id] = defaultOptions.map((opt) => opt.id)
    }
    return defaults
  }

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>(
    getDefaultSelections()
  )

  const handleOptionsChange = useCallback((groupId: string, value: string[]) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [groupId]: value,
    }))
  }, [])

  function handleAdd() {
    const groupsPayload = optionGroups
      .map((group) => {
        const selectedIds = selectedOptions[group.id] || []
        const opts = (group.options || [])
          .filter((opt) => selectedIds.includes(opt.id))
          .map((opt) => ({ id: opt.id, name: opt.name, priceModifier: opt.priceModifier }))
        return { groupId: group.id, groupName: group.name, options: opts }
      })
      .filter((g) => g.options.length > 0)

    const notes = specialInstructions.trim()
    const includeSpice = Boolean(menuItem.spiceLevel)

    const customizations = (() => {
      const payload: {
        options?: {
          groupId: string
          groupName: string
          options: { id: string; name: string; priceModifier?: number }[]
        }[]
        specialInstructions?: string
        spiceLevel?: number
      } = {}
      if (groupsPayload.length) {
        payload.options = groupsPayload
      }
      if (includeSpice) {
        payload.spiceLevel = spiceLevel
      }
      if (notes) {
        payload.specialInstructions = notes
      }

      return Object.keys(payload).length ? payload : undefined
    })()

    toast.success(`${menuItem.name} added to cart`)
    addItem(menuItem, customizations, quantity)
    setQuantity(1)
    setSpecialInstructions('')
    setDrawerOpen(false)
  }

  const unitPrice = (() => {
    let modifierSum = 0
    for (const groupId of Object.keys(selectedOptions)) {
      const group = optionGroups.find((g) => g.id === groupId)
      if (group) {
        const selectedIds = selectedOptions[groupId] || []
        for (const optionId of selectedIds) {
          const option = group.options?.find((opt) => opt.id === optionId)
          modifierSum += option?.priceModifier ?? 0
        }
      }
    }
    return menuItem.basePrice + modifierSum
  })()

  return (
    <Drawer onOpenChange={setDrawerOpen} open={openDrawer}>
      <DrawerTrigger asChild>{closeButton}</DrawerTrigger>
      <DrawerContent className="max-h-[80%]">
        <div className="mx-auto w-full overflow-y-auto">
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerClose asChild>
                <Button
                  aria-label="Close"
                  className="absolute right-0 top-0 md:right-4 md:top-4"
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </DrawerClose>
              <div className="w-full h-48 overflow-hidden bg-muted">
                {menuItem.image ? (
                  <ImageUI alt={menuItem.name} url={getImageURL(menuItem.image)} />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-xs text-muted-foreground">
                    <span className="text-4xl">🍜</span>
                  </div>
                )}
              </div>
            </DrawerHeader>
            <div className="p-4 space-y-4 pt-0">
              <DrawerTitle className="text-lg sticky top-0 bg-background">
                Add {menuItem.name}
              </DrawerTitle>
              <DrawerDescription>{`Choose spice level ${
                optionGroups.length ? ', options and ' : ''
              }quantity to add to your cart.`}</DrawerDescription>
              {menuItem.spiceLevel ? (
                <SpiceLevelSelector setSpiceLevel={setSpiceLevel} spiceLevel={spiceLevel} />
              ) : null}
              {menuItemWithOptions.isLoading ? (
                <div className="p-4">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ) : (
                optionGroups.length > 0 && (
                  <div className="space-y-6">
                    {optionGroups.map((group) => (
                      <OptionGroup
                        group={group}
                        key={group.id}
                        onChange={handleOptionsChange}
                        selectedIds={selectedOptions[group.id] || []}
                      />
                    ))}
                  </div>
                )
              )}
              <div>
                <Label htmlFor="special-requests">
                  Special requests{' '}
                  <span className="text-xs text-muted-foreground"> (optional)</span>
                </Label>
                <textarea
                  aria-describedby="special-requests-hint"
                  className="mt-2 block w-full rounded-md border bg-background p-3 text-sm outline-none ring-0 focus-visible:border-primary"
                  id="special-requests"
                  maxLength={300}
                  name="special-requests"
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g., No cilantro, extra onions, allergy info."
                  rows={3}
                  value={specialInstructions}
                />
                <p className="mt-1 text-xs text-muted-foreground" id="special-requests-hint">
                  We will do our best to accommodate. No alcohol requests.
                </p>
              </div>
              <QuantitySection
                currency={menuItem.currency}
                isAvailable={menuItem.isAvailable}
                quantity={quantity}
                setQuantity={setQuantity}
                unitPrice={unitPrice}
              />
            </div>
            <DrawerFooterRoot className="mb-4">
              <Button
                disabled={!menuItem.isAvailable || menuItemWithOptions.isLoading}
                onClick={handleAdd}
                type="button"
              >
                Add to cart
              </Button>
              <DrawerClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooterRoot>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
