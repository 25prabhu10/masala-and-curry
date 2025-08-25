import type { MenuItem } from '@mac/validators/menu-item'
import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'

export interface CartItem {
  id: string
  menuItem: MenuItem
  quantity: number
  addedAt: Date
  customizations?: {
    spiceLevel?: number
    specialInstructions?: string
    // Legacy single variant fields (kept for backward compatibility + migration)
    variantId?: string
    variantName?: string
    variantPriceModifier?: number
    // New multi-variant support
    variants?: {
      id: string
      name: string
      priceModifier?: number
    }[]
  }
}

interface CartStore {
  items: CartItem[]
  total: number
  itemCount: number

  addItem: (
    menuItem: MenuItem,
    customizations?: CartItem['customizations'],
    quantity?: number
  ) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (menuItemId: string) => number

  calculateTotal: () => number
  calculateItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    subscribeWithSelector((set, get) => {
      return {
        addItem: (menuItem, customizations, quantity = 1) => {
          set((state) => {
            // Normalize variants order for deterministic equality
            let normalized = customizations
            if (customizations?.variants) {
              normalized = {
                ...customizations,
                variants: [...customizations.variants].sort((a, b) => a.id.localeCompare(b.id)),
              }
            }
            const existingItemIndex = state.items.findIndex(
              (item) =>
                item.menuItem.id === menuItem.id &&
                JSON.stringify(item.customizations) === JSON.stringify(normalized)
            )

            let newItems: CartItem[]

            if (existingItemIndex !== -1) {
              newItems = state.items.map((item, index) =>
                index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item
              )
            } else {
              const newItem: CartItem = {
                addedAt: new Date(),
                customizations: normalized,
                id: `${menuItem.id}-${Date.now()}`,
                menuItem,
                quantity,
              }
              newItems = [...state.items, newItem]
            }

            const total = calculateTotalForItems(newItems)
            const itemCount = calculateItemCountForItems(newItems)

            return {
              itemCount,
              items: newItems,
              total,
            }
          })
        },

        calculateItemCount: () => {
          const state = get()
          return calculateItemCountForItems(state.items)
        },

        calculateTotal: () => {
          const state = get()
          return calculateTotalForItems(state.items)
        },

        clearCart: () => {
          set({
            itemCount: 0,
            items: [],
            total: 0,
          })
        },

        getItemQuantity: (menuItemId) => {
          const state = get()
          return state.items
            .filter((item) => item.menuItem.id === menuItemId)
            .reduce((total, item) => total + item.quantity, 0)
        },
        itemCount: 0,
        items: [],

        removeItem: (itemId) => {
          set((state) => {
            const newItems = state.items.filter((item) => item.id !== itemId)
            const total = calculateTotalForItems(newItems)
            const itemCount = calculateItemCountForItems(newItems)

            return {
              itemCount,
              items: newItems,
              total,
            }
          })
        },
        total: 0,

        updateQuantity: (itemId, quantity) => {
          if (quantity <= 0) {
            get().removeItem(itemId)
            return
          }

          if (quantity > 50) {
            // Business rule: max 50 items per line item
            return
          }

          set((state) => {
            const newItems = state.items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            )

            const total = calculateTotalForItems(newItems)
            const itemCount = calculateItemCountForItems(newItems)

            return {
              itemCount,
              items: newItems,
              total,
            }
          })
        },
      }
    }),
    {
      migrate: (persistedState: unknown, version) => {
        const state = persistedState as { items?: CartItem[] } | undefined
        if (version === 1 && state?.items) {
          state.items = state.items.map((item: CartItem) => {
            if (
              item.customizations &&
              !item.customizations.variants &&
              (item.customizations.variantId || item.customizations.variantName)
            ) {
              const { variantId, variantName, variantPriceModifier } = item.customizations
              return {
                ...item,
                customizations: {
                  ...item.customizations,
                  variants: variantId
                    ? [
                        {
                          id: variantId,
                          name: variantName || variantId,
                          priceModifier: variantPriceModifier,
                        },
                      ]
                    : [],
                },
              }
            }
            return item
          })
        }
        return state
      },
      name: 'masala-curry-cart',
      version: 2,
    }
  )
)

// Helper functions
function calculateTotalForItems(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const extras = item.customizations?.variants?.map((v) => v.priceModifier || 0) || []
    if (!extras.length && item.customizations?.variantPriceModifier) {
      extras.push(item.customizations.variantPriceModifier)
    }
    const unitPrice = item.menuItem.basePrice + extras.reduce((s, x) => s + x, 0)
    return total + unitPrice * item.quantity
  }, 0)
}

function calculateItemCountForItems(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0)
}

// // Subscribe to cart changes for analytics, notifications, etc.
// useCartStore.subscribe(
//   (state) => state.itemCount,
//   (itemCount, previousItemCount) => {
//     if (itemCount > previousItemCount) {
//       // Item was added to cart - could trigger notification
//     }
//   }
// )
