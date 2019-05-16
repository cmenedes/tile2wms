jest.mock('../src/logger')
jest.mock('http')

const proxy = require('../src/proxy')

let mockExpressRequest
let mockExpressResponse
const wmsUrl = `http://geoserver`
beforeEach(() => {
  proxy.http.resetMocks()
  proxy.log.mockClear()
  mockExpressRequest = proxy.http.mockRequest()
  mockExpressResponse = proxy.http.mockResponse()
})

test('proxy happy path', done => {
  expect.assertions(19)

  /* set up WMS mock response */
  proxy.http.headers = {'content-type': 'image/png', 'server': 'fred', "wilma": "pebbles"}
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
    
    /* mock data transfer to WMS response */
    proxy.http.wmsResponse.data(1)
    proxy.http.wmsResponse.data(2)

    expect(mockExpressResponse.write).toHaveBeenCalledTimes(2)
    expect(mockExpressResponse.write.mock.calls[0][0]).toBe(1)
    expect(mockExpressResponse.write.mock.calls[1][0]).toBe(2)

    /* mock completion on WMS request/response */
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

test('proxy wms error response from wms server', done => {
  expect.assertions(20)

  /* set up WMS mock response */
  proxy.http.headers = {'content-type': 'text/xml', 'server': 'fred'}
  proxy.http.statusCode = 200

  proxy(mockExpressRequest, mockExpressResponse, wmsUrl)

  setTimeout(() => {
    expect(proxy.http.request).toHaveBeenCalledTimes(1)
    expect(proxy.http.request.mock.calls[0][0]).toBe(wmsUrl)
    expect(typeof proxy.http.request.mock.calls[0][1]).toBe('function')

    expect(mockExpressResponse.status).toHaveBeenCalledTimes(1)
    expect(mockExpressResponse.status.mock.calls[0][0]).toBe(500)
    expect(mockExpressResponse.type).toHaveBeenCalledTimes(1)
    expect(mockExpressResponse.type.mock.calls[0][0]).toBe('text/xml')
    expect(mockExpressResponse.header).toHaveBeenCalledTimes(1)
    expect(mockExpressResponse.header.mock.calls[0][0]).toBe('server')
    expect(mockExpressResponse.header.mock.calls[0][1]).toBe('fred')
    
    /* mock data transfer to WMS response */
    proxy.http.wmsResponse.data('wms ')
    proxy.http.wmsResponse.data('error')

    expect(mockExpressResponse.write).toHaveBeenCalledTimes(2)
    expect(mockExpressResponse.write.mock.calls[0][0]).toBe('wms ')
    expect(mockExpressResponse.write.mock.calls[1][0]).toBe('error')

    /* mock completion on WMS request/response */
    proxy.http.wmsResponse.end()

    expect(proxy.log).toHaveBeenCalledTimes(1)
    expect(proxy.log.mock.calls[0][0].level).toBe('error')
    expect(proxy.log.mock.calls[0][0].request).toBe(mockExpressRequest)
    expect(proxy.log.mock.calls[0][0].response).toBe(mockExpressResponse)
    expect(proxy.log.mock.calls[0][0].wmsUrl).toBe(wmsUrl)
    expect(proxy.log.mock.calls[0][0].error).toBe('wms error')
    expect(mockExpressResponse.end).toHaveBeenCalledTimes(1)

    done()
  }, 500)

})

test('proxy 500 error response from wms server', done => {
  expect.assertions(20)

  /* set up WMS mock response */
  proxy.http.headers = {'content-type': 'text/html', 'server': 'fred'}
  proxy.http.statusCode = 500

  proxy(mockExpressRequest, mockExpressResponse, wmsUrl)

  setTimeout(() => {
    expect(proxy.http.request).toHaveBeenCalledTimes(1)
    expect(proxy.http.request.mock.calls[0][0]).toBe(wmsUrl)
    expect(typeof proxy.http.request.mock.calls[0][1]).toBe('function')

    expect(mockExpressResponse.status).toHaveBeenCalledTimes(1)
    expect(mockExpressResponse.status.mock.calls[0][0]).toBe(500)
    expect(mockExpressResponse.type).toHaveBeenCalledTimes(1)
    expect(mockExpressResponse.type.mock.calls[0][0]).toBe('text/html')
    expect(mockExpressResponse.header).toHaveBeenCalledTimes(1)
    expect(mockExpressResponse.header.mock.calls[0][0]).toBe('server')
    expect(mockExpressResponse.header.mock.calls[0][1]).toBe('fred')
    
    /* mock data transfer to WMS response */
    proxy.http.wmsResponse.data('500 ')
    proxy.http.wmsResponse.data('error')

    expect(mockExpressResponse.write).toHaveBeenCalledTimes(2)
    expect(mockExpressResponse.write.mock.calls[0][0]).toBe('500 ')
    expect(mockExpressResponse.write.mock.calls[1][0]).toBe('error')

    /* mock completion on WMS request/response */
    proxy.http.wmsResponse.end()

    expect(proxy.log).toHaveBeenCalledTimes(1)
    expect(proxy.log.mock.calls[0][0].level).toBe('error')
    expect(proxy.log.mock.calls[0][0].request).toBe(mockExpressRequest)
    expect(proxy.log.mock.calls[0][0].response).toBe(mockExpressResponse)
    expect(proxy.log.mock.calls[0][0].wmsUrl).toBe(wmsUrl)
    expect(proxy.log.mock.calls[0][0].error).toBe('500 error')
    expect(mockExpressResponse.end).toHaveBeenCalledTimes(1)

    done()
  }, 500)

})

test('wms request failure', done => {
  expect.assertions(10)

  /* set up WMS mock request to fail */
  proxy.http.throwError = true

  proxy(mockExpressRequest, mockExpressResponse, wmsUrl)

  setTimeout(() => {
    expect(proxy.http.request).toHaveBeenCalledTimes(1)
    expect(proxy.http.request.mock.calls[0][0]).toBe(wmsUrl)
    expect(typeof proxy.http.request.mock.calls[0][1]).toBe('function')

    expect(proxy.log).toHaveBeenCalledTimes(1)
    expect(proxy.log.mock.calls[0][0].level).toBe('error')
    expect(proxy.log.mock.calls[0][0].request).toBe(mockExpressRequest)
    expect(proxy.log.mock.calls[0][0].response).toBe(mockExpressResponse)
    expect(proxy.log.mock.calls[0][0].wmsUrl).toBe(wmsUrl)
    expect(proxy.log.mock.calls[0][0].error).toBe('error')
    expect(mockExpressResponse.send).toHaveBeenCalledTimes(1)

    done()
  }, 500)

})