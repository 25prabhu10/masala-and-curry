import { createAuthClient } from 'better-auth/react'

export default createAuthClient({
  baseURL: 'http://localhost:5173',
  basePath: '/api/v1/auth',
})
