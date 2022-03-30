import { describe, expect, it } from 'vitest'

import { createServer } from '../src/server'

import { TestUtils } from './test-utils'

describe('server', () => {
  it('can be created', () => {
    const server = createServer({
      isTest: true,
      mongoDbProvider: TestUtils.createTestMongoDb,
    })
    expect(server).toBeDefined()
  })
})
