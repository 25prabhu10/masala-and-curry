import { authClient } from '@/lib/auth'
import createApp from '@/lib/create-app'

import categories from './categories/categories.route'
import images from './images/images.route'
import index from './index.route'
import menuItemVariants, { variantRouter } from './menu-item-variants/menu-item-variants.route'
import menuItems from './menu-items/menu-items.route'
import users from './users/users.route'

const app = createApp()

app.on(['POST', 'GET'], '/auth/**', async (c) => (await authClient(c.env)).handler(c.req.raw))

const routes = app
  .route('/', index)
  .route('/users', users)
  .route('/categories', categories)
  .route('/menu-items', menuItems)
  .route('/menu-items', menuItemVariants)
  .route('/menu-items-variants', variantRouter)
  .route('/images', images)

export type APIRoutes = typeof routes

export default app
