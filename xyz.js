const tmsHandler = require('./tms')

function invert(z, y) {
  return Math.pow(2, z) - y - 1;
}

module.exports = (request, response) => {
  const params = request.params
  const tms = {
    layer: params.layer,
    x: params.x,
    y: invert(params.z, params.y),
    z: params.z
  }
  response.send(tmsHandler({params: tms}, response))
}