const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ReqError = require('../errors/ReqError');

const { NODE_ENV, JWT_SECRET } = process.env;

function getUsers(req, res, next) {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
}

function getUser(req, res, next) {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет юзера с таким id');
      }
      return res.status(200).send(user);
    })
    .catch(next);
}

function createUser(req, res, next) {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => res.status(200).send({
        _id: user._id,
        email: user.email,
      })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new ReqError('Введите корректные данные');
          }
          next(err);
        })));
}

function updateUser(req, res, next) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет юзера с таким id');
      }
      return res.status(200).send(user);
    })
    .catch(next);
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет юзера с таким id');
      }
      return res.status(200).send(user);
    })
    .catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;

  User.findOne({ email });
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'vodka-bear-balalayka',
        { expiresIn: '7d' },
      );
      // res.cookie('jwt', token, {
      //   maxAge: 3600000 * 7 * 24,
      //   httpOnly: true,
      // });
      res.status(200).send({ token });
    })
    .catch(next);
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
