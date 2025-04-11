const express = require('express');
const router = express.Router();
const Joi = require("joi");
const validation = require('@middlewares/formValidation');
const logger = require('@library/logger');
const response = require('@utils/response');
const { deleteCredentials } = require('@services/credentials/delete');

const schemaParam = Joi.object({
    param_1: Joi.string().required(),
});

router.delete('/:param_1', validation({ params: schemaParam }), async (req, res) => {
    try {
        const id = req.params.param_1;
        const result = await deleteCredentials(id);
        return res.status(parseInt(result.code)).json(result);
    } catch (error) {
        logger.error({
            message: error.message,
            error,
        });
        return res.status(500).json(response(error.message, null, false, '500'));
    }
});

module.exports = router;