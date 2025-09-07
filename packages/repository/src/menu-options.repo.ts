// import type { DB } from '@mac/db/types'
// import { asc, eq } from 'drizzle-orm'

// export async function createMenuOptionGroups(
//   db: DB,
//   menuItemId: string,
//   groups: Array<
//     Omit<InsertOptionGroup, 'menuItemId' | 'id' | 'createdAt' | 'updatedAt'> & {
//       options?: Array<Omit<InsertOption, 'groupId' | 'id' | 'createdAt' | 'updatedAt'>>
//     }
//   >
// ): Promise<void> {
//   for (const g of groups) {
//     const [inserted] = await db
//       .insert(menuOptionGroup)
//       .values({ ...g, menuItemId } as InsertOptionGroup)
//       .returning({ id: menuOptionGroup.id })

//     if (inserted && g.options && g.options.length > 0) {
//       // oxlint-disable-next-line for-of-array
//       for (const opt of g.options) {
//         await db.insert(menuOption).values({ ...opt, groupId: inserted.id } as InsertOption)
//       }
//     }
//   }
// }

// // export async function replaceMenuOptionsForMenuItem(
// //   db: DB,
// //   menuItemId: string,
// //   groups: Parameters<typeof createMenuOptionGroups>[2]
// // ): Promise<void> {
// //   // Delete existing groups (cascade deletes options)
// //   await db.delete(menuOptionGroup).where(eq(menuOptionGroup.menuItemId, menuItemId))
// //   if (groups && groups.length > 0) {
// //     await createMenuOptionGroups(db, menuItemId, groups)
// //   }
// // }
