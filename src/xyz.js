const tilegrid = require('es5ol/tilegrid').createXYZ()
const extent = require('es5ol/extent')
const proxy = require('./proxy')
const conf = require('./conf')
const formats = conf.formats

const getTemplate = (layer) => {
  return conf.layerWmsTemplates[layer]
}

const bbox = params => {
  const template = getTemplate(params.layer)
  const metaTiles = template ? template.metaTiles : 1
  let bbox = tilegrid.getTileCoordExtent([params.z * 1, params.x * 1, -(Math.abs(params.y) + 1)])  
  if (metaTiles > 1) {
    const width = extent.getWidth(bbox)
    const diff = (width * (metaTiles - 1)) / 2
    bbox = [bbox[0] - diff, bbox[1] - diff, bbox[2] + diff, bbox[3] + diff]
  }
  return bbox.join(',')
}
const xyzHandler = (request, response) => {
  const params = request.params
  const layer = params.layer
  const mimeType = formats[params.format] || params.format
  const template = getTemplate(layer)
  const width = template && template.metaTiles ? template.metaTiles * 256 : 256
  let wmsUrl = template ? template.wmsTemplate : conf.defaultWmsTemplate
  wmsUrl += `&LAYERS=${layer}`
  wmsUrl += `&WIDTH=${width}`
  wmsUrl += `&HEIGHT=${width}`
  wmsUrl += `&BBOX=${bbox(params)}`
  wmsUrl += `&FORMAT=${mimeType}` 
  proxy(request, response, wmsUrl)
}

xyzHandler.proxy = proxy

module.exports = xyzHandler