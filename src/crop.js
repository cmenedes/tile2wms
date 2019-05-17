const jimp = require('jimp')
const formats = require('./conf').formats
const log = require('./logger').log

const crop = (image, metaTiles) => {
  const top = (256 * (metaTiles - 1) / 2) + 1
  image.crop(top, top, 256, 265)
}

const cropWms = (request, response, wmsUrl) => {
  const params = request.params
  jimp.read(wmsUrl).then(image => {
    const mimeType = params.format === 'png8' ? formats.png : formats[params.format]
    log({level: 'debug', request, response, wmsUrl})        
    crop(image, params.metaTiles)
    image.getBuffer(mimeType, (error, buffer) => {
      if (error) throw error
      response.status(200)
      response.write(buffer, 'binary')
    })
  }).catch(err => {
    log({level: 'error', request, response, wmsUrl, err})
  }).finally(() => {
    response.end(null, 'binary')
  })
}

cropWms.crop = crop

exports.default = cropWms