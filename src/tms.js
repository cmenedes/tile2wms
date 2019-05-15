const xyzHandler = require('./xyz')

const invert = (params) => {
  return -(Math.pow(2, params.z) - params.y - 1)
}

const tmsHandler = (request, response) => {
  const params = request.params
  request.params = {
    layer: decodeURIComponent(params.layer),
    z: params.z,
    x: params.x,
    y: invert(params),
    format: params.format
  }
  xyzHandler(request, response)
}

tmsHandler.xyzHandler = xyzHandler

module.exports = tmsHandler