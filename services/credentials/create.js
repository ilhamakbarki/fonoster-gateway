const logger = require("@library/logger");
const response = require("@utils/response");
const { initiateCreds } = require("./get");

const createCredentials = async (params) => {
    try {
        const {
            name,
            username,
            password,
        } = params;

        const creds = await initiateCreds();
        const result = await creds.createCredentials({
            name,
            username,
            password,
        });
        return response('Success create credentials', result, true, 201);
    } catch (error) {
        logger.error({
            request_param: params,
            message: error.message,
            error,
        });
        return response('Failed to create credentials', null, false, 500, { message: error.message });
    }
}

module.exports = {
    createCredentials,
}