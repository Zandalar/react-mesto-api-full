const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ReqError = require('../errors/ReqError');
const ForbiddenError = require('../errors/ForbiddenError');

function getCards(req, res, next) {
  Card.find({})
    .then((data) => res.status(200).send(data))
    .catch(next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ReqError('Введите корректные данные');
      }
      throw err;
    })
    .catch(next);
}

function deleteCard(req, res, next) {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Нет карточки с таким id'))
    .then((card) => {
      if (req.user._id === card.owner._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((deletedCard) => res.status(200).send(deletedCard))
          .catch(next);
      } else {
        throw new ForbiddenError('Нет доступа');
      }
    })
    .catch(next);
}

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Нет карточки с таким id'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(next);
}

function dislikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Нет карточки с таким id'))
    .populate('likes').populate('owner')
    .then((card) => {
      res.status(200).send(card);
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
