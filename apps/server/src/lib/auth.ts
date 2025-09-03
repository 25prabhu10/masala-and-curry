import { env } from 'cloudflare:workers'
import { createDb } from '@mac/db'
import * as schema from '@mac/db/schemas'
import { TITLE } from '@mac/resources/app'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, openAPI, phoneNumber } from 'better-auth/plugins'

import { BASE_PATH } from './constants'

const plugins = [
  phoneNumber({
    sendOTP: () => {
      // { phoneNumber, code }, request
      // Implement sending OTP code via SMS
    },
  }),
  admin(),
]

// This is used to generate better auth schemas
export const auth = betterAuth({
  appName: TITLE,
  basePath: `${BASE_PATH}/auth`,
  baseURL: env.URL,
  database: drizzleAdapter(await createDb(env.DB), {
    provider: 'sqlite',
    schema,
  }),

  emailAndPassword: {
    enabled: true,
  },

  // TODO: merge openapi
  plugins: env.ENVIRONMENT === 'development' ? [...plugins, openAPI()] : plugins,
  secret: env.AUTH_SECRET,

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

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  trustedOrigins: [env.URL],
})

export type Session = typeof auth.$Infer.Session.session
export type User = typeof auth.$Infer.Session.user
