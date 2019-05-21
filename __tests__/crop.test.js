jest.mock('jimp')
jest.mock('http')
jest.mock('../src/logger')
const jimp = require('jimp')
const http = require('http')
const crop = require('../src/crop')

class MockImage {
  constructor(valid) {
    this.valid = valid
    this.crop = jest.fn()
    this.getBuffer = jest.fn().mockImplementation((mimeType, callback) => {
      if (this.valid) {
        callback(null, 'mock-buffer')
      } else {
        callback('unable to read data from jimp image', null)
      }
    })
  }
}

let mockExpressRequest
let mockExpressResponse
let mockGoodImage
let mockBadImage

jimp.read = buffer => {
  if (jimp.canRead && jimp.canGetBuffer) {
    return Promise.resolve(mockGoodImage)
  } else if (jimp.canRead) {
    return Promise.resolve(mockBadImage)
  } else {
    return Promise.reject('unable to read WMS image data')
  }
}

beforeEach(() => {
  mockExpressRequest = http.mockRequest()
  mockExpressResponse = http.mockResponse()
  mockGoodImage = new MockImage(true)
  mockBadImage = new MockImage(false)
  crop.log.mockClear()
})

test('crop happy path png', done => {
  expect.assertions(19)

  /* setup successful WMS image data */
  jimp.canRead = true
  /* setup successful jimp process */
  jimp.canGetBuffer = true
  /* setup request */
  mockExpressRequest.params = {
    format: 'png',
    template: {metaTiles: 3}
  }

  crop(mockExpressRequest, mockExpressResponse, 'mock-buffer', 'http://geoserver')
  setTimeout(() => {
    expect(mockGoodImage.crop).toHaveBeenCalledTimes(1)
    expect(mockGoodImage.crop.mock.calls[0][0]).toBe(257)
    expect(mockGoodImage.crop.mock.calls[0][1]).toBe(257)
    expect(mockGoodImage.crop.mock.calls[0][2]).toBe(256)
    expect(mockGoodImage.crop.mock.calls[0][3]).toBe(256)

    expect(mockGoodImage.getBuffer).toHaveBeenCalledTimes(1)
    expect(mockGoodImage.getBuffer.mock.calls[0][0]).toBe('image/png')
    expect(typeof mockGoodImage.getBuffer.mock.calls[0][1]).toBe('function')

    expect(mockExpressResponse.write).toHaveBeenCalledTimes(1)
    expect(mockExpressResponse.write.mock.calls[0][0]).toBe('mock-buffer')
    expect(mockExpressResponse.write.mock.calls[0][1]).toBe('binary')

    expect(mockExpressResponse.end).toHaveBeenCalledTimes(1)
    expect(mockExpressResponse.end.mock.calls[0][0]).toBeNull()
    expect(mockExpressResponse.end.mock.calls[0][1]).toBe('binary')

    expect(crop.log).toHaveBeenCalledTimes(1)
    expect(crop.log.mock.calls[0][0].level).toBe('debug')
    expect(crop.log.mock.calls[0][0].request).toBe(mockExpressRequest)
    expect(crop.log.mock.calls[0][0].response).toBe(mockExpressResponse)
    expect(crop.log.mock.calls[0][0].wmsUrl).toBe('http://geoserver')

    done()
  }, 500)
})

test('crop happy path png8', done => {
  expect.assertions(19)

  /* setup successful WMS image data */
  jimp.canRead = true
  /* setup successful jimp process */
  jimp.canGetBuffer = true
  /* setup request */
  mockExpressRequest.params = {
    format: 'png8',
    template: {metaTiles: 2}
  }

  crop(mockExpressRequest, mockExpressResponse, 'mock-buffer', 'http://geoserver')
  setTimeout(() => {
    expect(mockGoodImage.crop).toHaveBeenCalledTimes(1)
    expect(mockGoodImage.crop.mock.calls[0][0]).toBe(129)
    expect(mockGoodImage.crop.mock.calls[0][1]).toBe(129)
    expect(mockGoodImage.crop.mock.calls[0][2]).toBe(256)
    expect(mockGoodImage.crop.mock.calls[0][3]).toBe(256)

    expect(mockGoodImage.getBuffer).toHaveBeenCalledTimes(1)
    expect(mockGoodImage.getBuffer.mock.calls[0][0]).toBe('image/png')
    expect(typeof mockGoodImage.getBuffer.mock.calls[0][1]).toBe('function')

    expect(mockExpressResponse.write).toHaveBeenCalledTimes(1)
    expect(mockExpressResponse.write.mock.calls[0][0]).toBe('mock-buffer')
    expect(mockExpressResponse.write.mock.calls[0][1]).toBe('binary')

    expect(mockExpressResponse.end).toHaveBeenCalledTimes(1)
    expect(mockExpressResponse.end.mock.calls[0][0]).toBeNull()
    expect(mockExpressResponse.end.mock.calls[0][1]).toBe('binary')

    expect(crop.log).toHaveBeenCalledTimes(1)
    expect(crop.log.mock.calls[0][0].level).toBe('debug')
    expect(crop.log.mock.calls[0][0].request).toBe(mockExpressRequest)
    expect(crop.log.mock.calls[0][0].response).toBe(mockExpressResponse)
    expect(crop.log.mock.calls[0][0].wmsUrl).toBe('http://geoserver')

    done()
  }, 500)
})

