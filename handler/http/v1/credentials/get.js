const express = require('express');
const router = express.Router();
const Joi = require("joi");
const validation = require('@middlewares/formValidation');
const logger = require('@library/logger');
const response = require('@utils/response');
const { listCredentials } = require('@services/credentials/get');

const schema = Joi.object({
    page_token: Joi.string().empty(''),
    page_size: Joi.number().min(1).empty('').default(10),
});

router.get('/', validation({ query: schema }), async (req, res) => {
    try {
        const result = await listCredentials(req.query);
        return res.status(parseInt(result.code)).json(result);
    } catch (error) {
        logger.error({
            request_param: req.query,
            message: error.message,
            error,
        });
        return res.status(500).json(response(error.message, null, false, '500'));
    }
});

module.exports = router;