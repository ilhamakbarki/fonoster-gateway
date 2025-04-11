const express = require('express');
const router = express.Router();
const Joi = require("joi");
const validation = require('@middlewares/formValidation');
const { updateDomain } = require('@services/domains/update');
const logger = require('@library/logger');
const response = require('@utils/response');

const schema = Joi.object({
    name: Joi.string().required(),
});

const schemaParam = Joi.object({
    param_1: Joi.string().required(),
});

router.put('/:param_1', validation({ params: schemaParam, body: schema }), async (req, res) => {
    try {
        const params = {
            id: req.params.param_1,
            ...req.body,
        };
        const result = await updateDomain(params);
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