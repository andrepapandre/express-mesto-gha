const router = require('express').Router();

const usersController = require('../controllers/users');

const {
  userByIdValid,
  updateProfileValid,
  updateAvatarValid,
} = require('../middlewares/validation');

router.get('/', usersController.getUsers);
router.get('/:userid', userByIdValid, usersController.getUserById);
router.patch('/me', updateProfileValid, usersController.updateUserInfo);
router.patch('/me/avatar', updateAvatarValid, usersController.updateAvatar);

module.exports = router;
