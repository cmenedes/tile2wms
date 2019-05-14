const http = require('http')
const tilegrid = require('./ol/tilegrid').createXYZ()
const formats = require('./formats')
const { createLogger, format, transports } = require('winston')
const { combine, timestamp, prettyPrint } = format

const logger = createLogger({
  level: process.env.LOG_LEVEL,
  format: combine(
    timestamp(),
    prettyPrint()
  ),
  transports: [new transports.Console()]
})

const log = (logIt) => {
  const data = {
    originalUrl: logIt.request.originalUrl, 
    statusCode: logIt.response.statusCode, 
    wmsUrl: logIt.wmsUrl
  }
  if (logIt.error) {
    data.error = logIt.error
  }
  logger[logIt.level](data)

}

const errorHandler = (request, response, wmsUrl, error) => {
  response.status(500).send()
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
      if (response.statusCode !== 200) {
        const error =  new String(buffer).toString()
        log({
          level: 'error',
          request: request, 
          response: response,
          wmsUrl: wmsUrl,
          error: error
        })
      }
      response.end()
    })
  })
  wmsRequest.on('error', error => {
    response.status(500).send()
    log({
      level: 'error',
      request: request, 
      response: response, 
      wmsUrl: wmsUrl, 
      error: error
    })
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

  log({
    level: 'debug',
    request: request,
    response: response, 
    wmsUrl: wmsUrl
  })
}