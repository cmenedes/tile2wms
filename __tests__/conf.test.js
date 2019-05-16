const fs = require('fs')
const path = require('path')

const defaultFile = path.resolve(__dirname, '../conf.json')
const testFile = path.resolve(__dirname, 'test-conf.json')
const defaultConf = JSON.parse(fs.readFileSync(defaultFile))
const testConf = JSON.parse(fs.readFileSync(testFile))

beforeEach(() => {
  jest.resetModules()
})

test('conf location in code', () => {
  expect.assertions(1)
  process.env['CONF'] = ''
  const conf = require('../src/conf')
  expect(conf).toEqual(defaultConf)
})

test('conf location in env', () => {
  expect.assertions(1)
  process.env['CONF'] = testFile
  const conf = require('../src/conf')
  expect(conf).toEqual(testConf)
})