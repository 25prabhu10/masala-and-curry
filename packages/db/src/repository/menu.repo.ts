import { and, eq, gte, like, lte, sql } from 'drizzle-orm'

import type { DB } from '../index'
import {
  allergen,
  category,
  menuAvailability,
  menuItem,
  menuItemAllergen,
  menuItemVariant,
} from '../schemas'
import type { InsertCategoryDB, UpdateCategoryDB } from '../schemas/category.schema'
import type { InsertMenuItemDB, UpdateMenuItemDB } from '../schemas/menu-item.schema'
import type {
  InsertMenuItemVariantDB,
  UpdateMenuItemVariantDB,
} from '../schemas/menu-item-variant.schema'
import { generatePublicId, withPagination } from '../utils'

type MenuFilters = {
  categoryId?: string
  availableOnly?: boolean
  popular?: boolean
  vegetarian?: boolean
  vegan?: boolean
  glutenFree?: boolean
  search?: string
  page?: number
  pageSize?: number
}

export async function getCategories(db: DB, activeOnly = true, page?: number, pageSize?: number) {
  const query = db
    .select()
    .from(category)
    .where(activeOnly ? eq(category.isActive, true) : undefined)
    .orderBy(category.displayOrder, category.name)

  return await withPagination(query.$dynamic(), page, pageSize)
}

export async function getCategoryById(db: DB, id: string) {
  return await db.query.category.findFirst({
    where: eq(category.id, id),
  })
}

export async function createCategory(db: DB, data: InsertCategoryDB) {
  return await db
    .insert(category)
    .values({
      ...data,
      id: generatePublicId(),
    })
    .returning()
}

export async function updateCategory(db: DB, id: string, data: UpdateCategoryDB) {
  return await db.update(category).set(data).where(eq(category.id, id)).returning()
}

export async function deleteCategory(db: DB, id: string) {
  return await db.delete(category).where(eq(category.id, id))
}

export async function getMenuItems(db: DB, options: MenuFilters = {}) {
  const conditions = []

  if (options.categoryId) {
    conditions.push(eq(menuItem.categoryId, options.categoryId))
  }

  if (options.availableOnly) {
    conditions.push(eq(menuItem.isAvailable, true))
  }

  if (options.popular) {
    conditions.push(eq(menuItem.isPopular, true))
  }

  if (options.vegetarian) {
    conditions.push(eq(menuItem.isVegetarian, true))
  }

  if (options.vegan) {
    conditions.push(eq(menuItem.isVegan, true))
  }

  if (options.glutenFree) {
    conditions.push(eq(menuItem.isGlutenFree, true))
  }

  if (options.search) {
    conditions.push(like(menuItem.name, `%${options.search}%`))
  }

  const query = db
    .select({
      category: {
        displayOrder: category.displayOrder,
        id: category.id,
        name: category.name,
      },
      menuItem,
    })
    .from(menuItem)
    .leftJoin(category, eq(menuItem.categoryId, category.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(category.displayOrder, menuItem.displayOrder, menuItem.name)
    .$dynamic()

  // if (options.limit && options.offset) {
  //   return baseQuery.limit(options.limit).offset(options.offset)
  // } else if (options.limit) {
  //   return baseQuery.limit(options.limit)
  // }

  return await withPagination(query, options.page, options.pageSize)
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
  return await db
    .insert(menuItem)
    .values({
      ...data,
      id: generatePublicId(),
    })
    .returning()
}

export async function updateMenuItem(db: DB, id: string, data: UpdateMenuItemDB) {
  return await db.update(menuItem).set(data).where(eq(menuItem.id, id)).returning()
}

export async function deleteMenuItem(db: DB, id: string) {
  return await db.delete(menuItem).where(eq(menuItem.id, id))
}

export async function getMenuItemVariants(db: DB, menuItemId: string) {
  return await db
    .select()
    .from(menuItemVariant)
    .where(eq(menuItemVariant.menuItemId, menuItemId))
    .orderBy(menuItemVariant.displayOrder, menuItemVariant.name)
}

export async function createMenuItemVariant(db: DB, data: InsertMenuItemVariantDB) {
  return await db
    .insert(menuItemVariant)
    .values({
      ...data,
      id: generatePublicId(),
    })
    .returning()
}

export async function updateMenuItemVariant(db: DB, id: string, data: UpdateMenuItemVariantDB) {
  return await db.update(menuItemVariant).set(data).where(eq(menuItemVariant.id, id)).returning()
}

export async function deleteMenuItemVariant(db: DB, id: string) {
  return await db.delete(menuItemVariant).where(eq(menuItemVariant.id, id))
}

export async function getAllergens(db: DB, activeOnly = true) {
  return db
    .select()
    .from(allergen)
    .where(activeOnly ? eq(allergen.isActive, true) : undefined)
    .orderBy(allergen.name)
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

export async function getMenuItemsByCategory(db: DB) {
  return db
    .select({
      category: {
        displayOrder: category.displayOrder,
        id: category.id,
        name: category.name,
      },
      menuItems: sql`
          json_group_array(
            json_object(
              'id', ${menuItem.id},
              'name', ${menuItem.name},
              'description', ${menuItem.description},
              'basePrice', ${menuItem.basePrice},
              'image', ${menuItem.image},
              'isVegetarian', ${menuItem.isVegetarian},
              'isVegan', ${menuItem.isVegan},
              'isGlutenFree', ${menuItem.isGlutenFree},
              'isSpicy', ${menuItem.isSpicy},
              'isPopular', ${menuItem.isPopular},
              'isAvailable', ${menuItem.isAvailable}
            )
          )
        `,
    })
    .from(category)
    .leftJoin(menuItem, and(eq(menuItem.categoryId, category.id), eq(menuItem.isAvailable, true)))
    .where(eq(category.isActive, true))
    .groupBy(category.id)
    .orderBy(category.displayOrder, category.name)
}

export async function searchMenu(
  db: DB,
  searchTerm: string,
  filters: {
    categoryId?: string
    vegetarian?: boolean
    vegan?: boolean
    glutenFree?: boolean
    maxPrice?: number
    minPrice?: number
  } = {}
) {
  const conditions = [eq(menuItem.isAvailable, true), like(menuItem.name, `%${searchTerm}%`)]

  if (filters.categoryId) {
    conditions.push(eq(menuItem.categoryId, filters.categoryId))
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

  if (filters.minPrice !== undefined) {
    conditions.push(sql`${menuItem.basePrice} >= ${filters.minPrice}`)
  }

  if (filters.maxPrice !== undefined) {
    conditions.push(sql`${menuItem.basePrice} <= ${filters.maxPrice}`)
  }

  return db
    .select({
      category: {
        id: category.id,
        name: category.name,
      },
      menuItem,
    })
    .from(menuItem)
    .leftJoin(category, eq(menuItem.categoryId, category.id))
    .where(and(...conditions))
    .orderBy(menuItem.isPopular, menuItem.name)
}
