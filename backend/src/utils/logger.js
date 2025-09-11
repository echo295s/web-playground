const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', '..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

let logger;
try {
  const { createLogger, format, transports } = require('winston');
  const loggerTransports = [
    new transports.File({
      filename: path.join(logDir, 'combined.log'),
      level: 'info',
    }),
  ];

  if (process.env.ENABLE_CONSOLE_LOGS !== 'false') {
    loggerTransports.push(
      new transports.Console({
        level: process.env.LOG_LEVEL || 'http',
      })
    );
  }

  logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: loggerTransports,
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

