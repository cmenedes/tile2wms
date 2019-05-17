const conf = require('./conf')
const http = require('http')
const writeCroppedResponse = require('./crop')
const statusAndHeaders = require('./statusAndHeaders')
const STATUS = statusAndHeaders.STATUS
const log = require('./logger').log

const proxy = (request, response, wmsUrl) => {
  const params = request.params
  const template = conf.layerWmsTemplates[params.layer]  
  const wmsRequest = http.request(wmsUrl, wmsResponse => {
    let wmsData = []
    statusAndHeaders(response, wmsResponse)
    wmsResponse.on('data', data => {
      if (!template || template.metaTiles < 2) {
        response.write(data)
      }
      wmsData.push(data)
    })
    wmsResponse.on('end', () => {
      if (response.statusCode !== STATUS.OK) {
        const error = new String(wmsData).toString()
        log({level: 'error', request, response, wmsUrl, error})
      } else {
        log({level: 'debug', request, response, wmsUrl})        
      }
      if (!template || template.metaTiles < 2) {
        response.end()
      } else {
        request.params.metaTiles = template.metaTiles
        writeCroppedResponse(request, response, Buffer.concat(wmsData), wmsUrl)
      }
    })
  })
  wmsRequest.on('error', error => {
    response.status(STATUS.ERROR)
    response.send()
    log({level: 'error', request, response, wmsUrl, error})
  })
  wmsRequest.end()
}

proxy.http = http
proxy.crop = writeCroppedResponse
proxy.log = log
proxy.statusAndHeaders = statusAndHeaders

module.exports = proxy