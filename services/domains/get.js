const logger = require("@library/logger");
const response = require("@utils/response");
const { initiateDomains } = require("./create");

const listDomain = async (params) => {
    try {
        const {
            page_token,
            page_size,
        } = params;

        const domains = await initiateDomains();
        const result = await domains.listDomains({
            pageSize: page_size,
            pageToken: page_token,
        });
        return response('Success get domain', result, true, 200);
    } catch (error) {
        logger.error({
            request_param: params,
            message: error.message,
            error,
        });
        return response('Failed to get domain', null, false, 500, { message: error.message });
    }
}

module.exports = {
    listDomain,
}