require('dotenv').config()
const fs = require('fs')
module.exports = JSON.parse(fs.readFileSync(process.env.CONF || './conf.json'))