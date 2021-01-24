const { celebrate, Joi } = require('celebrate');
const users = require('express').Router();
const {
  getUserById,
  getUsers,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

users.get('/', getUsers);

users.get('/:id', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
}), getUserById);

users.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

users.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/),
  }),
}), updateAvatar);

module.exports = users;
