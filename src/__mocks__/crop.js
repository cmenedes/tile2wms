const mock = jest.fn().mockImplementation((request, response, buffer, wmsUrl) => {
  if (mock.fail) {
    throw 'crop failed'
  } else {
    response.write(buffer)
    response.end()
  }
})

module.exports = mock