/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const db = require('../../db/models');
const config = require('../../config');

/** Generate Both Access and Refresh Tokens */
async function generateTokens(payload) {
  try {
    const accessToken = jwt.sign(payload, config.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: config.JWT_ACCESS_TOKEN_EXPIRES_IN,
      algorithm: config.HASHING_ALGORITHM,
    });
    const refreshToken = jwt.sign(payload, config.JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: config.JWT_REFRESH_TOKEN_EXPIRES_IN,
      algorithm: config.HASHING_ALGORITHM,
    });

    /** Remove Last User Token */
    await db.UserToken.destroy({
      where: { email: payload.email },
    });

    console.log({ accessToken, refreshToken });

    /** Store New Generated User Token */
    await db.UserToken.create({
      email: payload.email,
      token: refreshToken,
    });

    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    return Promise.reject(err);
  }
}

/** Verify Refresh Token */
function verifyRefreshToken(refreshToken) {
  return new Promise((resolve, reject) => {
    db.UserToken.findOne({
      where: { token: refreshToken },
    }).then((token) => {
      if (!token) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return reject({ error: true, message: 'Invalid refresh token' });
      }

      // eslint-disable-next-line consistent-return
      jwt.verify(
        refreshToken,
        config.JWT_REFRESH_TOKEN_SECRET,
        (err, tokenDetails) => {
          if (err) {
            // eslint-disable-next-line prefer-promise-reject-errors
            return reject({ error: true, message: 'Invalid refresh token' });
          }
          resolve({
            tokenDetails,
            error: false,
            message: 'Valid refresh token',
          });
        }
      );
    });
  });
}

/** Generate Access Token using Refresh Token */
async function generateAccessToken(req, res, next) {
  const { refreshToken } = req.body;

  try {
    const payload = await verifyRefreshToken(refreshToken);

    const accessToken = jwt.sign(payload, config.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: config.JWT_ACCESS_TOKEN_EXPIRES_IN,
    });

    res.status(httpStatus.OK).json({
      success: true,
      accessToken,
      message: 'Access token created successfully',
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  generateTokens,
  generateAccessToken,
};
