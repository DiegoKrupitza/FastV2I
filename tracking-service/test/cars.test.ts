import { describe, expect, it } from 'vitest'

import type { CarDto } from '../src/model/car'

import { TestUtils } from './test-utils'

describe('cars', () => {
  it('can be retrieved', async () => {
    const server = await TestUtils.createTestServer()
    const response = await server.inject({
      method: 'GET',
      url: '/tracking/cars',
    })
    expect(response.statusCode).toEqual(200)
    expect(JSON.parse(response.body).length).toEqual(3)
  })

  it('can be retrieved by vin', async () => {
    const server = await TestUtils.createTestServer()
    const response = await server.inject({
      method: 'GET',
      url: '/tracking/cars/vw-passat-1',
    })
    expect(response.statusCode).toEqual(200)
    expect(JSON.parse(response.body).length).toEqual(2)
  })

  it('handles unknown vins', async () => {
    const server = await TestUtils.createTestServer()
    const response = await server.inject({
      method: 'GET',
      url: '/tracking/cars/does-not-exist',
    })
    expect(response.statusCode).toEqual(200)
    expect(JSON.parse(response.body)).toEqual([])
  })

  describe('latest', () => {
    it('can be retrieved', async () => {
      const server = await TestUtils.createTestServer()
      const response = await server.inject({
        method: 'GET',
        url: '/tracking/cars/vw-passat-1/latest',
      })
      expect(response.statusCode).toEqual(200)
      const car = JSON.parse(response.body) as CarDto
      expect(car.vin).toEqual('vw-passat-1')
      expect(car.timestamp).toEqual(15)
    })

    it('handles unknown ids', async () => {
      const server = await TestUtils.createTestServer()
      const response = await server.inject({
        method: 'GET',
        url: '/tracking/cars/does-not-exist/latest',
      })
      expect(response.statusCode).toEqual(200)
      expect(JSON.parse(response.body)).toEqual({})
    })
  })
})
