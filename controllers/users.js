const userModel = require('../models/user');
const {
  OK,
  DocNotFound,
  ValErr,
} = require('../statusServerName');
const NotFound = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-requiest');

const getUsers = (req, res, next) => {
  userModel
    .find({})
    .then((users) => {
      res.status(OK).send(users);
    })
    .catch((err) => next(err));
};

const getUserById = (req, res, next) => {
  userModel
    .findById(req.params.userid)
    .orFail()
    .then((user) => {
      if (user) res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user._id;
  userModel
    .findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then(() => res.status(OK).send({ message: 'Изменения сохранены' }))
    .catch((err) => {
      if (err.name === ValErr) {
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
        return;
      }
      if (err.name === DocNotFound) {
        next(new NotFound('Пользователь не найден или _id пользователя некорректен'));
        return;
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { _id } = req.user._id;

  userModel
    .findByIdAndUpdate(_id, { ...req.body }, { new: true, runValidators: true })
    .orFail()
    .then(() => {
      res.status(OK).send({ message: 'Аватар успешно обновлен' });
    })
    .catch((err) => {
      if (err.name === ValErr) {
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
        return;
      }
      if (err.name === DocNotFound) {
        next(new NotFound('Пользователь не найден или _id пользователя некорректен'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  updateUserInfo,
  updateAvatar,
};
