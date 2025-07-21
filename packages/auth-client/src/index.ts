import { adminClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export function createNewClient(baseURL?: string, basePath?: string) {
  return createAuthClient({
    baseURL,
    basePath,
    plugins: [adminClient()],
  })
}

export type AuthClient = ReturnType<typeof createNewClient>
