const express = require('express');
const { Joi } = require('express-validation');
const tokenCtrl = require('./token.controller');
const { validate } = require('../../helpers');

const router = express.Router();
const paramValidation = {
  generateAccessToken: {
    body: Joi.object({
      refreshToken: Joi.string().required(),
    }),
  },
};

/** POST /api/token/access-token - Returns access token from refresh token */
router
  .route('/access-token')
  .post(
    validate(paramValidation.generateAccessToken),
    tokenCtrl.generateAccessToken
  );

module.exports = router;
