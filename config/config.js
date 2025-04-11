require('dotenv').config();

const config = {
    server: {
        env: process.env.NODE_ENV,
        name: process.env.APP_NAME,
        timezone: process.env.TIMEZONE,
        log_level: process.env.LOG_LEVEL,
    },
    upload: {
        max_upload: parseInt(process.env.UPLOAD_MAX || 100),
        allowed_files: (process.env.UPLOAD_ALLOWED_FILES || "").split(',')
    },
    http: {
        port: parseInt(process.env.HTTP_PORT || 8080),
        host: process.env.HTTP_HOST,
        apiKey: process.env.API_KEY,
        timeout: parseInt(process.env.HTTP_TIMEOUT || 30000)
    },
    snowflake: {
        node_id: process.env.SNOWFLAKE_NODE_ID,
        datacenter_id: process.env.SNOWFLAKE_DATACENTER_ID
    },
    fonoster: {
        endpoint: process.env.FONOSTER_ENDPOINT,
        access_key_id: process.env.FONOSTER_ACCESS_KEY_ID,
        api_key: process.env.FONOSTER_API_KEY,
        secret_key: process.env.FONOSTER_SECRET_KEY,
        allow_insecure: process.env.FONOSTER_ALLOW_INSECURE == 1
    }
};

module.exports = config;