require('dotenv').config()

const tilegrid = require('es5ol/tilegrid').createXYZ()
const xyz = require('../src/xyz')

const mockResponse = {
  send: jest.fn(),
  type: jest.fn(),
  status: jest.fn()
}

test('xyz to wms', () => {
  expect.assertions(0)

  const request = {
    params: {
      layer: 'transit:subway_station',
      z: '17',
      x: '38599',
      y: '49260',
      format: 'image/png'
    }
  }
  
  xyz(request, mockResponse)

})
