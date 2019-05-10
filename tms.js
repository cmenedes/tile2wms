const tilegrid = require('./ol/tilegrid').createXYZ()

const formats = {
  png: 'image/png',
  pbf: 'application/x-protobuf;type=mapbox-vector'
}

module.exports = (request, response) => {
  const params = request.params
  const extent = tilegrid.getTileCoordExtent([params.z, params.x, params.y])
  let url = process.env.WMS_TEMPLATE_URL
  url += `&layers=${params.layer}`
  url += `&bbox=${extent.join(',')}`
  url += `&format=${formats[params.format]}`

  console.warn(url)
  response.redirect(url)
}