const server = require('../index')
const fetch = require('isomorphic-fetch')

test('integration test', done => {
  expect.assertions(1)

  fetch('http://localhost:8088/')
    .then(response => {
      response.text().then(text => {
        expect(text).toBe('hello world')
        server.close()
        done()
      })
    })
})