module.exports = jest.fn().mockImplementation((request, response) => {
  response.send('xyz')
})