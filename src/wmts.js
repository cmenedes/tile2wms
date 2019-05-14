const tmsHandler = require('./tms')

function getZ(tileMatrix) {
  return tileMatrix.split(':')[2]
}

module.exports = (request, response) => {
  const query = request.query
  request.params = {
    layer: decodeURIComponent(query.layer),
    z: getZ(decodeURIComponent(query.TileMatrix)),
    x: query.TileCol,
    y: query.TileRow,
    format: decodeURIComponent(query.Format)
  }
  tmsHandler(request, response)
}