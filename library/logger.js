const config = require('@config');
const { createLogger, transports, format } = require('winston');
const moment = require('moment-timezone');

const logger = createLogger({
    level: config.server.log_level,
    format: format.combine(
        format.timestamp({
            format: () => moment().toISOString(true)
        }),
        format.json(),
    ),
    transports: [
        new transports.Console()
    ]
});

module.exports = logger;
