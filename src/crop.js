const jimp = require('jimp')
const formats = require('./conf').formats
const log = require('./logger').log

const cropImg = (image, metaTiles) => {
  const top = (256 * (metaTiles - 1) / 2) + 1
  image.crop(top, top, 256, 256)
}

const crop = (request, response, buffer, wmsUrl) => {
  const params = request.params
  jimp.read(buffer).then(image => {
    const mimeType = params.format === 'png8' ? formats.png : formats[params.format]
    cropImg(image, params.template.metaTiles)
    image.getBuffer(mimeType, (error, buff) => {
      if (error) throw error
      log({level: 'debug', request, response, wmsUrl})        
      response.write(buff, 'binary')
    })
  }).catch(err => {
    log({level: 'error', request, response, wmsUrl, error: err})
    response.status(500)
    response.write(err)
  }).finally(() => {
    response.end(null, 'binary')
  })
}

crop.log = log
crop.jimp = jimp

module.exports = crop