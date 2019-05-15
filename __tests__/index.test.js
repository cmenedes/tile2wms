const fetch = require('isomorphic-fetch')

jest.mock('../src/tms')
jest.mock('../src/wmts')
jest.mock('../src/xyz')

let app
beforeEach(() => {
  app = require('../index')
  app.tmsHandler.mockClear()
  app.wmtsHandler.mockClear()
  app.xyzHandler.mockClear()
})

afterAll(() => {
  app.server.close()
})

test('tms route', done => {
  expect.assertions(7)

  fetch('http://localhost:8088/tms/mylayer/10/20/30.png')
    .then(response => {
      response.text().then(text => {
        expect(text).toBe('tms')
        expect(app.tmsHandler).toHaveBeenCalledTimes(1)
        expect(app.tmsHandler.mock.calls[0][0].params.layer).toBe('mylayer')
        expect(app.tmsHandler.mock.calls[0][0].params.z).toBe('10')
        expect(app.tmsHandler.mock.calls[0][0].params.x).toBe('20')
        expect(app.tmsHandler.mock.calls[0][0].params.y).toBe('30')
        expect(app.tmsHandler.mock.calls[0][0].params.format).toBe('png')
        done()
      })
    })
})

test('wmts route', done => {
  expect.assertions(7)
  fetch('http://localhost:8088/wmts/?layer=yourlayer&Request=GetTile&Format=image%2Fjpeg&TileMatrix=EPSG%3A900913%3A10&TileCol=300&TileRow=386')
    .then(response => {
      response.text().then(text => {
        expect(text).toBe('wmts')
        expect(app.wmtsHandler).toHaveBeenCalledTimes(1)
        expect(app.wmtsHandler.mock.calls[0][0].query.layer).toBe('yourlayer')
        expect(app.wmtsHandler.mock.calls[0][0].query.TileMatrix).toBe('EPSG:900913:10')
        expect(app.wmtsHandler.mock.calls[0][0].query.TileCol).toBe('300')
        expect(app.wmtsHandler.mock.calls[0][0].query.TileRow).toBe('386')
        expect(app.wmtsHandler.mock.calls[0][0].query.Format).toBe('image/jpeg')
        done()
      })
    })
})