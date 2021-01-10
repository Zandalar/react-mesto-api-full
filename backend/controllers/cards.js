const Card = require('../models/card');

function getCards(req, res) {
  Card.find({})
    .then((data) => res.status(200).send(data))
    .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера' }));
}

function createCard(req, res) {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Введите корректные данные: ${err.message}` });
      }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
}

function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Файл не найден' });
      }
      return res.status(200).send(card);
    })
    .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера' }));
}

function likeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Файл не найден' });
      }
      return res.status(200).send(card);
    })
    .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера' }));
}

function dislikeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Файл не найден' });
      }
      return res.status(200).send(card);
    })
    .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера' }));
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
