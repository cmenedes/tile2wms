const tilegrid = require('./ol/tilegrid').createXYZ()

const formats = {
  png: 'image/png',
  pbf: 'application/x-protobuf;type=mapbox-vector'
}

module.exports = (request, response) => {
  const params = request.params
  const extent = tilegrid.getTileCoordExtent([params.z, params.x, params.y - 1])  
  let url = process.env.WMS_TEMPLATE_URL
  url += `&LAYERS=${params.layer}`
  url += `&BBOX=${extent.join(',')}`
  url += `&FORMAT=${formats[params.format] || params.format}`
  response.redirect(url)
}