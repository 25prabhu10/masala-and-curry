import { getMenuItemByIdQuery } from '@mac/queries/menu-item'
import { cn } from '@mac/tailwind-config/utils'
import type { MenuItem } from '@mac/validators/menu-item'
import { Button } from '@mac/web-ui/button'
import { Checkbox } from '@mac/web-ui/checkbox'
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
import { RadioGroup, RadioGroupItem } from '@mac/web-ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@mac/web-ui/select'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

import { formatCurrencyUSD } from '@/lib/utils'
import { useCartStore } from '@/stores/cart-store'

import { QuantitySelector } from './quantity-selector'
import { SpiceLevelIndicator } from './spice-level-indicator'

interface MenuItemAddDrawerProps {
  menuItem: MenuItem
  closeButton: React.ReactNode
}

export function MenuItemAddDrawer({ menuItem, closeButton }: MenuItemAddDrawerProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [openDrawer, setDrawerOpen] = useState(false)
  const [spiceLevel, setSpiceLevel] = useState(menuItem.spiceLevel ?? 0)
  const [specialInstructions, setSpecialInstructions] = useState('')

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
  const [quantity, setQuantity] = useState(1)

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

      toast.success(`${menuItem.name} added to cart`)
      return Object.keys(payload).length ? payload : undefined
    })()

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
              <DrawerDescription>{`Choose spice level${
                optionGroups.length ? ', options and ' : ''
              }quantity to add to your cart.`}</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              {menuItem.spiceLevel ? (
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="spice-level-select">How spicy do you want it?</Label>
                    <SpiceLevelIndicator
                      className="shrink-0"
                      level={spiceLevel}
                      showLabel={false}
                      size="sm"
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex-1">
                      <Select
                        onValueChange={(value) => setSpiceLevel(Number(value))}
                        value={String(spiceLevel)}
                      >
                        <SelectTrigger aria-label="Spice level" id="spice-level-select">
                          <SelectValue placeholder="Select spice level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No Spice</SelectItem>
                          <SelectItem value="1">Mild</SelectItem>
                          <SelectItem value="2">Medium</SelectItem>
                          <SelectItem value="3">Hot</SelectItem>
                          <SelectItem value="4">Very Hot</SelectItem>
                          <SelectItem value="5">Extremely Hot</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
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
                    {optionGroups.map((group) => {
                      const selectedIds = selectedOptions[group.id] || []
                      const isSingle = group.selectionType === 'single'
                      return (
                        <div key={group.id}>
                          <h4 className="text-sm font-medium mb-2 gap-[0.25rem]">
                            {group.name}
                            {group.required ? (
                              <span className="ml-auto text-destructive">{` (required)`}</span>
                            ) : (
                              ''
                            )}
                            {group.minSelect > 1 ? (
                              <span className="ml-auto text-muted-foreground">{` (min ${group.minSelect})`}</span>
                            ) : (
                              ''
                            )}
                            {group.maxSelect > 1 ? (
                              <span className="ml-auto text-muted-foreground">
                                {` (up to ${group.maxSelect})`}
                              </span>
                            ) : (
                              ''
                            )}
                          </h4>
                          <div className="max-h-80 pr-2 overflow-y-auto">
                            {isSingle ? (
                              <div className="space-y-2">
                                <RadioGroup
                                  onValueChange={(value) => {
                                    setSelectedOptions((prev) => ({
                                      ...prev,
                                      [group.id]: value ? [value] : [],
                                    }))
                                  }}
                                  value={selectedIds[0] ?? ''}
                                >
                                  {group.options?.map((opt) => {
                                    const checked = selectedIds.includes(opt.id)
                                    return (
                                      <Label
                                        className={cn(
                                          'flex items-start gap-3 rounded-md border p-3 cursor-pointer transition-colors',
                                          checked
                                            ? 'border-primary bg-primary/5'
                                            : 'hover:border-primary/50'
                                        )}
                                        htmlFor={`${group.id}_${opt.id}`}
                                        key={opt.id}
                                      >
                                        <RadioGroupItem
                                          id={`${group.id}_${opt.id}`}
                                          value={opt.id}
                                        />{' '}
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center justify-between gap-2">
                                            <p className="text-sm font-medium leading-none">
                                              {opt.name}
                                            </p>
                                            {typeof opt.priceModifier === 'number' &&
                                            opt.priceModifier !== 0 ? (
                                              <span className="text-sm font-semibold">
                                                {`+ ${formatCurrencyUSD(opt.priceModifier, menuItem.currency)}`}
                                              </span>
                                            ) : null}
                                          </div>
                                        </div>
                                      </Label>
                                    )
                                  })}
                                </RadioGroup>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {group.options?.map((opt) => {
                                  const checked = selectedIds.includes(opt.id)
                                  return (
                                    <Label
                                      className={cn(
                                        'flex items-start gap-3 rounded-md border p-3 cursor-pointer transition-colors',
                                        checked
                                          ? 'border-primary bg-primary/5'
                                          : 'hover:border-primary/50'
                                      )}
                                      htmlFor={`${group.id}_${opt.id}`}
                                      key={opt.id}
                                    >
                                      <Checkbox
                                        checked={checked}
                                        id={`${group.id}_${opt.id}`}
                                        name={`${group.id}_${opt.id}`}
                                        onCheckedChange={(nextChecked) => {
                                          setSelectedOptions((prev) => {
                                            const prevSelected = prev[group.id] || []
                                            if (nextChecked === true) {
                                              if (prevSelected.includes(opt.id)) {
                                                return prev
                                              }
                                              if (prevSelected.length >= group.maxSelect) {
                                                return prev
                                              }
                                              return {
                                                ...prev,
                                                [group.id]: [...prevSelected, opt.id],
                                              }
                                            }
                                            return {
                                              ...prev,
                                              [group.id]: prevSelected.filter(
                                                (id) => id !== opt.id
                                              ),
                                            }
                                          })
                                        }}
                                      />{' '}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                          <p className="text-sm font-medium leading-none">
                                            {opt.name}
                                          </p>
                                          {typeof opt.priceModifier === 'number' &&
                                          opt.priceModifier !== 0 ? (
                                            <span className="text-sm font-semibold">
                                              {`+ ${formatCurrencyUSD(opt.priceModifier, menuItem.currency)}`}
                                            </span>
                                          ) : null}
                                        </div>
                                      </div>
                                    </Label>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
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
