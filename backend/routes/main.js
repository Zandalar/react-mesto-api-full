const router = require('express').Router();
const cards = require('./cards');
const users = require('./users');
const NotFoundError = require('../errors/NotFoundError');

router.use('/cards', cards);
router.use('/users', users);
router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
