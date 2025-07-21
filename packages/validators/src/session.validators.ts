import type { SelectSessionSchema } from '@mac/db/schemas'
import type * as z from 'zod'

export type Session = z.output<typeof SelectSessionSchema>
