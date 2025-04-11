const express = require('express');
const router = express.Router();
const parser = require('body-parser');
const health = require('./v1/health');
const agents = require('./v1/agents');
const creds = require('./v1/credentials');
const domains = require('./v1/domains');
const config = require('@config');
const authApiKey = require('@middlewares/authApiKey');

router.use(parser.urlencoded({ extended: false, limit: `${config.upload.max_upload}mb` }));
router.use(parser.json({ limit: `${config.upload.max_upload}mb` }));
router.use('/public', express.static('public'));
router.use('/api/v1',
    health,
    authApiKey,
    agents,
    creds,
    domains,
);

module.exports = router;