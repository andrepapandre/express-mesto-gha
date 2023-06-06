const userModel = require('../models/user');
const {
  OK,
  CREATED,
  // NOT_FOUND,
  // BAD_REQUIEST,
  INTERNAL_SERVER_ERROR,
  CastErr,
  ValErr,
  BAD_REQUIEST,
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
    .then((u) => {
      res.status(OK).send(u);
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({
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
      if (err.name === CastErr || err.name === ValErr) {
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
    .then(() => res.status(OK).send({ message: 'Изменения сохранены' }))
    .catch((err) => {
      if (err.name === CastErr || err.name === ValErr) {
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
    .then(() => {
      res.status(OK).send({ message: 'Аватар успешно обновлен' });
    })
    .catch((err) => {
      if (err.name === CastErr || err.name === ValErr) {
        return res.status(BAD_REQUIEST).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Ошибка сервера' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateAvatar,
};
