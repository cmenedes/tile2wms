jest.mock('jimp')
jest.mock('http')
const http = require('http')
const crop = require('../src/crop')

const mockExpressRequest = http.mockRequest()
mockExpressRequest.params = {
  format: 'png',
  template: {metaTiles: 3}
}

const mockExpressResponse = http.mockResponse()

test('crop', done => {
  expect.assertions(1)
  crop(mockExpressRequest, mockExpressResponse, 'mock-buffer', 'http://geoserver')
  expect(mockExpressResponse.write).toHaveBeenCalledTimes(1)
  done()
})