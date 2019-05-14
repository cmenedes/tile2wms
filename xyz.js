var http = require('http')

const tilegrid = require('./ol/tilegrid').createXYZ()
const formats = require('./formats')

const failOnWmsException = (response, wmsResponse) => {
  const status = wmsResponse.statusCode
  const contentType = wmsResponse.headers['content-type']
  if (status === 200 && contentType.indexOf('xml') > -1) {
    response.status(500)
  } else {
    response.status(status)
  }
  response.type(contentType)
}

const proxy = (request, response, url) => {
  const wmsRequest = http.request(url, wmsResponse => {
    let buffer
    failOnWmsException(response, wmsResponse)
    wmsResponse.on('data', data => {
      buffer = buffer ? (buffer += data) : data
    })
    wmsResponse.on('end', () => {
      if (response.statusCode !== 200) {
        console.log(request.originalUrl, new String(buffer).toString())
      }
      response.send(buffer)
      response.end()
    })
  })
  wmsRequest.end()
}

module.exports = (request, response) => {
  const env = process.env
  const params = request.params
  const mimeType = formats[params.format] || params.format
  const extent = tilegrid.getTileCoordExtent([params.z * 1, params.x * 1, -(Math.abs(params.y) + 1)])  

  let url = env.WMS_URL_TEMPLATE
  url += `&LAYERS=${params.layer}`
  url += `&BBOX=${extent.join(',')}`
  url += `&FORMAT=${mimeType}` 

  proxy(request, response, url)
}