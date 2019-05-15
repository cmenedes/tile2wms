const conf = require('./conf')
const { createLogger, format, transports } = require('winston')
const { combine, timestamp, prettyPrint } = format

const logger = {
  out: new transports.Console(),
  log: (args) => {
    logger.winston = logger.winston || createLogger({
      level: conf.logLevel,
      format: combine(
        timestamp(),
        prettyPrint()
      ),
      transports: [logger.out]
    })
  
    const data = {
      originalUrl: args.request.originalUrl, 
      statusCode: args.response.statusCode, 
      wmsUrl: args.wmsUrl
    }
    if (args.error) {
      data.error = args.error
    }
    logger.winston[args.level](data)
  }
}

module.exports = logger