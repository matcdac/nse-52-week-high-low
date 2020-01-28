const winston = require('winston');

const level = process.env.LOG_LEVEL || 'debug';

const loggerFormats = [winston.format.simple(), winston.format.timestamp()];

if (process.env.NODE_ENV !== 'local') {
  loggerFormats.push(winston.format.json());
}

const logger = winston.createLogger({
  name: 'console',
  transports: [new winston.transports.Console()],
  level: level,
  format: winston.format.combine(...loggerFormats),
});

global.logger = logger;
module.exports = logger;
