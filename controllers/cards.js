const cardModel = require('../models/card');
const {
  OK,
  // CREATED,
  NOT_FOUND,
  // BAD_REQUIEST,
  // UNAUTHORIZED_ERROR,
  FORBITTEN,
  INTERNAL_SERVER_ERROR,
  DocNotFound,
  // CastErr,
  ValErr,
  CREATED,
  CastErr,
  BAD_REQUIEST,
} = require('../statusServerName');

const getCards = (req, res) => {
  cardModel
    .find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const deleteCardbyId = (req, res) => {
  const { _id } = req.user._id;
  cardModel
    .findById(req.params.cardid)
    .orFail()
    .then(() => {
      if (req.user._id !== _id) {
        res.status(FORBITTEN).send({ message: 'Нет прав доступа' });
      }
      return cardModel.findByIdAndRemove(req.params.cardid).then(() => {
        res.status(OK).send({ message: 'Карточка успешно удалена' });
      });
    })
    .catch((err) => {
      if (err.name === DocNotFound) {
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      if (err.name === CastErr) {
        return res
          .status(BAD_REQUIEST)
          .send({ message: 'Некорректный _id карточки' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const createCard = (req, res) => {
  cardModel
    .create({ ...req.body, owner: req.user._id })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === ValErr) {
        return res.status(BAD_REQUIEST).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const likeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardid,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .then(() => {
      res.status(OK).send({ message: 'Лайк поставлен' });
    })
    .catch((err) => {
      if (err.name === CastErr) {
        res
          .status(BAD_REQUIEST)
          .send({ message: 'Переданы некорректные данные' });
      }
      if (err.name === DocNotFound) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Не найдена карточка с таким _id' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const dislikeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardid,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .then(() => {
      res.status(OK).send({ message: 'Лайк удален' });
    })
    .catch((err) => {
      if (err.name === CastErr) {
        res
          .status(BAD_REQUIEST)
          .send({ message: 'Переданы некорректные данные' });
      }
      if (err.name === DocNotFound) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Не найдена карточка с таким _id' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

module.exports = {
  getCards,
  deleteCardbyId,
  createCard,
  likeCard,
  dislikeCard,
};
