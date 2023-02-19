const express = require('express');
const { Joi } = require('express-validation');
const authCtrl = require('./auth.controller');
const { validate } = require('../../helpers');

const router = express.Router();
const paramValidation = {
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
  register: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      address: Joi.string().required(),
      address2: Joi.string(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      phone: Joi.string().required(),
    }),
  },
};

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/login').post(validate(paramValidation.login), authCtrl.login);

/** POST /api/auth/register - Returns token if correct username and password is provided */
router
  .route('/register')
  .post(validate(paramValidation.register), authCtrl.register);

module.exports = router;
