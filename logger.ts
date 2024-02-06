import winston from 'winston';

const buildFormatter = (isDev: boolean) => {
  if (isDev) {
    return winston.format.combine(
      winston.format.colorize(),
      winston.format.splat(),
      winston.format.simple(),
    );
  }

  return winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json(),
  );
};

const createLogger = (isDev: boolean) => {
  const logLevel = isDev ? 'debug' : 'info';
  const consoleTransport = new winston.transports.Console({
    level: logLevel,
    stderrLevels: [
      'emerg',
      'alert',
      'crit',
      'error',
    ],
  });
  const formatter = buildFormatter(isDev);

  const logger = winston.createLogger({
    exitOnError: false,
    transports: [consoleTransport],
    format: formatter,
  });

  logger.debug('Console based logger configured');

  return logger;
};

export type Logger = winston.Logger;

export default createLogger(true);
