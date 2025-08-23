import {
  type InsertMenuItemVariantDB,
  menuItemVariant,
  type UpdateMenuItemVariantDB,
} from '@mac/db/schemas'
import type { DB } from '@mac/db/types'
import type { MenuItemVariant } from '@mac/validators/menu-item-variant'
import { eq } from 'drizzle-orm'

export async function getMenuItemVariants(db: DB, menuItemId: string): Promise<MenuItemVariant[]> {
  return await db
    .select()
    .from(menuItemVariant)
    .where(eq(menuItemVariant.menuItemId, menuItemId))
    .orderBy(menuItemVariant.displayOrder, menuItemVariant.name)
}

export async function getMenuItemVariantById(
  db: DB,
  id: string
): Promise<MenuItemVariant | undefined> {
  return await db.query.menuItemVariant.findFirst({
    where: eq(menuItemVariant.id, id),
  })
}

export async function createMenuItemVariant(
  db: DB,
  data: InsertMenuItemVariantDB
): Promise<MenuItemVariant[]> {
  return await db.insert(menuItemVariant).values(data).returning()
}

export async function createMenuItemVariants(
  db: DB,
  data: InsertMenuItemVariantDB[]
): Promise<void> {
  await db.insert(menuItemVariant).values(data)
}

export async function updateMenuItemVariant(
  db: DB,
  id: string,
  data: UpdateMenuItemVariantDB
): Promise<void> {
  await db.update(menuItemVariant).set(data).where(eq(menuItemVariant.id, id))
}

export async function deleteMenuItemVariant(db: DB, id: string): Promise<void> {
  await db.delete(menuItemVariant).where(eq(menuItemVariant.id, id))
}
