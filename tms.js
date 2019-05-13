const xyzHandler = require('./xyz')

const invert = (params) => {
  return -(Math.pow(2, params.z) - params.y - 1)
}

module.exports = (request, response) => {
  const params = request.params
  const xyz = {
    layer: decodeURIComponent(params.layer),
    z: params.z,
    x: params.x,
    y: invert(params),
    format: params.format
  }
  xyzHandler({params: xyz}, response)
}