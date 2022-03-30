import { describe, expect, it } from 'vitest'

import { TestUtils } from './test-utils'

describe('cars', () => {
  it('can be retrieved', async () => {
    const server = await TestUtils.createTestServer()
    const response = await server.inject({
      method: 'GET',
      url: '/tracking/cars',
    })
    expect(response.statusCode).toEqual(200)
    expect(JSON.parse(response.body).length).toEqual(2)
  })

  it('can be retrieved by id', async () => {
    const server = await TestUtils.createTestServer()
    const response = await server.inject({
      method: 'GET',
      url: '/tracking/cars/first',
    })
    expect(response.statusCode).toEqual(200)
    expect(JSON.parse(response.body).vin).toEqual('first')
  })

  it('handles errors', async () => {
    const server = await TestUtils.createTestServer()
    const response = await server.inject({
      method: 'GET',
      url: '/tracking/cars/does-not-exist',
    })
    expect(response.statusCode).toEqual(404)
    expect(JSON.parse(response.body)).toBeNull()
  })
})