test('crop bad WMS image data', done => {
  expect.assertions(15)

  /* setup successful WMS image data */
  jimp.canRead = false
  /* setup request */
  mockExpressRequest.params = {
    format: 'png',
    template: {metaTiles: 3}
  }

  crop(mockExpressRequest, mockExpressResponse, 'mock-buffer', 'http://geoserver')
  setTimeout(() => {
    expect(mockGoodImage.crop).toHaveBeenCalledTimes(0)
    expect(mockGoodImage.getBuffer).toHaveBeenCalledTimes(0)

    expect(mockExpressResponse.status).toHaveBeenCalledTimes(1)
    expect(mockExpressResponse.status.mock.calls[0][0]).toBe(500)

    expect(mockExpressResponse.write).toHaveBeenCalledTimes(1)
    expect(mockExpressResponse.write.mock.calls[0][0]).toBe('unable to read WMS image data')

    expect(mockExpressResponse.end).toHaveBeenCalledTimes(1)
    expect(mockExpressResponse.end.mock.calls[0][0]).toBeNull()
    expect(mockExpressResponse.end.mock.calls[0][1]).toBe('binary')

    expect(crop.log).toHaveBeenCalledTimes(1)
    expect(crop.log.mock.calls[0][0].level).toBe('error')
    expect(crop.log.mock.calls[0][0].request).toBe(mockExpressRequest)
    expect(crop.log.mock.calls[0][0].response).toBe(mockExpressResponse)
    expect(crop.log.mock.calls[0][0].wmsUrl).toBe('http://geoserver')
    expect(crop.log.mock.calls[0][0].error).toBe('unable to read WMS image data')

    done()
  }, 500)
})

test('crop bad jimp processing', done => {
  expect.assertions(17)

  /* setup successful WMS image data */
  jimp.canRead = true
  /* setup successful jimp process */
  jimp.canGetBuffer = false
  /* setup request */
  mockExpressRequest.params = {
    format: 'png',
    template: {metaTiles: 3}
  }

  crop(mockExpressRequest, mockExpressResponse, 'mock-buffer', 'http://geoserver')
  setTimeout(() => {
    expect(mockGoodImage.crop).toHaveBeenCalledTimes(0)

    expect(mockBadImage.getBuffer).toHaveBeenCalledTimes(1)
    expect(mockBadImage.getBuffer.mock.calls[0][0]).toBe('image/png')
    expect(typeof mockBadImage.getBuffer.mock.calls[0][1]).toBe('function')

    expect(mockExpressResponse.status).toHaveBeenCalledTimes(1)
    expect(mockExpressResponse.status.mock.calls[0][0]).toBe(500)

    expect(mockExpressResponse.write).toHaveBeenCalledTimes(1)
    expect(mockExpressResponse.write.mock.calls[0][0]).toBe('unable to read data from jimp image')

    expect(mockExpressResponse.end).toHaveBeenCalledTimes(1)
    expect(mockExpressResponse.end.mock.calls[0][0]).toBeNull()
    expect(mockExpressResponse.end.mock.calls[0][1]).toBe('binary')

    expect(crop.log).toHaveBeenCalledTimes(1)
    expect(crop.log.mock.calls[0][0].level).toBe('error')
    expect(crop.log.mock.calls[0][0].request).toBe(mockExpressRequest)
    expect(crop.log.mock.calls[0][0].response).toBe(mockExpressResponse)
    expect(crop.log.mock.calls[0][0].wmsUrl).toBe('http://geoserver')
    expect(crop.log.mock.calls[0][0].error).toBe('unable to read data from jimp image')

    done()
  }, 500)
})