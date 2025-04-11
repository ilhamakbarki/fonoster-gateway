const config = require("@config");
const SDK = require("@fonoster/sdk");

const fonosterClient = async () => {
    try {
        const client = new SDK.Client({
            accessKeyId: config.fonoster.access_key_id,
            allowInsecure: config.fonoster.allow_insecure,
            endpoint: config.fonoster.endpoint,
        });
        await client.loginWithApiKey(config.fonoster.api_key, config.fonoster.secret_key);
        return client;
    } catch (err) {
        throw err
    }
}

module.exports = {
    fonosterClient,
}