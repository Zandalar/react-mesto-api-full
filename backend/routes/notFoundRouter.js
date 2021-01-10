const notFoundRouter = require('express').Router();
const notFound = require('../controllers/notFound');

notFoundRouter.get('*', notFound);

module.exports = notFoundRouter;
