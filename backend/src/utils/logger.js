const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console({
      level: process.env.LOG_LEVEL || 'info',
    }),
  ],
});

logger.stream = {
  write: msg => logger.http(msg.trim()),
};

module.exports = logger;
