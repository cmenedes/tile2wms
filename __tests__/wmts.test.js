require('dotenv').config()

const tilegrid = require('../ol/tilegrid').createXYZ()
const wmts = require('../wmts')

const mockResponse = {
  send: jest.fn(),
  type: jest.fn(),
  status: jest.fn()
}

test('wmts to wms', () => {
  expect.assertions(0)

  const request = {
    query: {
      layer: 'transit:subway_station',
      Format: 'image/png',
      TileMatrix: 'EPSG:900913:17',
      TileCol: '38599',
      TileRow: '81811'
    }
  }
  
  wmts(request, mockResponse)


})
