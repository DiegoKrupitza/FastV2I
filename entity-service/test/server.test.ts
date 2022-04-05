import { describe, expect, it } from 'vitest'

import { collections } from '../src/database'

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

  it('can be reset', async () => {
    const server = await TestUtils.createTestServer()
    expect(collections?.cars?.countDocuments()).resolves.not.toBe(0)
    expect(collections?.trafficLights?.countDocuments()).resolves.not.toBe(0)
    const response = await server.inject({
      method: 'DELETE',
      url: '/entities/all',
    })
    expect(JSON.parse(response.body)).toMatchInlineSnapshot('null')
    expect(collections?.cars?.countDocuments()).resolves.toBe(0)
    expect(collections?.trafficLights?.countDocuments()).resolves.toBe(0)
  })
})
