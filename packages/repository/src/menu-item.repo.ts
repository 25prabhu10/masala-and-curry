import { category, menuItem, menuOption, menuOptionGroup } from '@mac/db/schemas'
import type { DB } from '@mac/db/types'
import type { TableRowCount } from '@mac/validators/general'
import type {
  CreateMenuItem,
  MenuItem,
  MenuItemFilters,
  UpdateMenuItem,
} from '@mac/validators/menu-item'
import { and, asc, count, desc, eq, getTableColumns, like, type SQL } from 'drizzle-orm'

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

  if (filters.sortBy && filters.sortBy.length > 0 && typeof filters.sortBy !== 'string') {
    const orderByColumns = filters.sortBy.map(({ column, direction }) => {
      const columnRef = menuItem[column]
      return direction === 'desc' ? desc(columnRef) : asc(columnRef)
    })

    query.orderBy(...orderByColumns)
  }

  if (filters.pageIndex || filters.pageSize) {
    return await withPagination(query.$dynamic(), filters.pageIndex, filters.pageSize)
  }

  return await query.all()
}

export async function getMenuItemById(db: DB, id: string): Promise<MenuItem | undefined> {
  return (await db.query.menuItem.findFirst({
    where: eq(menuItem.id, id),
    with: {
      category: {
        columns: {
          displayOrder: true,
          id: true,
          name: true,
        },
      },
      optionGroups: {
        with: {
          options: true,
        },
      },
    },
  })) as MenuItem | undefined
}

export async function createMenuItem(db: DB, data: CreateMenuItem): Promise<MenuItem | undefined> {
  const [result] = await db.insert(menuItem).values(data).returning({
    id: menuItem.id,
  })

  if (result && data.optionGroups && data.optionGroups.length > 0) {
    const newOptionGroups = data.optionGroups.map((g) => ({
      ...g,
      menuItemId: result.id,
    }))

    const createdGroups = await db.insert(menuOptionGroup).values(newOptionGroups).returning({
      id: menuOptionGroup.id,
      name: menuOptionGroup.name,
    })

    await Promise.all(
      createdGroups.map((g) => {
        const group = newOptionGroups.find((grp) => grp.name === g.name)
        if (group?.options && group.options.length > 0) {
          return db.insert(menuOption).values(
            group.options.map((o) => ({
              ...o,
              groupId: g.id,
            }))
          )
        }
      })
    )
  }

  if (result) {
    return getMenuItemById(db, result.id)
  }

  return result
}

export async function updateMenuItem(
  db: DB,
  id: string,
  data: UpdateMenuItem
): Promise<MenuItem | undefined> {
  const [result] = await db.update(menuItem).set(data).where(eq(menuItem.id, id)).returning({
    id: menuItem.id,
  })

  if (result) {
    if (data.optionGroups && data.optionGroups.length > 0) {
      const existingOptionGroups = data.optionGroups.filter((g) => g.id)
      const newOptionGroups = data.optionGroups.filter((g) => !g.id)

      if (existingOptionGroups.length > 0) {
        await Promise.all(
          existingOptionGroups.map((g) =>
            db
              .update(menuOptionGroup)
              .set(g)
              // oxlint-disable-next-line no-non-null-assertion
              .where(and(eq(menuOptionGroup.id, g.id!), eq(menuOptionGroup.menuItemId, id)))
          )
        )

        await Promise.all(
          existingOptionGroups.map((g) => {
            if (g.options && g.options.length > 0) {
              const existingOptions = g.options.filter((o) => o.id)
              const newOptions = g.options.filter((o) => !o.id)

              if (existingOptions.length > 0) {
                return Promise.all(
                  existingOptions.map((o) =>
                    db
                      .update(menuOption)
                      .set(o)
                      // oxlint-disable-next-line no-non-null-assertion
                      .where(and(eq(menuOption.id, o.id!), eq(menuOption.groupId, g.id!)))
                  )
                )
              }

              if (newOptions.length > 0) {
                db.insert(menuOption).values(
                  newOptions.map((o) => ({
                    caloriesModifier: o.caloriesModifier,
                    displayOrder: o.displayOrder,
                    // oxlint-disable-next-line no-non-null-assertion
                    groupId: g.id!,
                    isAvailable: o.isAvailable,
                    isDefault: o.isDefault,
                    name: o.name ?? '',
                    priceModifier: o.priceModifier,
                  }))
                )
              }
            }
          })
        )
      }

      if (newOptionGroups.length > 0) {
        const createdGroups = await db
          .insert(menuOptionGroup)
          .values(
            newOptionGroups.map((g) => ({
              ...g,
              menuItemId: id,
              name: g.name ?? '',
            }))
          )
          .returning({
            id: menuOptionGroup.id,
          })

        await Promise.all(
          createdGroups.map((g) => {
            const group = newOptionGroups.find((grp) => grp.id === g.id)
            if (group?.options && group.options.length > 0) {
              return db.insert(menuOption).values(
                group.options.map((o) => ({
                  caloriesModifier: o.caloriesModifier,
                  displayOrder: o.displayOrder,
                  // oxlint-disable-next-line no-non-null-assertion
                  groupId: g.id!,
                  isAvailable: o.isAvailable,
                  isDefault: o.isDefault,
                  name: o.name ?? '',
                  priceModifier: o.priceModifier,
                }))
              )
            }
          })
        )
      }
    }

    return getMenuItemById(db, result.id)
  }

  return result
}

export async function deleteMenuItem(db: DB, id: string): Promise<void> {
  await db.delete(menuItem).where(eq(menuItem.id, id))
}

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
