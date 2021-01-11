const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

function getUsers(req, res) {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера' }));
}

function getUser(req, res) {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Нет юзера с таким id' });
      }
      return res.status(200).send(user);
    })
    .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера' }));
}

function createUser(req, res) {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash
    })
    .then((user) => res.status(200).send({
      _id: user._id,
      email: user.email
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Введите корректные данные: ${err.message}` });
      }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    }))
  )
}

function updateUser(req, res) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера' }));
}

function updateAvatar(req, res) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера' }));
}

function login(req, res) {
  const { email, password } = req.body;

  User.findOne({ email })
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id},
        'vodka-bear-balalayka',
        { expiresIn: '7d'}
        );
      res.cookie('jwt', token, {
          maxAge: 3600000 * 7 * 24,
          httpOnly: true
        })
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
