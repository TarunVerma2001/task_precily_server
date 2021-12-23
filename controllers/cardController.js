const Card = require('./../models/cardModel');
const AppError = require('./../utils/appError');

//get all cards from the database
exports.getCards = async (reqm, res, next) => {
  try {
    const cards = await Card.find();

    res.status(200).json({
      staus: 'success',
      results: cards.length,
      data: {
        cards,
      },
    });
  } catch (err) {
    next(err);
  }
};

//add data into the collection
exports.addCard = async (req, res, next) => {
  try {
    const card = await Card.create(req.body);

    // send the response in the form of JSON
    res.status(201).json({
      status: 'success',
      data: {
        card,
      },
    });
  } catch (err) {
    // catches error
    next(err);
  }
};

// update data in the card with provided Id
exports.updateCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    let { updateCount } = card;
    console.log(updateCount);
    if (card) {
      updateCount++;
      await Card.findByIdAndUpdate(
        req.params.id,
        { updateCount: updateCount },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    // if no card fond with the provided id it throw error
    if (!card) {
      return next(new AppError('No Card found with this id', 404));
    }

    // send the response in the form of JSON
    res.status(200).json({
      status: 'success',
      data: {
        card,
      },
    });
  } catch (err) {
    // catches error
    next(err);
  }
};

//
