import {
  allergen,
  category,
  type InsertMenuItemDB,
  menuAvailability,
  menuItem,
  menuItemAllergen,
  menuItemVariant,
  type UpdateMenuItemDB,
} from '@mac/db/schemas'
import type { DB } from '@mac/db/types'
import type { MenuItemFilters } from '@mac/validators/menu-item'
import { and, eq, getTableColumns, gte, like, lte, type SQL } from 'drizzle-orm'

import { withPagination } from './utils'

export async function getMenuItems(db: DB, filters: MenuItemFilters = {}) {
  const conditions: SQL[] = []

  if (filters.categoryId) {
    conditions.push(eq(menuItem.categoryId, filters.categoryId))
  }

  if (filters.availableOnly) {
    conditions.push(eq(menuItem.isAvailable, true))
  }

  if (filters.popular) {
    conditions.push(eq(menuItem.isPopular, true))
  }

  if (filters.vegetarian) {
    conditions.push(eq(menuItem.isVegetarian, true))
  }

  if (filters.vegan) {
    conditions.push(eq(menuItem.isVegan, true))
  }

  if (filters.glutenFree) {
    conditions.push(eq(menuItem.isGlutenFree, true))
  }

  if (filters.search) {
    conditions.push(like(menuItem.name, `%${filters.search}%`))
  }

  const query = db
    .select({
      category: {
        displayOrder: category.displayOrder,
        id: category.id,
        name: category.name,
      },
      ...getTableColumns(menuItem),
    })
    .from(menuItem)
    .leftJoin(category, eq(menuItem.categoryId, category.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(category.displayOrder, menuItem.displayOrder, menuItem.name)
    .$dynamic()

  return await withPagination(query, filters.pageIndex, filters.pageSize)
}

export async function getMenuItemVariants(db: DB, menuItemId: string) {
  return await db
    .select()
    .from(menuItemVariant)
    .where(eq(menuItemVariant.menuItemId, menuItemId))
    .orderBy(menuItemVariant.displayOrder, menuItemVariant.name)
}

export async function getMenuItemById(
  db: DB,
  id: string,
  includeVariants = false,
  includeAllergens = false
) {
  const item = await db
    .select({
      category: {
        id: category.id,
        name: category.name,
      },
      menuItem,
    })
    .from(menuItem)
    .leftJoin(category, eq(menuItem.categoryId, category.id))
    .where(eq(menuItem.id, id))
    .limit(1)

  if (!item || item.length === 0) {
    return null
  }

  const result = {
    ...item[0],
    allergens: includeAllergens ? await getMenuItemAllergens(db, id) : undefined,
    variants: includeVariants ? await getMenuItemVariants(db, id) : undefined,
  }

  return result
}

export async function createMenuItem(db: DB, data: InsertMenuItemDB) {
  return await db.insert(menuItem).values(data).returning()
}

export async function updateMenuItem(db: DB, id: string, data: UpdateMenuItemDB) {
  return await db.update(menuItem).set(data).where(eq(menuItem.id, id)).returning()
}

export async function deleteMenuItem(db: DB, id: string) {
  return await db.delete(menuItem).where(eq(menuItem.id, id))
}

export async function getMenuItemAllergens(db: DB, menuItemId: string) {
  return await db
    .select({
      allergen,
      severity: menuItemAllergen.severity,
    })
    .from(menuItemAllergen)
    .leftJoin(allergen, eq(menuItemAllergen.allergenId, allergen.id))
    .where(eq(menuItemAllergen.menuItemId, menuItemId))
    .orderBy(allergen.name)
}

export async function addMenuItemAllergen(
  db: DB,
  menuItemId: string,
  allergenId: string,
  severity: string = 'contains'
) {
  return await db.insert(menuItemAllergen).values({
    allergenId,
    menuItemId,
    severity,
  })
}

export async function removeMenuItemAllergen(db: DB, menuItemId: string, allergenId: string) {
  return await db
    .delete(menuItemAllergen)
    .where(
      and(eq(menuItemAllergen.menuItemId, menuItemId), eq(menuItemAllergen.allergenId, allergenId))
    )
}

export async function getMenuItemAvailability(db: DB, menuItemId: string) {
  return await db
    .select()
    .from(menuAvailability)
    .where(eq(menuAvailability.menuItemId, menuItemId))
    .orderBy(menuAvailability.dayOfWeek, menuAvailability.startTime)
}

export async function isMenuItemAvailable(
  db: DB,
  menuItemId: string,
  date: Date = new Date()
): Promise<boolean> {
  const dayOfWeek = date.getDay()
  const currentTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`

  // First check if the menu item is generally available
  const item = await db.query.menuItem.findFirst({
    columns: {
      isAvailable: true,
    },
    where: eq(menuItem.id, menuItemId),
  })

  if (!item?.isAvailable) {
    return false
  }

  // Then check time-based availability
  const availability = await db
    .select({
      id: menuAvailability.id,
    })
    .from(menuAvailability)
    .where(
      and(
        eq(menuAvailability.menuItemId, menuItemId),
        eq(menuAvailability.dayOfWeek, dayOfWeek),
        eq(menuAvailability.isActive, true),
        lte(menuAvailability.startTime, currentTime),
        gte(menuAvailability.endTime, currentTime)
      )
    )

  return availability.length > 0
}
