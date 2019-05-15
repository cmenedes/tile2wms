class MockRequest {
  constructor() {
    this.handlers = {}
    this.end = jest.fn().mockImplementation(() => {
      if (this.handlers.end) {
        this.handlers.end()
      }
    })
  }
  on(event, callback) {
    this.handlers[event] = callback
  }
}

class MockResponse extends MockRequest {
  constructor() {
    super()
    this.write = jest.fn()
    this.send = jest.fn()
    this.type = jest.fn()
    this.header = jest.fn()
    this.status = jest.fn().mockImplementation(statusCode => {
      this.statusCode = statusCode
    })
  }
  data(data) {
    this.handlers.data(data)
  }
}

const http = {
  mockRequest: () => {
    return new MockRequest()
  },
  mockResponse: () => {
    return new MockResponse()
  },
  request: jest.fn().mockImplementation((url, callback) => {
    setTimeout(() => {
      const response = new MockResponse()
      response.headers = http.headers
      response.statusCode = http.statusCode
      http.wmsResponse = response
      callback(response)
    }, 100)
    const request = new MockRequest()
    http.wmsRequest = request
    return request
  }),
  resetMocks: () => {
    http.request.mockClear()
    http.headers = undefined
    http.statusCode = undefined
    http.wmsResponse = undefined
    http.wmsRequest = undefined
  }
}

module.exports = http
