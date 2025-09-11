let logger;
try {
  const { createLogger, format, transports } = require('winston');
  logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [
      new transports.Console({
        level: process.env.LOG_LEVEL || 'http',
      }),
    ],
  });
  logger.stream = {
    write: msg => logger.http(msg.trim()),
  };
} catch (_) {
  logger = {
    error: console.error.bind(console),
    warn: console.warn.bind(console),
    info: console.log.bind(console),
    http: console.log.bind(console),
    stream: { write: msg => console.log(msg.trim()) },
  };
}

module.exports = logger;
