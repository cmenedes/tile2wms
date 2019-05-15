jest.mock('../src/proxy')
jest.mock('../src/logger')

require('dotenv').config()

const xyz = require('../src/xyz')

const mockResponse = {
  send: jest.fn()
}

beforeEach(() => {
  xyz.proxy.mockClear()
})

test('xyz to wms with mapped format', () => {
  expect.assertions(9)

  const request = {
    params: {
      layer: 'transit:subway_station',
      z: '17',
      x: '38599',
      y: '49260',
      format: 'png'
    }
  }
  
  xyz(request, mockResponse)

  expect(xyz.proxy).toHaveBeenCalledTimes(1)
  expect(xyz.proxy.mock.calls[0][0]).toBe(request)
  expect(xyz.proxy.mock.calls[0][0].params.layer).toBe('transit:subway_station')
  expect(xyz.proxy.mock.calls[0][0].params.z).toBe('17')
  expect(xyz.proxy.mock.calls[0][0].params.x).toBe('38599')
  expect(xyz.proxy.mock.calls[0][0].params.y).toBe('49260')
  expect(xyz.proxy.mock.calls[0][0].params.format).toBe('png')
  expect(xyz.proxy.mock.calls[0][1]).toBe(mockResponse)
  expect(xyz.proxy.mock.calls[0][2]).toBe('http://localhost:8080/geoserver/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&WIDTH=256&HEIGHT=256&CRS=EPSG:900913&TRANSPARENT=true&LAYERS=transit:subway_station&BBOX=-8235936.923671171,4976050.541364973,-8235631.175558031,4976356.289478114&FORMAT=image/png')

})

test('xyz to wms with unmapped format', () => {
  expect.assertions(9)

  const request = {
    params: {
      layer: 'transit:subway_station',
      z: '17',
      x: '38599',
      y: '49260',
      format: 'application/json'
    }
  }
  
  xyz(request, mockResponse)

  expect(xyz.proxy).toHaveBeenCalledTimes(1)
  expect(xyz.proxy.mock.calls[0][0]).toBe(request)
  expect(xyz.proxy.mock.calls[0][0].params.layer).toBe('transit:subway_station')
  expect(xyz.proxy.mock.calls[0][0].params.z).toBe('17')
  expect(xyz.proxy.mock.calls[0][0].params.x).toBe('38599')
  expect(xyz.proxy.mock.calls[0][0].params.y).toBe('49260')
  expect(xyz.proxy.mock.calls[0][0].params.format).toBe('application/json')
  expect(xyz.proxy.mock.calls[0][1]).toBe(mockResponse)
  expect(xyz.proxy.mock.calls[0][2]).toBe('http://localhost:8080/geoserver/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&WIDTH=256&HEIGHT=256&CRS=EPSG:900913&TRANSPARENT=true&LAYERS=transit:subway_station&BBOX=-8235936.923671171,4976050.541364973,-8235631.175558031,4976356.289478114&FORMAT=application/json')

})
