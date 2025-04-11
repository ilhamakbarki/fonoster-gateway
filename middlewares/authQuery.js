const config = require('@config');
const response = require('@utils/response');

module.exports = (req, res, next) => {
    if (req.query.key !== config.http.apiKey) {
        return res.status(401).json(response('Unauthorized', null, false, '401'));
    }
    next();
};