const express = require('express');
const router = express.Router();
const create = require('./create');
const get = require('./get');
const deleteHandler = require('./delete');
const updateHandler = require('./update');

router.use('/domains',
    create,
    get,
    deleteHandler,
    updateHandler,
);

module.exports = router;