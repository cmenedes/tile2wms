const tmsHandler = require('./tms')

function getZ(tileMatrix) {
  return tileMatrix.split(':')[2]
}

module.exports = (request, response) => {
  const query = request.query
  const tms = {
    layer: query.layer,
    format: query.Format,
    z: getZ(query.TileMatrix),
    x: query.TileCol,
    y: query.TileRow
  }
  response.send(tmsHandler({params : tms}, response))
}