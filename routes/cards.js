const router = require('express').Router();

const cardsController = require('../controllers/cards');

router.get('/', cardsController.getCards);

router.post('/', cardsController.createCard);

router.delete('/:cardid', cardsController.deleteCardbyId);

router.put('/:cardid/likes', cardsController.likeCard);

router.delete('/:cardid/likes', cardsController.deleteCardbyId);

module.exports = router;
