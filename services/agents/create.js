const logger = require("@library/logger");
const response = require("@utils/response");
const { initiateAgents } = require("./get");

const createAgents = async (params) => {
    try {
        const {
            name,
            username,
            credential_id,
            domain_id,
            enabled,
            expires,
            max_contact,
        } = params;

        const agents = await initiateAgents();
        const result = await agents.createAgent({
            name,
            username,
            credentialsRef: credential_id,
            domainRef: domain_id,
            enabled,
            expires,
            maxContacts: max_contact,
        });
        return response('Success create agent', result, true, 201);
    } catch (error) {
        logger.error({
            request_param: params,
            message: error.message,
            error,
        });
        return response('Failed to create agent', null, false, 500, { message: error.message });
    }
}

module.exports = {
    createAgents,
}