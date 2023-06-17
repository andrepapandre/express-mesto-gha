const router = require('express').Router();

const usersController = require('../controllers/users');

router.get('/', usersController.getUsers);
router.get('/:userid', usersController.getUserById);
router.patch('/me', usersController.updateUserInfo);
router.patch('/me/avatar', usersController.updateAvatar);

module.exports = router;
