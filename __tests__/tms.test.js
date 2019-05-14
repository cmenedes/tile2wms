require('dotenv').config()

const tilegrid = require('es5ol/tilegrid').createXYZ()
const tms = require('../src/tms')

const mockResponse = {
  send: jest.fn(),
  type: jest.fn(),
  status: jest.fn()
}

test('tms to wms', () => {
  expect.assertions(0)

  const request = {
    params: {
      layer: 'transit:subway_station',
      z: '17',
      x: '38599',
      y: '81811',
      format: 'png'
    }
  }
  
  tms(request, mockResponse)

})
