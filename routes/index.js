const router = require('express').Router();

const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/cards', cardRoutes);

router.use('/cards/:cardid', cardRoutes);

router.use('/cards', cardRoutes);

router.use('/cards', cardRoutes);

router.use('/users', userRoutes);

router.use('/users', userRoutes);

router.use('/users/:userid', userRoutes);

router.use('/users/me', userRoutes);

router.use('/users', userRoutes);

module.exports = router;
