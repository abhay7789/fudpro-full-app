const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const logDir = path.join(__dirname, '../logs');

// Custom format for date-time till milliseconds: YYYY-MM-DD-HH-mm-ss-SSS
const preciseTimestamp = winston.format((info) => {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toISOString().split('T')[1].replace('Z', '').replace(':', '-').replace(':', '-').replace('.', '-');
  info.timestamp = `${date}-${time}`;
  return info;
});

const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

const transportOptions = (filename) => ({
  dirname: logDir,
  filename: `${filename}-%DATE%.log`,
  datePattern: 'YYYY-MM-DD-HH-mm-ss-SSS', // This is for rotation, but user wants naming pattern
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    preciseTimestamp(),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    }),
    new winston.transports.DailyRotateFile({
      level: 'error',
      dirname: logDir,
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH-mm-ss-SSS',
      zippedArchive: true,
      maxSize: '20m',
    }),
    new winston.transports.DailyRotateFile({
      dirname: logDir,
      filename: 'combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH-mm-ss-SSS',
      zippedArchive: true,
      maxSize: '20m',
    })
  ],
});

module.exports = logger;
