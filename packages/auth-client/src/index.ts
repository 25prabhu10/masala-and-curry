import { adminClient, phoneNumberClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export function createNewClient(baseURL?: string, basePath?: string) {
  return createAuthClient({
    basePath,
    baseURL,
    plugins: [phoneNumberClient(), adminClient()],
  })
}

export type AuthClient = ReturnType<typeof createNewClient>
