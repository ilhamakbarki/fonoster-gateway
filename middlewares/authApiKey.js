const config = require('@config');
const response = require('@utils/response');

module.exports = (req, res, next) => {
    if (req.headers['x-api-key'] !== config.http.apiKey) {
        return res.status(401).json(response('Unauthorized', null, false, '401'));
    }
    next();
};