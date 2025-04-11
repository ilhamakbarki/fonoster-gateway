const logger = require("@library/logger");
const response = require("@utils/response");
const SDK = require("@fonoster/sdk");
const { fonosterClient } = require("@library/fonoster");

const listCredentials = async (params) => {
    try {
        const {
            page_token,
            page_size,
        } = params;

        const creds = await initiateCreds();
        const result = await creds.listCredentials({
            pageSize: page_size,
            pageToken: page_token,
        });
        return response('Success get credentials', result, true, 200);
    } catch (error) {
        logger.error({
            request_param: params,
            message: error.message,
            error,
        });
        return response('Failed to get credentials', null, false, 500, { message: error.message });
    }
}

const initiateCreds = async () => {
    const client = await fonosterClient();
    const creds = new SDK.Credentials(client);
    return creds;
}


module.exports = {
    initiateCreds,
    listCredentials,
}