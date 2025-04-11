require('module-alias/register');
const config = require('@config');
const moment = require('moment-timezone');
moment.tz.setDefault(config.server.timezone);
const logger = require('@library/logger');
require('@models/index.js');

const command = process.argv[2];
const subcommand = process.argv[3] || 'http';

if (command === 'start') {
    switch (subcommand) {
        case 'http':
            require('./cmd/http.js');
            break;
        default:
            logger.error('Available sub command for start: http');
            break;
    }
} else {
    logger.error('Unknown command. Use: start');
}