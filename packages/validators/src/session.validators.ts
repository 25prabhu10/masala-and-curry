import type { z } from '@hono/zod-openapi'
import type { SelectSessionSchema } from '@mac/db/schemas'

export type Session = z.output<typeof SelectSessionSchema>
