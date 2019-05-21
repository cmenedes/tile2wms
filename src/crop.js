const jimp = require('jimp')
const formats = require('./conf').formats
const log = require('./logger').log

const cropImg = (image, metaTiles) => {
  const top = (256 * (metaTiles - 1) / 2) + 1
  image.crop(top, top, 256, 265)
}

const crop = (request, response, buffer, wmsUrl) => {
  const params = request.params
  jimp.read(buffer).then(image => {
    const mimeType = params.format === 'png8' ? formats.png : formats[params.format]
    log({level: 'debug', request, response, wmsUrl})        
    cropImg(image, params.template.metaTiles)    
    image.getBuffer(mimeType, (error, buff) => {
      if (error) throw error
      response.write(buff, 'binary')
    })
  }).catch(err => {
    log({level: 'error', request, response, wmsUrl, err})
  }).finally(() => {
    response.end(null, 'binary')
  })
}

crop.log = log
crop.crop = cropImg

module.exports = crop