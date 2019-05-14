const tilegrid = require('es5ol/tilegrid').createXYZ()
const proxy = require('./proxy')
const conf = require('./conf')
const formats = conf.formats

module.exports = (request, response) => {
  const params = request.params
  const layer = params.layer
  const mimeType = formats[params.format] || params.format
  const extent = tilegrid.getTileCoordExtent([params.z * 1, params.x * 1, -(Math.abs(params.y) + 1)])  
  let wmsUrl = conf.layerWmsTemplates[layer] || conf.defaultWmsTemplate
  wmsUrl += `&LAYERS=${layer}`
  wmsUrl += `&BBOX=${extent.join(',')}`
  wmsUrl += `&FORMAT=${mimeType}` 
  proxy(request, response, wmsUrl)
}