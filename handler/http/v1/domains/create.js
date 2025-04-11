const express = require('express');
const router = express.Router();
const Joi = require("joi");
const validation = require('@middlewares/formValidation');
const { createDomain } = require("@services/domains/create");
const logger = require('@library/logger');
const response = require('@utils/response');

const schema = Joi.object({
    name: Joi.string().required(),
    domain: Joi.string().required(),
});

router.post('/', validation({ body: schema }), async (req, res) => {
    try {
        const result = await createDomain(req.body);
        return res.status(parseInt(result.code)).json(result);
    } catch (error) {
        logger.error({
            request_param: req.body,
            message: error.message,
            error,
        });
        return res.status(500).json(response(error.message, null, false, '500'));
    }
});

module.exports = router;