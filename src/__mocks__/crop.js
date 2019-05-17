const mock = jest.fn().mockImplementation((request, response, wmsUrl) => {
  if (mock.fail) {
    throw 'crop failed'
  } else {
    response.send('crop')
  }
})

module.exports = mock