const conf = require('./conf')
const http = require('http')
const proxyToWmsAndCrop = require('./crop')
const statusAndHeaders = require('./statusAndHeaders')
const STATUS = statusAndHeaders.STATUS
const log = require('./logger').log

const proxyToWms = (request, response, wmsUrl) => {
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
    response.status(STATUS.ERROR)
    response.send()
    log({level: 'error', request, response, wmsUrl, error})
  })
  wmsRequest.end()
}

const proxy = (request, response, wmsUrl) => {
  const params = request.params
  const template = conf.layerWmsTemplates[params.layer]
  if (template && template.metaTiles > 1) {
    request.params.metaTiles = template.metaTiles
    console.warn('proxtToWmsAndCrop');
    proxyToWmsAndCrop(request, response, wmsUrl)
  } else {
    console.warn('proxtToWms');
    proxyToWms(request, response, wmsUrl)
  }
}

proxy.http = http
proxy.crop = proxyToWmsAndCrop
proxy.log = log
proxy.statusAndHeaders = statusAndHeaders

module.exports = proxy