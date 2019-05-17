const tilegrid = require('es5ol/tilegrid').createXYZ()
const extent = require('es5ol/extent')
const proxy = require('./proxy')
const conf = require('./conf')
const formats = conf.formats

const bbox = params => {
  const template = params.template
  const metaTiles = template ? template.metaTiles : 1
  const bbox = tilegrid.getTileCoordExtent([params.z * 1, params.x * 1, -(Math.abs(params.y) + 1)])  
  let diff = 0
  if (metaTiles > 1) {
    const width = extent.getWidth(bbox)
    diff = (width * (metaTiles - 1)) / 2
  }
  return [bbox[0] - diff, bbox[1] - diff, bbox[2] + diff, bbox[3] + diff].join(',')
}

const xyzHandler = (request, response) => {
  const params = request.params
  const layer = params.layer
  const mimeType = formats[params.format] || params.format
  const template = conf.layerWmsTemplates[layer]
  const width = template && template.metaTiles ? template.metaTiles * 256 : 256
  let wmsUrl = template ? template.wmsTemplate : conf.defaultWmsTemplate
  params.template = template
  wmsUrl += `&LAYERS=${layer}`
  wmsUrl += `&WIDTH=${width}`
  wmsUrl += `&HEIGHT=${width}`
  wmsUrl += `&BBOX=${bbox(params)}`
  wmsUrl += `&FORMAT=${mimeType}` 
  proxy(request, response, wmsUrl)
}

xyzHandler.proxy = proxy

module.exports = xyzHandler