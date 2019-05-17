const path =require('path')
const jimp = require('jimp')
const formats = require('./conf').formats
const btoa = require('btoa')
const log = require('./logger').log

const crop = (image, metaTiles) => {
  const top = (256 * (metaTiles - 1) / 2) + 1
  image.crop(top, top, 256, 265)
}

const cropWms = (request, response, buffer, wmsUrl) => {
  const params = request.params
  jimp.read(buffer).then(image => {
    //image.writeAsync(path.resolve(__dirname, 'wtf.png'))
    const mimeType = params.format === 'png8' ? formats.png : formats[params.format]
    log({level: 'debug', request, response, wmsUrl})        
    crop(image, params.metaTiles)    
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

cropWms.crop = crop

module.exports = cropWms