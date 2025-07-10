import createApp from '@/lib/create-app'
import index from './index.route'

const app = createApp()

const routes = app.route('/', index)

export type APIRoutes = typeof routes

export default app
