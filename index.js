require('dotenv').config()

const express = require('express')
const app = express()
const conf = require('./src/conf')
const port = conf.port || 8088

app.tmsHandler = require('./src/tms')
app.xyzHandler = require('./src/xyz')
app.wmtsHandler = require('./src/wmts')

app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/tms/:layer/:z/:x/:y.:format', app.tmsHandler)
app.get('/xyz/:layer/:z/:x/:y.:format', app.xyzHandler)
app.get('/wmts/', app.wmtsHandler)

app.server = app.listen(port, () => console.log(`tile2wms app listening on port ${port}`))

module.exports = app