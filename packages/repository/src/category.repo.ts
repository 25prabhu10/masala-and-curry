import { category, type InsertCategoryDB, type UpdateCategoryDB } from '@mac/db/schemas'
import type { DB } from '@mac/db/types'
import type { Category, CategoryFilters } from '@mac/validators/category'
import { asc, count, desc, eq } from 'drizzle-orm'

import { withPagination } from './utils'

export async function getTotalCategoriesCount(db: DB, filters: CategoryFilters) {
  return await db
    .select({ rowCount: count() })
    .from(category)
    .where(filters.activeOnly ? eq(category.isActive, true) : undefined)
}

export async function getCategories(db: DB, filters: CategoryFilters): Promise<Category[]> {
  const query = db
    .select()
    .from(category)
    .where(filters.activeOnly ? eq(category.isActive, true) : undefined)

  if (filters.sortBy && filters.sortBy.length > 0 && typeof filters.sortBy !== 'string') {
    const orderByColumns = filters.sortBy.map(({ column, direction }) => {
      const columnRef = category[column]
      return direction === 'desc' ? desc(columnRef) : asc(columnRef)
    })
    query.orderBy(...orderByColumns)
  }

  if (filters.pageIndex || filters.pageSize) {
    return await withPagination(query.$dynamic(), filters.pageIndex, filters.pageSize)
  }

  return await query
}

export async function getCategoryById(db: DB, id: string): Promise<Category | undefined> {
  return await db.query.category.findFirst({
    where: eq(category.id, id),
  })
}

export async function createCategory(db: DB, data: InsertCategoryDB): Promise<Category[]> {
  return await db.insert(category).values(data).returning()
}

export async function updateCategory(
  db: DB,
  id: string,
  data: UpdateCategoryDB
): Promise<Category[]> {
  return await db.update(category).set(data).where(eq(category.id, id)).returning()
}

export async function deleteCategory(db: DB, id: string) {
  return await db.delete(category).where(eq(category.id, id))
}
