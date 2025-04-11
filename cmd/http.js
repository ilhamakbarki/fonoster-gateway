const config = require('@config');
const moment = require('moment-timezone');
moment.tz.setDefault(config.server.timezone);
const logger = require('@library/logger');
const express = require('express');
const app = express();
const router = require('../handler/http/router');
const errorHandler = require('@utils/errors');

logger.info(`Start Server ${config.server.name}`)
app.use(router);
app.use(errorHandler.ErrorHandler);

app.listen(config.http.port, function () {
	logger.info({
		message: `Express server listening on port ${config.http.port}`
	})
});

process.on('SIGINT', async () => {
    process.exit(0);
});