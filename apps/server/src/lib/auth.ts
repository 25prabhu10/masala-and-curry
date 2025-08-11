import { createDb } from '@mac/db'
import * as schema from '@mac/db/schemas'
import { TITLE } from '@mac/resources/app'
import { type BetterAuthOptions, betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, openAPI, phoneNumber } from 'better-auth/plugins'

import { BASE_PATH } from './constants'

const betterAuthOptions = {
  appName: TITLE,
  basePath: `${BASE_PATH}/auth`,

  emailAndPassword: {
    enabled: true,
  },

  // https://www.better-auth.com/docs/concepts/oauth
  // socialProviders: {
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID!,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET!
  //   }
  // }

  // TODO: merge openapi
  plugins: [
    phoneNumber({
      sendOTP: () => {
        // { phoneNumber, code }, request
        // Implement sending OTP code via SMS
      },
    }),
    admin(),
  ],

  // https://www.better-auth.com/docs/concepts/session-management#session-caching
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    freshAge: 60 * 60 * 24, // 1 day (the session is fresh if created within the last 1 day)
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
  },
} satisfies BetterAuthOptions

// This is used to generate better auth schemas
export const auth = betterAuth({
  ...betterAuthOptions,
  database: drizzleAdapter(await createDb({} as D1Database), {
    provider: 'sqlite',
    schema,
  }),
})

// oxlint-disable-next-line explicit-module-boundary-types
export async function authClient(env: CloudflareBindings) {
  return betterAuth({
    ...betterAuthOptions,
    baseURL: env.URL,
    database: drizzleAdapter(await createDb(env.DB), {
      provider: 'sqlite',
      schema,
    }),
    plugins:
      env.ENVIRONMENT === 'development'
        ? [...betterAuthOptions.plugins, openAPI()]
        : betterAuthOptions.plugins,
    secret: env.AUTH_SECRET,
  })
}

export type Session = (typeof auth.$Infer.Session)['session']
export type User = (typeof auth.$Infer.Session)['user']
