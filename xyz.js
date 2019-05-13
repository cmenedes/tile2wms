const http = require('http')
const tilegrid = require('./ol/tilegrid').createXYZ()
const formats = require('./formats')

module.exports = (request, response) => {
  const params = request.params
  const extent = tilegrid.getTileCoordExtent([params.z * 1, params.x * 1, -(Math.abs(params.y) + 1)])  
  let url = process.env.WMS_TEMPLATE_URL
  url += `&LAYERS=${params.layer}`
  url += `&BBOX=${extent.join(',')}`
  url += `&FORMAT=${formats[params.format] || params.format}`
    
  //response.send(`<html><head><body><a href=${url}>${url}</a>`)
  response.redirect(url)
}