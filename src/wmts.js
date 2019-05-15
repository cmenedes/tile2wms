const tmsHandler = require('./tms')

function getZ(tileMatrix) {
  return tileMatrix.split(':')[2]
}

function lowerCaseKeys(query) {
  const lower = {}
  Object.keys(query).forEach(key => {
    lower[key.toLocaleLowerCase()] = query[key]
  })
  return lower
}

module.exports = (request, response) => {
  const query = lowerCaseKeys(request.query)
  request.params = {
    layer: query.layer,
    z: getZ(query.tilematrix),
    x: query.tilecol,
    y: query.tilerow,
    format: query.format
  }
  tmsHandler(request, response)
}