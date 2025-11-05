import { API_SERVER_DESCRIPTION } from '@mac/resources/app'
import { testClient } from 'hono/testing'
import { describe, expect, it } from 'vitest'

import createApp from '@/lib/create-app'

import router from './index.route'

const client = testClient(createApp().route('/', router))

describe('index routes', () => {
  it('returns the API server description', async () => {
    const response = await client.api.v1.$get()

    expect(response.status).toBe(200)

    if (response.status === 200) {
      const json = await response.json()
      expect(json.message).toBe(API_SERVER_DESCRIPTION)
    }
  })
})
