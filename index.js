const express = require('express')
const app = express()
const port = '8088'
const tmsHandler = require('./tms')
const xyzHandler = require('./xyz')
const wmtsHandler = require('./wtms')


app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/', (req, res) => {
  res.send('hello world')
})

app.get('/tms/:layer/:z/:x/:y.:format', tmsHandler)

app.get('/xyz/:layer/:z/:x/:y.:format', xyzHandler)

app.get('/wmts/', wmtsHandler)



module.exports = app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}`))