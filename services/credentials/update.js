const logger = require("@library/logger");
const response = require("@utils/response");
const { initiateCreds } = require("./get");

const updateCredentials = async (params) => {
    try {
        const {
            id,
            name,
        } = params;

        const creds = await initiateCreds();
        const result = await creds.updateCredentials({
            ref: id,
            name,
        });
        return response('Success update credentials', result, true, 201);
    } catch (error) {
        logger.error({
            request_param: params,
            message: error.message,
            error,
        });
        return response('Failed to update credentials', null, false, 500, { message: error.message });
    }
}

module.exports = {
    updateCredentials,
}