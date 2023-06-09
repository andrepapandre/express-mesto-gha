const router = require('express').Router();

const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/cards', cardRoutes);
router.use('/users', userRoutes);

module.exports = router;
