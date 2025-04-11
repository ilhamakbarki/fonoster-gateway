const express = require('express');
const router = express.Router();
const response = require('@utils/response');
const logger = require('@library/logger');
const { fonosterClient } = require('@library/fonoster');

router.get('/health', async (req, res) => {
    try {
        let fonosterStatus;
        try {
            const clients = await fonosterClient();
            clients.getMetadata();
            fonosterStatus = true;
        } catch (err) {
            fonosterStatus = false;
        }
        logger.info({
            request_param: req.query,
            message: 'Im Health'
        });
        res.status(200).json(response('Im Health', {
            fonoster_service: fonosterStatus,
        }));
    } catch (error) {
        logger.error({
            request_param: req.query,
            message: error.message,
            error,
        });
        res.status(500).json(response(error.message, null, false, '500'));
    }
});

module.exports = router;