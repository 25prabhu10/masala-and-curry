import type { DB } from '@mac/db'
import { type UpdateUserDB, user } from '@mac/db/schemas'
import type { User } from '@mac/validators/user'
import { and, eq, ne } from 'drizzle-orm'

export async function getUserById(db: DB, id: string): Promise<User | undefined> {
  return (await db.query.user.findFirst({
    columns: {
      createdAt: false,
      updatedAt: false,
    },
    where: eq(user.id, id),
  })) as User
}

export async function updateUser(db: DB, id: string, dataToUpdate: UpdateUserDB): Promise<User[]> {
  return (await db.update(user).set(dataToUpdate).where(eq(user.id, id)).returning()) as User[]
}

export async function checkIfEmailExists(db: DB, email: string): Promise<boolean> {
  const result = await db.query.user.findFirst({
    columns: {
      id: true,
    },
    where: eq(user.email, email),
  })
  return !!result
}

export async function checkIfEmailExistsForOtherUser(
  db: DB,
  email: string,
  userIdToExclude: string
): Promise<boolean> {
  const result = await db.query.user.findFirst({
    columns: {
      id: true,
    },
    where: and(eq(user.email, email), ne(user.id, userIdToExclude)),
  })
  return !!result
}
