beforeEach(() => {
  jest.resetModules()
})

test('conf location in code', () => {
  expect.assertions(1)
  process.env['CONF'] = ''
  const conf = require('../src/conf')
  expect(Object.keys(conf).length).toBe(7)
})

test('conf location in env', () => {
  expect.assertions(2)
  process.env['CONF'] = __dirname + '/conf-ex.json'
  const conf = require('../src/conf')
  expect(conf).toEqual({ "conf-example": "mockValue" })
  expect(Object.keys(conf).length).toBe(1)
})