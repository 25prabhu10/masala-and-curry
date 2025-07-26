import { createDb } from '@mac/db'
import * as schema from '@mac/db/schemas'
import { TITLE } from '@mac/resources/app'
import { type BetterAuthOptions, betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, openAPI, phoneNumber } from 'better-auth/plugins'

import { BASE_PATH } from './constants'

const betterAuthOptions: BetterAuthOptions = {
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
    openAPI(),
  ],

  // advanced: {
  //   database: {
  //     generateId: false, // Disable ID generation by better-auth
  //   },
  // },

  // https://www.better-auth.com/docs/concepts/session-management#session-caching
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60, // 60 seconds
    },
    expiresIn: 60, // 60 seconds
    freshAge: 10, // 10 seconds
    updateAge: 30, // 30 seconds
  },
}

export async function authClient(env: CloudflareBindings): Promise<ReturnType<typeof betterAuth>> {
  return betterAuth({
    ...betterAuthOptions,
    baseURL: env.AUTH_URL,
    database: drizzleAdapter(await createDb(env.DB), {
      provider: 'sqlite',
      schema,
    }),
    secret: env.AUTH_SECRET,
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
