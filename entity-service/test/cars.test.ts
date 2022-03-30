import { describe, expect, it } from 'vitest'

import { TestUtils } from './test-utils'

describe('cars', () => {
  it('can be retrieved', async () => {
    const server = await TestUtils.createTestServer()
    const response = await server.inject({
      method: 'GET',
      url: '/entities/cars',
    })
    expect(response.statusCode).toEqual(200)
    expect(JSON.parse(response.body).length).toEqual(2)
  })

  it('can be retrieved by id', async () => {
    const server = await TestUtils.createTestServer()
    const response = await server.inject({
      method: 'GET',
      url: '/entities/cars/vw-passat-1',
    })
    expect(response.statusCode).toEqual(200)
    expect(JSON.parse(response.body).vin).toEqual('vw-passat-1')
  })

  it('handles errors', async () => {
    const server = await TestUtils.createTestServer()
    const response = await server.inject({
      method: 'GET',
      url: '/entities/cars/does-not-exist',
    })
    expect(response.statusCode).toEqual(404)
    expect(JSON.parse(response.body)).toBeNull()
  })
})
