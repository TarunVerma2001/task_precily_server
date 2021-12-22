const express = require('express');
const cardController = require('./../controllers/cardController');

const router = express.Router();

router.route('/').get(cardController.getCards).post(cardController.addCard);

router.route('/:id').patch(cardController.updateCard);

module.exports = router;
