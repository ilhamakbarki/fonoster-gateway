const moment = require('moment-timezone');

const customDateValidator = (value, helpers, format = "YYYY-MM-DD HH:mm:ss") => {
    if (!moment(value, format, true).isValid()) {
        return helpers.error("any.invalid");
    }
    return value;
}

module.exports = {
    customDateValidator,
}