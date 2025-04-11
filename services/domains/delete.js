const logger = require("@library/logger");
const response = require("@utils/response");
const { initiateDomains } = require("./create");

const deleteDomain = async (domainId) => {
    try {
        const domains = await initiateDomains();
        const result = await domains.deleteDomain(domainId);
        return response('Success delete domain', result, true, 200);
    } catch (error) {
        logger.error({
            request_param: domainId,
            message: error.message,
            error,
        });
        return response('Failed to delete domain', null, false, 500, { message: error.message });
    }
}

module.exports = {
    deleteDomain,
}