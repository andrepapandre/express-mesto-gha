const router = require('express').Router();
const cardsController = require('../controllers/cards');

const { newCardValid, cardByIdValid } = require('../middlewares/validation');

router.get('/', cardsController.getCards);
router.post('/', newCardValid, cardsController.createCard);
router.delete('/:cardid', cardByIdValid, cardsController.deleteCardbyId);
router.put('/:cardid/likes', cardByIdValid, cardsController.likeCard);
router.delete('/:cardid/likes', cardByIdValid, cardsController.deleteCardbyId);

module.exports = router;
