// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt'); // импортируем bcrypt
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const { OK, CREATED, ValErr } = require('../statusServerName');
const ConflictError = require('../errors/conflict-err');
const BadRequest = require('../errors/bad-requiest');
const AuthError = require('../errors/auth-err');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    userModel
      .create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
      .then(() => res.status(CREATED).send({
        name,
        about,
        avatar,
        email,
      }))
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError('Такой пользователь уже существует'));
          return;
        }
        if (err.name === ValErr) {
          next(
            new BadRequest(
              'Переданы некорректные данные при создании пользователя',
            ),
          );
        }
        next(err);
      });
  });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  userModel
    .findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new AuthError('Ошибка авторизации');
    })
    .then((user) => Promise.all([user, bcrypt.compare(password, user.password)]))
    .then(([user, isEqual]) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      if (!isEqual) {
        next(new AuthError('Неверный email или пароль'));
        return;
      }
      res.status(OK).send({ token });
    })
    .catch((err) => {
      if (err.message === 'UnauthorizedError') {
        next(new AuthError('Неверный email или пароль'));
        return;
      }
      next(err);
    });
};

module.exports = {
  loginUser,
  createUser,
};
