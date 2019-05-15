const http = require('http')
const conf = require('./conf')
const log = require('./logger')

const STATUS = {
  OK: 200,
  ERROR: 500
}

const statusAndHeaders = (response, wmsResponse) => {
  const status = wmsResponse.statusCode
  const contentType = wmsResponse.headers['content-type']
  if (status === STATUS.OK && contentType.indexOf('xml') > -1) {
    response.status(STATUS.ERROR)
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
      if (response.statusCode !== STATUS.OK) {
        const error = new String(buffer).toString()
        log({level: 'error', request, response, wmsUrl, error})
      } else {
        log({level: 'debug', request, response, wmsUrl})        
      }
      response.end()
    })
  })
  wmsRequest.on('error', error => {
    response.status(STATUS.ERROR).send()
    log({level: 'error', request, response, wmsUrl, error})
  })
  wmsRequest.end()
}

proxy.http = http
proxy.log = log
proxy.statusAndHeaders = statusAndHeaders

module.exports = proxy