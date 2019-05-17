const conf = require('./conf')
const STATUS = {OK: 200, ERROR: 500}

const statusAndHeaders = (response, wmsResponse) => {
  const wmsStatusCode = wmsResponse.statusCode  
  const contentType = wmsResponse.headers['content-type']
  if (wmsStatusCode === STATUS.OK && contentType.indexOf('xml') > -1) {
    response.status(STATUS.ERROR)
  } else {
    response.status(wmsStatusCode)
  }
  response.type(contentType)
  conf.copyFromWmsHeaders.forEach(header => {
    const value = wmsResponse.headers[header]  
    if (value) {
      response.header(header, value)
    }
  })
}

statusAndHeaders.STATUS = STATUS

module.exports = statusAndHeaders