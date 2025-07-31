import { testClient } from 'hono/testing'
import { describe, expect, it } from 'vitest'

import createApp from '@/lib/create-app'

import router from './users.route'

describe('users routes', () => {
  const client = testClient(createApp().route('/users', router))

  it('returns user data for a valid user ID', async () => {
    const userId = 'DA2G93CK87ZP8NW6T5WYG'
    const response = await client.api.v1.users[':id'].$get({
      param: { id: userId },
    })

    expect(response.status).toBe(200)

    if (response.status === 200) {
      const json = await response.json()
      expect(json).toHaveProperty('id', userId)
      // Add more assertions based on the expected user data structure
    }
  })
})
