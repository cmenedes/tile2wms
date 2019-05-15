jest.mock('../src/logger')
jest.mock('http')

const proxy = require('../src/proxy')

let mockExpressRequest
let mockExpressResponse
const wmsUrl = `http://geoserver`
beforeEach(() => {
  mockExpressRequest = proxy.http.mockRequest()
  mockExpressResponse = proxy.http.mockResponse()
})

test('proxy happy path', () => {
  expect.assertions(0)

  proxy(mockExpressRequest, mockExpressResponse, wmsUrl)
})