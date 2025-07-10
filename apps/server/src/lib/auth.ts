import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { openAPI, username } from 'better-auth/plugins'
import { createDb } from '@/db'
import * as schema from '@/db/schemas'
import { appResources } from '@/resources/en'
import { BASE_PATH } from './constants'

export async function auth(env: CloudflareBindings): Promise<ReturnType<typeof betterAuth>> {
  const db = await createDb(env)

  console.log('URL', env.BETTER_AUTH_URL)

  return betterAuth({
    appName: appResources.en.TITLE,
    basePath: `${BASE_PATH}/auth`,
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    // advanced: {
    //   database: {
    //     generateId: false, // Disable ID generation by better-auth
    //   },
    // },
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema,
    }),

    // https://www.better-auth.com/docs/concepts/session-management#session-caching
    // session: {
    //   cookieCache: {
    //     enabled: true,
    //     maxAge: 5 * 60, // 5 minutes
    //   },
    // },
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
    plugins: [username(), openAPI()],
  })
}
