jest.mock('../src/logger')
jest.mock('http')

const proxy = require('../src/proxy')

let mockExpressRequest
let mockExpressResponse
const wmsUrl = `http://geoserver`
beforeEach(() => {
  proxy.http.resetMocks()
  mockExpressRequest = proxy.http.mockRequest()
  mockExpressResponse = proxy.http.mockResponse()
})

test('proxy happy path', done => {
  expect.assertions(19)

  proxy.http.headers = {'content-type': 'image/png', 'server': 'fred'}
  proxy.http.statusCode = 200

  proxy(mockExpressRequest, mockExpressResponse, wmsUrl)

  setTimeout(() => {
    expect(proxy.http.request).toHaveBeenCalledTimes(1)
    expect(proxy.http.request.mock.calls[0][0]).toBe(wmsUrl)
    expect(typeof proxy.http.request.mock.calls[0][1]).toBe('function')

    expect(mockExpressResponse.status).toHaveBeenCalledTimes(1)
    expect(mockExpressResponse.status.mock.calls[0][0]).toBe(200)
    expect(mockExpressResponse.type).toHaveBeenCalledTimes(1)
    expect(mockExpressResponse.type.mock.calls[0][0]).toBe('image/png')
    expect(mockExpressResponse.header).toHaveBeenCalledTimes(1)
    expect(mockExpressResponse.header.mock.calls[0][0]).toBe('server')
    expect(mockExpressResponse.header.mock.calls[0][1]).toBe('fred')
    
    proxy.http.wmsResponse.data(1)
    proxy.http.wmsResponse.data(2)

    expect(mockExpressResponse.write).toHaveBeenCalledTimes(2)
    expect(mockExpressResponse.write.mock.calls[0][0]).toBe(1)
    expect(mockExpressResponse.write.mock.calls[1][0]).toBe(2)

    proxy.http.wmsResponse.end()

    expect(proxy.log).toHaveBeenCalledTimes(1)
    expect(proxy.log.mock.calls[0][0].level).toBe('debug')
    expect(proxy.log.mock.calls[0][0].request).toBe(mockExpressRequest)
    expect(proxy.log.mock.calls[0][0].response).toBe(mockExpressResponse)
    expect(proxy.log.mock.calls[0][0].wmsUrl).toBe(wmsUrl)
    expect(mockExpressResponse.end).toHaveBeenCalledTimes(1)

    done()
  }, 500)

})