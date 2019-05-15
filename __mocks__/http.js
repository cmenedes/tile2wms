class MockRequest {
  constructor() {
    this.handlers = {}
  }
  on(event, callback) {
    this.handlers[event] = callback
  }
  end() {
    if (this.handlers.end) {
      this.handlers.end()
    }
  }
}

class MockResponse {
  constructor() {
    this.handlers = {}
    this.write = jest.fn()
    this.send = jest.fn()
    this.status = jest.fn()
    this.type = jest.fn()
  }
  on(event, callback) {
    this.handlers[event] = callback
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
      callback(http.mockResponse())
    }, 100)
    return http.mockRequest()
  }),
  resetMocks: () => {
    http.request.mockClear()
  }
}

module.exports = http
