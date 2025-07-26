import { and, eq, ne } from 'drizzle-orm'

import type { DB } from '../index'
import { user } from '../schemas'
import type { UpdateUserDB } from '../schemas/user.schema'

export async function getUserById(db: DB, id: string) {
  return db.query.user.findFirst({
    columns: {
      createdAt: false,
      id: false,
      updatedAt: false,
    },
    where: eq(user.id, id),
  })
}

export async function checkIfEmailExists(db: DB, email: string) {
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
) {
  const result = await db.query.user.findFirst({
    columns: {
      id: true,
    },
    where: and(eq(user.email, email), ne(user.id, userIdToExclude)),
  })
  return !!result
}

export async function updateUser(db: DB, id: string, dataToUpdate: UpdateUserDB) {
  return await db.update(user).set(dataToUpdate).where(eq(user.id, id)).returning({
    email: user.email,
    name: user.name,
  })
}
