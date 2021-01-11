const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ReqError = require('../errors/ReqError');

function getCards(req, res) {
  Card.find({})
    .then((data) => res.status(200).send(data))
    .catch(next);
}

function createCard(req, res) {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ReqError('Введите корректные данные');
      }
      next(err);
    });
}

function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Файл не найден');
      }
      return res.status(200).send(card);
    })
    .catch(next);
}

function likeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Файл не найден');
      }
      return res.status(200).send(card);
    })
    .catch(next);
}

function dislikeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Файл не найден');
      }
      return res.status(200).send(card);
    })
    .catch(next);
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
