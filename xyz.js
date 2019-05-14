var http = require('http')

const tilegrid = require('./ol/tilegrid').createXYZ()
const formats = require('./formats')

const log = (request, response, wmsUrl, error) => {
  console.error(request.originalUrl, response.statusCode, wmsUrl, error)
}

const errorHandler = (request, response, wmsUrl, error) => {
  response.status(500).send()
  log(request.originalUrl, response.statusCode, wmsUrl, error)
}

const statusAndType = (response, wmsResponse) => {
  const status = wmsResponse.statusCode
  const contentType = wmsResponse.headers['content-type']
  if (status === 200 && contentType.indexOf('xml') > -1) {
    response.status(500)
  } else {
    response.status(status)
  }
  response.type(contentType)
}

const proxy = (request, response, wmsUrl) => {
  const wmsRequest = http.request(wmsUrl, wmsResponse => {
    let buffer
    statusAndType(response, wmsResponse)
    wmsResponse.on('data', data => {
      response.write(data)
      buffer = buffer ? (buffer += data) : data
    })
    wmsResponse.on('end', () => {
      console.warn('!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
      if (response.statusCode !== 200) {
        log(request, response, wmsUrl, new String(buffer).toString())
      }
      response.end()
    })
  })
  wmsRequest.on('error', error => {
    response.status(500).send()
    log(request, response, wmsUrl)
  })
  wmsRequest.end()
}

module.exports = (request, response) => {
  const env = process.env
  const params = request.params
  const mimeType = formats[params.format] || params.format
  const extent = tilegrid.getTileCoordExtent([params.z * 1, params.x * 1, -(Math.abs(params.y) + 1)])  

  let wmsUrl = env.WMS_URL_TEMPLATE
  wmsUrl += `&LAYERS=${params.layer}`
  wmsUrl += `&BBOX=${extent.join(',')}`
  wmsUrl += `&FORMAT=${mimeType}` 

  proxy(request, response, wmsUrl)
}