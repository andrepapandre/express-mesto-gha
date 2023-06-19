// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
// eslint-disable-next-line import/no-extraneous-dependencies
const isUrl = require('validator/lib/isURL');
const BadRequest = require('../errors/bad-requiest');

const validUrl = (url) => {
  const validate = isUrl(url);
  if (validate) {
    return url;
  }
  throw new BadRequest('Некорректный адрес URL');
};

const updateAvatarValid = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validUrl),
  }),
});

const userByIdValid = celebrate({
  params: Joi.object().keys({
    userid: Joi.string().required().hex().length(24),
  }),
});

const updateProfileValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const cardByIdValid = celebrate({
  params: Joi.object().keys({
    cardid: Joi.string().required().hex().length(24),
  }),
});

const newCardValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom(validUrl),
  }),
});

const createUserValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validUrl),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const loginUserValid = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  userByIdValid,
  cardByIdValid,
  newCardValid,
  updateProfileValid,
  updateAvatarValid,
  createUserValid,
  loginUserValid,
};
