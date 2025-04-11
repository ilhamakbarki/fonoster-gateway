const logger = require("@library/logger");
const response = require("@utils/response");
const SDK = require("@fonoster/sdk");
const { fonosterClient } = require("@library/fonoster");

const createDomain = async (params) => {
    try {
        const {
            name,
            domain,
        } = params;
        const domains = await initiateDomains();
        const result = await domains.createDomain({
            name,
            domainUri: domain
        });
        return response('Success create domain', result, true, 201);
    } catch (error) {
        logger.error({
            request_param: params,
            message: error.message,
            error,
        });
        return response('Failed to create domain', null, false, 500, { message: error.message });
    }
}

const initiateDomains = async () => {
    const client = await fonosterClient();
    const domains = new SDK.Domains(client);
    return domains;
}

module.exports = {
    initiateDomains,
    createDomain,
}