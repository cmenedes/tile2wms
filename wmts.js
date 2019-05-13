const tmsHandler = require('./tms')

function getZ(tileMatrix) {
  return tileMatrix.split(':')[2]
}

module.exports = (request, response) => {
  const query = request.query
  const tms = {
    layer: decodeURIComponent(query.layer),
    z: getZ(decodeURIComponent(query.TileMatrix)),
    x: query.TileCol,
    y: query.TileRow,
    format: decodeURIComponent(query.Format)
  }
  response.send(tmsHandler({params: tms}, response))
}