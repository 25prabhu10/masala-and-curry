import { createDb } from '@mac/db'
import * as schema from '@mac/db/schemas'
import { TITLE } from '@mac/resources/app'
import { type BetterAuthOptions, betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, openAPI, username } from 'better-auth/plugins'
import { BASE_PATH } from './constants'

const betterAuthOptions: BetterAuthOptions = {
  appName: TITLE,
  basePath: `${BASE_PATH}/auth`,

  emailAndPassword: {
    enabled: true,
  },

  // advanced: {
  //   database: {
  //     generateId: false, // Disable ID generation by better-auth
  //   },
  // },

  // https://www.better-auth.com/docs/concepts/session-management#session-caching
  // session: {
  //   cookieCache: {
  //     enabled: true,
  //     maxAge: 5 * 60, // 5 minutes
  //   },
  // },

  // https://www.better-auth.com/docs/concepts/oauth
  // socialProviders: {
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID!,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET!
  //   }
  // }

  // TODO: merge openapi
  plugins: [username(), admin(), openAPI()],
}

export async function authClient(env: CloudflareBindings): Promise<ReturnType<typeof betterAuth>> {
  const db = await createDb(env.DB)

  return betterAuth({
    ...betterAuthOptions,
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema,
    }),
  })
}

// This is used to generate better auth schemas
export const auth = betterAuth({
  ...betterAuthOptions,
  database: drizzleAdapter(await createDb({} as D1Database), {
    provider: 'sqlite',
    schema,
  }),
})
