jest.mock('../src/tms')

require('dotenv').config()

const wmts = require('../src/wmts')

const mockResponse = {
  send: jest.fn()
}

test('wmts to wms', () => {
  expect.assertions(10)

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

  expect(wmts.tmsHandler).toHaveBeenCalledTimes(1)
  expect(wmts.tmsHandler.mock.calls[0][0]).toBe(request)
  expect(wmts.tmsHandler.mock.calls[0][0].params.layer).toBe('transit:subway_station')
  expect(wmts.tmsHandler.mock.calls[0][0].params.z).toBe('17')
  expect(wmts.tmsHandler.mock.calls[0][0].params.x).toBe('38599')
  expect(wmts.tmsHandler.mock.calls[0][0].params.y).toBe('81811')
  expect(wmts.tmsHandler.mock.calls[0][0].params.format).toBe('image/png')
  expect(wmts.tmsHandler.mock.calls[0][1]).toBe(mockResponse)
  expect(mockResponse.send).toHaveBeenCalledTimes(1)
  expect(mockResponse.send.mock.calls[0][0]).toBe('tms')
})
