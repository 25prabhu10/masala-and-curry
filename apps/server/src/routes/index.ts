import { authClient } from '@/lib/auth'
import createApp from '@/lib/create-app'

import index from './index.route'
import users from './users/users.index'

const app = createApp()

app.on(['POST', 'GET'], '/auth/**', async (c) => (await authClient(c.env)).handler(c.req.raw))

const routes = app.route('/', index).route('/users', users)

export type APIRoutes = typeof routes

export default app
