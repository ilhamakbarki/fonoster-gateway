const logger = require("@library/logger");
const response = require("@utils/response");
const { initiateAgents } = require("./get");

const deleteAgent = async (id) => {
    try {
        const agents = await initiateAgents();
        const result = await agents.deleteAgent(id);
        return response('Success delete agent', result, true, 200);
    } catch (error) {
        logger.error({
            request_param: id,
            message: error.message,
            error,
        });
        return response('Failed to delete agent', null, false, 500, { message: error.message });
    }
}

module.exports = {
    deleteAgent,
}