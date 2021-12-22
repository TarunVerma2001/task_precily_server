const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const globalErrorHandler = require('./controllers/errorController');

const AppError = require('./utils/appError');

const app = express();

//set securuty http headers
app.use(helmet());

//development logging
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

//body parser, reading data from the body into req.body
app.use(express.urlencoded({ extended: true }));

//limiter for limiting so many attempts for gaining access
const limiter = rateLimit({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  message: 'Too many requests from this ip please try again after an hour!',
});

app.use('/', limiter);

app.use(
  express.json({
    limit: '10kb',
  })
);

//data sanitization against NoSQL query injection
app.use(mongoSanitize());

//data sanitization against XSS
app.use(xss());

//prevent parameters polution
app.use(
  hpp({
    //it is array which we can allow to be duplicated in query
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//allow other request to get access
app.use(cors());

//Routes
app.use('/api/cards', require('./routes/cardRoutes'));

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
