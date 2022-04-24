import { describe, expect, it } from 'vitest'

import type { TrafficLightDto } from '../src/model/traffic-light'

import { TestUtils } from './test-utils'

describe('traffic lights', () => {
  it('can be retrieved', async () => {
    const server = await TestUtils.createTestServer()
    const response = await server.inject({
      method: 'GET',
      url: '/tracking/traffic-lights',
    })
    expect(response.statusCode).toEqual(200)
    expect(JSON.parse(response.body).length).toEqual(3)
  })

  it('can be retrieved by id', async () => {
    const server = await TestUtils.createTestServer()
    const response = await server.inject({
      method: 'GET',
      url: '/tracking/traffic-lights/tl-1',
    })
    expect(response.statusCode).toEqual(200)
    expect(JSON.parse(response.body).length).toEqual(1)
  })

  it('handles unknown ids', async () => {
    const server = await TestUtils.createTestServer()
    const response = await server.inject({
      method: 'GET',
      url: '/tracking/traffic-lights/does-not-exist',
    })
    expect(response.statusCode).toEqual(200)
    expect(JSON.parse(response.body)).toEqual([])
  })

  describe('latest', () => {
    it('can be retrieved', async () => {
      const server = await TestUtils.createTestServer()
      const response = await server.inject({
        method: 'GET',
        url: '/tracking/traffic-lights/tl-2/latest',
      })
      expect(response.statusCode).toEqual(200)
      const trafficLight = JSON.parse(response.body) as TrafficLightDto
      expect(trafficLight.id).toEqual('tl-2')
      expect(trafficLight.timestamp).toEqual(14)
    })

    it('handles unknown ids', async () => {
      const server = await TestUtils.createTestServer()
      const response = await server.inject({
        method: 'GET',
        url: '/tracking/traffic-lights/does-not-exist/latest',
      })
      expect(response.statusCode).toEqual(200)
      expect(JSON.parse(response.body)).toEqual({})
    })
  })
})
