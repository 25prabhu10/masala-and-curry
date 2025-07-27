// import type { Context, Next } from 'hono'

// // Middleware to protect routes from unauthorized access
// export const protect = async (c, next) => {
//   // Extract the session from the incoming request headers
//   const auth = await authClient(c.env))
//   const session = await auth.api.getSession({ headers: c.req.raw.headers })

//   // If no valid session or user is found, return an unauthorized response
//   if (!session || !session.user) {
//     return c.json(
//       {
//         error: 'No valid session found',
//         message: 'Unauthorized',
//         success: false,
//       },
//       401
//     )
//   }

//   console.log(session.user)
//   // Optionally set the user and session on the context variables
//   c.set('user', session.user)
//   c.set('session', session.session)

//   // Continue to the next middleware/handler
//   await next()
// }

// // https://github.com/ProMehedi/bun-hono-better-auth/blob/main/server/src/config/auth.config.ts
