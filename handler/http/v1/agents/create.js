const express = require('express');
const router = express.Router();
const Joi = require("joi");
const validation = require('@middlewares/formValidation');
const logger = require('@library/logger');
const response = require('@utils/response');
const { createAgents } = require('@services/agents/create');

const schema = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    credential_id: Joi.string().required(),
    domain_id: Joi.string().required(),
    enabled: Joi.boolean().empty('').default(true),
    expires: Joi.number().empty('').default(0),
    max_contact: Joi.number().empty('').default(0),
});

router.post('/', validation({ body: schema }), async (req, res) => {
    try {
        const result = await createAgents(req.body);
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