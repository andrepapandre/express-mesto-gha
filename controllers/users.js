const userModel = require('../models/user');
const {
  OK,
  CREATED,
  BAD_REQUIEST,
  // UNAUTHORIZED_ERROR,
  // FORBITTEN,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  DocNotFound,
  CastErr,
  ValErr,
} = require('../statusServerName');

const getUsers = (req, res) => {
  userModel
    .find({})
    .then((users) => {
      res.status(OK).send(users);
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

const getUserById = (req, res) => {
  userModel
    .findById(req.params.userid)
    .orFail()
    .then((user) => {
      if (user) res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === CastErr) {
        return res.status(NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      }
      if (err.name === DocNotFound) {
        return res.status(BAD_REQUIEST).send({
          message: '_id пользователя некорректен',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

const createUser = (req, res) => {
  userModel
    .create(req.body)
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      if (err.name === ValErr) {
        return res.status(BAD_REQUIEST).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user._id;
  userModel
    .findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then(() => res.status(OK).send({ message: 'Изменения сохранены' }))
    .catch((err) => {
      if (err.name === ValErr) {
        return res.status(BAD_REQUIEST).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Ошибка сервера' });
    });
};

const updateAvatar = (req, res) => {
  // const { avatar } = req.body;
  const { _id } = req.user._id;

  userModel
    .findByIdAndUpdate(_id, { ...req.body }, { new: true, runValidators: true })
    .orFail()
    .then(() => {
      res.status(OK).send({ message: 'Аватар успешно обновлен' });
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateAvatar,
};
