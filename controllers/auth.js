// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
const bcrypt = require('bcrypt'); // импортируем bcrypt
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const {
  OK,
  CREATED,
  BAD_REQUIEST,
  UNAUTHORIZED_ERROR,
  // FORBITTEN,
  // NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  // DocNotFound,
  // CastErr,
  ValErr,
} = require('../statusServerName');

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    userModel
      .create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
      .then(() =>
        res.status(CREATED).send({
          name,
          about,
          avatar,
          email,
        })
      )
      .catch((err) => {
        if (err.code === 11000) {
          return res
            .status(409)
            .send({ message: 'Такой пользователь уже существует' });
        }
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
  });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  userModel
    .findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new Error('UNAUTHORIZED ERROR');
    })
    .then((user) => {
      return Promise.all([user, bcrypt.compare(password, user.password)]);
    })
    .then(([user, isEqual]) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      if (!isEqual) {
        console.log('isequal', isEqual);
        res
          .status(UNAUTHORIZED_ERROR)
          .send({ message: 'Неверный email или пароль' });
        return;
      }

      // eslint-disable-next-line consistent-return
      return res.status(OK).send({ token });
    })
    .catch((err) => {
      if (err.message === 'UnauthorizedError') {
        return res.status(UNAUTHORIZED_ERROR).send({ message: 'УПС' });
      }
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

module.exports = {
  loginUser,
  createUser,
};
