const logger = require("@library/logger");
const response = require("@utils/response");
const SDK = require("@fonoster/sdk");
const { fonosterClient } = require("@library/fonoster");

const listAgents = async (params) => {
    try {
        const {
            page_token,
            page_size,
        } = params;

        const agents = await initiateAgents();
        const result = await agents.listAgents({
            pageSize: page_size,
            pageToken: page_token,
        });
        return response('Success get agents', result, true, 200);
    } catch (error) {
        logger.error({
            request_param: params,
            message: error.message,
            error,
        });
        return response('Failed to get agents', null, false, 500, { message: error.message });
    }
}

const initiateAgents = async () => {
    const client = await fonosterClient();
    const agents = new SDK.Agents(client);
    return agents;
}


module.exports = {
    initiateAgents,
    listAgents,
}