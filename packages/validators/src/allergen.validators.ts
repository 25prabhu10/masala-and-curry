import type { z } from '@hono/zod-openapi'
import { SelectAllergenSchema } from '@mac/db/schemas'

export const readAllergenValidator = SelectAllergenSchema
export type Allergen = z.infer<typeof readAllergenValidator>
