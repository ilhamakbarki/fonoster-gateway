module.exports = (message, data = null, status = true, code = null, errors = null) => {
    const response = {
        status,
        code: String(code || '201'),
        message,
    };

    if (data) {
        response.data = data;
    }

    if (errors) {
        response.error = errors;
    }

    return response;
}