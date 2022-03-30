import { describe, expect, it } from 'vitest'

import { TestUtils } from './test-utils'

describe('server', () => {
  it('can be created', async () => {
    const server = await TestUtils.createTestServer()
    expect(server).toBeDefined()
  })

  it('has a health endpoint', async () => {
    const server = await TestUtils.createTestServer()
    const response = await server.inject({
      method: 'GET',
      url: '/entities/health',
    })
    expect(JSON.parse(response.body)).toMatchInlineSnapshot(`
      {
        "status": "UP",
      }
    `)
  })
})
