const config = require('@config');
const Snowflake = require('snowflake-id');

const snowflake = new Snowflake.default({
    mid: config.snowflake.node_id,
    offset: config.snowflake.datacenter_id
});

module.exports = snowflake;