
jest.mock('../src/xyz')

const tms = require('../src/tms')

const mockResponse = {
  send: jest.fn()
}
beforeEach(() => {
  tms.xyzHandler.mockClear()
})

test('tms to wms', () => {
  expect.assertions(10)

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

  expect(tms.xyzHandler).toHaveBeenCalledTimes(1)
  expect(tms.xyzHandler.mock.calls[0][0]).toBe(request)
  expect(tms.xyzHandler.mock.calls[0][0].params.layer).toBe('transit:subway_station')
  expect(tms.xyzHandler.mock.calls[0][0].params.z).toBe('17')
  expect(tms.xyzHandler.mock.calls[0][0].params.x).toBe('38599')
  expect(tms.xyzHandler.mock.calls[0][0].params.y).toBe(-49260)
  expect(tms.xyzHandler.mock.calls[0][0].params.format).toBe('png')
  expect(tms.xyzHandler.mock.calls[0][1]).toBe(mockResponse)
  expect(mockResponse.send).toHaveBeenCalledTimes(1)
  expect(mockResponse.send.mock.calls[0][0]).toBe('xyz')
})
