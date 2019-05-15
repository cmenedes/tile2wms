require('dotenv').config()

const express = require('express')
const app = express()
const conf = require('./src/conf')
const port = conf.port

app.tmsHandler = require('./src/tms')
app.xyzHandler = require('./src/xyz')
app.wmtsHandler = require('./src/wmts')

app.use((request, response, next) => {
  const headers = conf.headers;
  Object.keys(headers).forEach(header => {
    response.header(header, headers[header])
  })
  next()
})

app.get('/tms/:layer/:z/:x/:y.:format', app.tmsHandler)
app.get('/xyz/:layer/:z/:x/:y.:format', app.xyzHandler)
app.get('/wmts/', app.wmtsHandler)

app.server = app.listen(port, () => console.log(`tile2wms app listening on port ${port}`))

module.exports = app