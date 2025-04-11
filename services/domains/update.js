const logger = require("@library/logger");
const response = require("@utils/response");
const { initiateDomains } = require("./create");

const updateDomain = async (params) => {
    try {
        const {
            id,
            name,
        } = params;
        const domains = await initiateDomains();
        const result = await domains.updateDomain({
            ref: id,
            name,
        });
        return response('Success update domain', result, true, 200);
    } catch (error) {
        logger.error({
            request_param: params,
            message: error.message,
            error,
        });
        return response('Failed to update domain', null, false, 500, { message: error.message });
    }
}

module.exports = {
    updateDomain,
}