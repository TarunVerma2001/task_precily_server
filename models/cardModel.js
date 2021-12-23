const mongoose = require('mongoose');

//creates the schema for the cards in the UI with propery title and description
const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A Card must have a title.'],
    minLength: [10, 'A title must have more then or equal to 10 characters.'],
    maxLength: [40, 'A title must have less then or equal to 40 characters.'],
  },
  description: {
    type: String,
    required: [true, 'A Card must have a description.'],
    minLength: [
      100,
      'A description must have more then or equal to 100 characters.',
    ],
  },
  updateCount: {
    type: Number,
    default: 0,
  },
});

//make model using cardSchema
const Card = mongoose.model('Card', cardSchema);

//exports the Card Model
module.exports = Card;
