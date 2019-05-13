require('dotenv').config()

const tilegrid = require('../ol/tilegrid').createXYZ()
const tms = require('../tms')

const mockResponse = {
  send: jest.fn(),
  redirect: jest.fn()
}

test('tms to wms', () => {
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

  expect(mockResponse.redirect.mock.calls[0][0]).toBe('http://localhost:8080/geoserver/wms/?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&WIDTH=256&HEIGHT=256&CRS=EPSG:900913&LAYERS=transit:subway_station&BBOX=-8235936.923671171,4976050.541364973,-8235631.175558031,4976356.289478114&FORMAT=image/png')
})
