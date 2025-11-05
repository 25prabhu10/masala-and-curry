import { allergen } from '@mac/db/schemas'
import type { DB } from '@mac/db/types'
import type { Allergen } from '@mac/validators/allergen'
import { eq } from 'drizzle-orm'

export async function getAllergens(db: DB, activeOnly = true): Promise<Allergen[]> {
  return db
    .select()
    .from(allergen)
    .where(activeOnly ? eq(allergen.isActive, true) : undefined)
    .orderBy(allergen.name)
}
