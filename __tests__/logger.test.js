
const logger = require('../src/logger')

logger.out = {
  log: jest.fn(),
  on: jest.fn()
}

beforeEach(() => {
  logger.out.log.mockClear()
})

test('debug', () => {
  expect.assertions(5)

  logger.log({
    level: 'debug', 
    request: {originalUrl: 'http://very-original'}, 
    response: {statusCode: 200},
    wmsUrl: 'http://geoserver'
  })

  expect(logger.out.log).toHaveBeenCalledTimes(1)
  expect(logger.out.log.mock.calls[0][0]).toBe('debug')
  expect(logger.out.log.mock.calls[0][1].originalUrl).toBe('http://very-original')
  expect(logger.out.log.mock.calls[0][1].wmsUrl).toBe('http://geoserver')
  expect(logger.out.log.mock.calls[0][1].statusCode).toBe(200)
})

test('error', () => {
  expect.assertions(6)

  logger.log({
    level: 'error', 
    request: {originalUrl: 'http://very-original'}, 
    response: {statusCode: 500},
    wmsUrl: 'http://geoserver',
    error: 'wtf'
  })

  expect(logger.out.log).toHaveBeenCalledTimes(1)
  expect(logger.out.log.mock.calls[0][0]).toBe('error')
  expect(logger.out.log.mock.calls[0][1].originalUrl).toBe('http://very-original')
  expect(logger.out.log.mock.calls[0][1].wmsUrl).toBe('http://geoserver')
  expect(logger.out.log.mock.calls[0][1].statusCode).toBe(500)
  expect(logger.out.log.mock.calls[0][1].error).toBe('wtf')
})
