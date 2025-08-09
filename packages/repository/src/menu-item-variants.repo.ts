// import {
//   type InsertMenuItemVariantDB,
//   menuItemVariant,
//   type UpdateMenuItemVariantDB,
// } from '@mac/db/schemas'
// import type { DB } from '@mac/db/types'
// import { eq } from 'drizzle-orm'

// export async function createMenuItemVariant(db: DB, data: InsertMenuItemVariantDB) {
//   return await db.insert(menuItemVariant).values(data).returning()
// }

// export async function updateMenuItemVariant(db: DB, id: string, data: UpdateMenuItemVariantDB) {
//   return await db.update(menuItemVariant).set(data).where(eq(menuItemVariant.id, id)).returning()
// }

// export async function deleteMenuItemVariant(db: DB, id: string) {
//   return await db.delete(menuItemVariant).where(eq(menuItemVariant.id, id))
// }
