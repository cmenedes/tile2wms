const server = require('../src/index')
const fetch = require('isomorphic-fetch')

test('integration test', done => {
  expect.assertions(0)

  fetch('http://localhost:8088/')
    .then(response => {
      response.text().then(text => {
        server.close()
        done()
      })
    })
})