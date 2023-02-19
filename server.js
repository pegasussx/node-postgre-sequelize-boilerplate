// importing modules
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const dotenv = require('dotenv');
const httpStatus = require('http-status');
const { ValidationError } = require('express-validation');
const APIError = require('./app/helpers/APIError');
const appRoutes = require('./app/routes');

dotenv.config();

// assigning the variable app to express
const app = express();

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// mount all routes on /api path
app.use('/api', appRoutes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    // validation error contains details object which has error message attached to error property.
    const allErrors = err.details.map((pathErrors) =>
      Object.values(pathErrors).join(', ')
    );
    const unifiedErrorMessage = allErrors
      .join(', ')
      .replace(/, ([^,]*)$/, ' and $1');
    const error = new APIError(unifiedErrorMessage, err.statusCode);
    return next(error);
  }
  if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API Not Found', httpStatus.BAD_REQUEST);
  return next(err);
});

// error handler, send stacktrace only during development
app.use(
  (
    err,
    req,
    res,
    next // eslint-disable-line no-unused-vars
  ) =>
    res.status(err.status).json({
      success: false,
      message: err.isPublic ? err.message : httpStatus[err.status],
      data: null,
    })
);

module.exports = app;
