const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize} = format;

const upperCaseLevel = format((info) => {
    info.level = info.level.toUpperCase();
    return info;
  });

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'nextjs-app' }),
    timestamp(),
    upperCaseLevel(),
    colorize(), 
    myFormat
  ),
  transports: [
    new transports.Console(),    
  ],
});

module.exports = logger;