const http = require('http')
const conf = require('./conf')
const log = require('./logger')

const errorHandler = (request, response, wmsUrl, error) => {
  response.status(500).send()
}

const statusAndHeaders = (response, wmsResponse) => {
  const status = wmsResponse.statusCode
  const contentType = wmsResponse.headers['content-type']
  if (status === 200 && contentType.indexOf('xml') > -1) {
    response.status(500)
  } else {
    response.status(status)
  }
  response.type(contentType)
  conf.copyHeaders.forEach(header => {
    const value = wmsResponse.headers[header]  
    if (value) {
      response.header(header, value)
    }
  })
}

const proxy = (request, response, wmsUrl) => {
  const wmsRequest = http.request(wmsUrl, wmsResponse => {
    let buffer
    statusAndHeaders(response, wmsResponse)
    wmsResponse.on('data', data => {
      response.write(data)
      buffer = buffer ? (buffer += data) : data
    })
    wmsResponse.on('end', () => {
      if (response.statusCode !== 200) {
        const error = new String(buffer).toString()
        log({
          level: 'error',
          request: request, 
          response: response,
          wmsUrl: wmsUrl,
          error: error
        })
      } else {
        log({
          level: 'debug',
          request: request,
          response: response, 
          wmsUrl: wmsUrl
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

proxy.log = log

module.exports = proxy