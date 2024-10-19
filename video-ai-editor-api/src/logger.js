const path = require('path');
const winston = require('winston');

const customFormat = winston.format.printf(({ timestamp, level, message, stack, label }) => {
  return `${timestamp} [${label}] ${level}: ${message} ${stack ? '\n' + stack : ''}`;
});

const logger = (className = 'server') => winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.label({ label: className }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    customFormat
  ),
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'server.log' })
  ]
});

module.exports = logger;
