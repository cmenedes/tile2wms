require('dotenv').config()

const express = require('express')
const app = express()
const tmsHandler = require('./src/tms')
const xyzHandler = require('./src/xyz')
const wmtsHandler = require('./src/wmts')
const conf = require('./src/conf')
const port = conf.port || 8088

app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/tms/:layer/:z/:x/:y.:format', tmsHandler)

app.get('/xyz/:layer/:z/:x/:y.:format', xyzHandler)

app.get('/wmts/', wmtsHandler)

module.exports = app.listen(port, () => console.log(`tile2wms app listening on port ${port}`))