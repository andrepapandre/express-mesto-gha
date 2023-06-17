const router = require('express').Router();

const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { NOT_FOUND } = require('../statusServerName');
const auth = require('../middlewares/auth');
const authorization = require('../controllers/auth');

router.post('/signup', authorization.createUser);
router.post('/signin', authorization.loginUser);

router.use(auth);

router.use('/cards', cardRoutes);
router.use('/users', userRoutes);

router.use((req, res, next) => {
  next(NOT_FOUND('Запрашиваемая страница не существует'));
});

module.exports = router;
