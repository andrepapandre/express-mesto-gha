const router = require('express').Router();

const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { NOT_FOUND } = require('../statusServerName');

router.use('/cards', cardRoutes);
router.use('/users', userRoutes);

router.use((req, res, next) => {
  next(NOT_FOUND('Запрашиваемая страница не существует'));
});

module.exports = router;
