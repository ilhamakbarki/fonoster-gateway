const logger = require("@library/logger");
const response = require("@utils/response");
const { initiateCreds } = require("./get");

const deleteCredentials = async (id) => {
    try {
        const creds = await initiateCreds();
        const result = await creds.deleteCredentials(id);
        return response('Success delete credentials', result, true, 200);
    } catch (error) {
        logger.error({
            request_param: id,
            message: error.message,
            error,
        });
        return response('Failed to delete credentials', null, false, 500, { message: error.message });
    }
}

module.exports = {
    deleteCredentials,
}