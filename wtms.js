const tmsHandler = require('./tms')

function getZ(tileMatrix) {
  return tileMatrix.split(':')[2]
}

module.exports = (request, response) => {
  const query = request.query
  const tms = {
    layer: query.layer,
    z: getZ(query.TileMatrix),
    x: query.TileCol,
    y: query.TileRow,
    format: query.Format
  }
  response.send(xyzHandler({params: tms}, response))
}