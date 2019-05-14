const conf = require('./conf')
const { createLogger, format, transports } = require('winston')
const { combine, timestamp, prettyPrint } = format

const logger = createLogger({
  level: conf.logLevel,
  format: combine(
    timestamp(),
    prettyPrint()
  ),
  transports: [new transports.Console()]
})

module.exports = args => {
  const data = {
    originalUrl: args.request.originalUrl, 
    statusCode: args.response.statusCode, 
    wmsUrl: args.wmsUrl
  }
  if (args.error) {
    data.error = args.error
  }
  logger[args.level](data)
}
