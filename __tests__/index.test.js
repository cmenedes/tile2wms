jest.mock('../src/tms')
jest.mock('../src/wmts')
jest.mock('../src/xyz')

const fetch = require('isomorphic-fetch')

let app
beforeEach(() => {
  app = require('../index')
  app.tmsHandler.mockClear()
  app.wmtsHandler.mockClear()
  app.xyzHandler.mockClear()
})

afterEach(() => {
  app.server.close()
})

test('tms route', done => {
  expect.assertions(2)

  fetch('http://localhost:8088/tms/mylayer/10/20/30.png')
    .then(response => {
      response.text().then(text => {
        expect(text).toBe('tms')
        expect(app.tmsHandler).toHaveBeenCalledTimes(1)
        done()
      })
    })
})