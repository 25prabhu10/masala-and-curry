import { category, type InsertMenuItemDB, menuItem, type UpdateMenuItemDB } from '@mac/db/schemas'
import type { DB } from '@mac/db/types'
import type { TableRowCount } from '@mac/validators/general'
import type { MenuItem, MenuItemFilters } from '@mac/validators/menu-item'
import { and, count, eq, getTableColumns, like, type SQL } from 'drizzle-orm'

import { withPagination } from './utils'

export async function getTotalMenuItemsCount(
  db: DB,
  filters: MenuItemFilters
): Promise<TableRowCount> {
  const conditions: SQL[] = []

  if (filters.availableOnly) {
    conditions.push(eq(menuItem.isAvailable, true))
  }
  if (filters.categoryId) {
    conditions.push(eq(menuItem.categoryId, filters.categoryId))
  }
  if (filters.glutenFree) {
    conditions.push(eq(menuItem.isGlutenFree, true))
  }
  if (filters.popular) {
    conditions.push(eq(menuItem.isPopular, true))
  }
  if (filters.vegan) {
    conditions.push(eq(menuItem.isVegan, true))
  }
  if (filters.vegetarian) {
    conditions.push(eq(menuItem.isVegetarian, true))
  }

  if (filters.search) {
    conditions.push(like(menuItem.name, `%${filters.search}%`))
  }

  return await db
    .select({ rowCount: count() })
    .from(menuItem)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
}

export async function getMenuItems(db: DB, filters: MenuItemFilters): Promise<MenuItem[]> {
  const conditions: SQL[] = []

  if (filters.availableOnly) {
    conditions.push(eq(menuItem.isAvailable, true))
  }
  if (filters.categoryId) {
    conditions.push(eq(menuItem.categoryId, filters.categoryId))
  }
  if (filters.glutenFree) {
    conditions.push(eq(menuItem.isGlutenFree, true))
  }
  if (filters.popular) {
    conditions.push(eq(menuItem.isPopular, true))
  }
  if (filters.vegan) {
    conditions.push(eq(menuItem.isVegan, true))
  }
  if (filters.vegetarian) {
    conditions.push(eq(menuItem.isVegetarian, true))
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

  if (filters.pageIndex || filters.pageSize) {
    return await withPagination(query.$dynamic(), filters.pageIndex, filters.pageSize)
  }

  return await query
}

export async function getMenuItemById(
  db: DB,
  id: string
  // includeVariants = false,
  // includeAllergens = false
): Promise<MenuItem | undefined> {
  const [item] = await db
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
    .where(eq(menuItem.id, id))
    .limit(1)

  // const result = {
  //   ...item[0],
  //   allergens: includeAllergens ? await getMenuItemAllergens(db, id) : undefined,
  //   variants: includeVariants ? await getMenuItemVariants(db, id) : undefined,
  // }

  return item
}

export async function createMenuItem(
  db: DB,
  data: InsertMenuItemDB
): Promise<MenuItem | undefined> {
  const [result] = await db.insert(menuItem).values(data).returning({
    id: menuItem.id,
  })

  if (result) {
    return getMenuItemById(db, result.id)
  }

  return result
}

export async function updateMenuItem(
  db: DB,
  id: string,
  data: UpdateMenuItemDB
): Promise<MenuItem | undefined> {
  const [result] = await db.update(menuItem).set(data).where(eq(menuItem.id, id)).returning({
    id: menuItem.id,
  })

  if (result) {
    return getMenuItemById(db, result.id)
  }

  return result
}

export async function deleteMenuItem(db: DB, id: string): Promise<void> {
  await db.delete(menuItem).where(eq(menuItem.id, id))
}

// export async function getMenuItemVariants(db: DB, menuItemId: string) {
//   return await db
//     .select()
//     .from(menuItemVariant)
//     .where(eq(menuItemVariant.menuItemId, menuItemId))
//     .orderBy(menuItemVariant.displayOrder, menuItemVariant.name)
// }

// export async function getMenuItemAllergens(db: DB, menuItemId: string) {
//   return await db
//     .select({
//       allergen,
//       severity: menuItemAllergen.severity,
//     })
//     .from(menuItemAllergen)
//     .leftJoin(allergen, eq(menuItemAllergen.allergenId, allergen.id))
//     .where(eq(menuItemAllergen.menuItemId, menuItemId))
//     .orderBy(allergen.name)
// }

// export async function addMenuItemAllergen(
//   db: DB,
//   menuItemId: string,
//   allergenId: string,
//   severity: string = 'contains'
// ) {
//   return await db.insert(menuItemAllergen).values({
//     allergenId,
//     menuItemId,
//     severity,
//   })
// }

// export async function removeMenuItemAllergen(db: DB, menuItemId: string, allergenId: string) {
//   return await db
//     .delete(menuItemAllergen)
//     .where(
//       and(eq(menuItemAllergen.menuItemId, menuItemId), eq(menuItemAllergen.allergenId, allergenId))
//     )
// }

// export async function getMenuItemAvailability(db: DB, menuItemId: string) {
//   return await db
//     .select()
//     .from(menuAvailability)
//     .where(eq(menuAvailability.menuItemId, menuItemId))
//     .orderBy(menuAvailability.dayOfWeek, menuAvailability.startTime)
// }

// export async function isMenuItemAvailable(
//   db: DB,
//   menuItemId: string,
//   date: Date = new Date()
// ): Promise<boolean> {
//   const dayOfWeek = date.getDay()
//   const currentTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`

//   // First check if the menu item is generally available
//   const item = await db.query.menuItem.findFirst({
//     columns: {
//       isAvailable: true,
//     },
//     where: eq(menuItem.id, menuItemId),
//   })

//   if (!item?.isAvailable) {
//     return false
//   }

//   // Then check time-based availability
//   const availability = await db
//     .select({
//       id: menuAvailability.id,
//     })
//     .from(menuAvailability)
//     .where(
//       and(
//         eq(menuAvailability.menuItemId, menuItemId),
//         eq(menuAvailability.dayOfWeek, dayOfWeek),
//         eq(menuAvailability.isActive, true),
//         lte(menuAvailability.startTime, currentTime),
//         gte(menuAvailability.endTime, currentTime)
//       )
//     )

//   return availability.length > 0
// }
