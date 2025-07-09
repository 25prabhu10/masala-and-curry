import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.json({
    message: 'Welcome to the Masala and Curry API',
    timestamp: new Date().toISOString(),
  })
})

export default app
