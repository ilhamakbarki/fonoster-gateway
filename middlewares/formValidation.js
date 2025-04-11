const response = require('@utils/response');
const logger = require('@library/logger');

/**
 * Validate request body, params, or query with given schema object.
 * @param {Object<string, import('joi').Schema>} schemas - an object with schema as value and target as key.
 * Target can be 'body', 'params', 'query'. If target is not given, it will be
 * treated as 'body'.
 * @return {function} - a middleware function that validates the request.
 */

const validateForm = (schemas) => {
    return (req, res, next) => {
        const errors = {};
        const validatedData = {};
        const payload = {}

        for (const [target, schema] of Object.entries(schemas)) {
            if (!schema) continue;
            const { value, error } = schema.validate(req[target], { abortEarly: false, allowUnknown: true });
            if (error) {
                Object.assign(payload, req[target]);
                error.details.forEach(element => {
                    errors[element.context.key] = element.message;
                });
            } else {
                validatedData[target] = value;
            }
        }

        if (Object.keys(errors).length > 0) {
            logger.warn('Error in form validation', { request: payload, error: errors });
            return res.status(422).json(response('Error in form validation', false, null, '422', errors));
        }

        Object.assign(req, validatedData);
        next();
    };
};

module.exports = validateForm;