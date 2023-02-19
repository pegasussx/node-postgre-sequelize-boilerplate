/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const db = require('../../db/models');
const config = require('../../config');

/**
 * Login
 * Returns jwt token and user details if valid email and password are provided
 */
async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await db.User.findOne({
      where: { email },
    });

    if (!user) {
      throw new APIError('User or password is wrong', httpStatus.BAD_REQUEST);
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (isMatch) {
      const userData = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        address2: user.address2,
        city: user.city,
        state: user.state,
        phone: user.phone,
      };
      const token = generateJWT(userData);

      return res.status(httpStatus.OK).json({
        success: true,
        message: 'Welcome',
        data: {
          token,
          user: userData,
        },
      });
    }

    throw new APIError('User or password is wrong', httpStatus.BAD_REQUEST);
  } catch (error) {
    return next(error);
  }
}

/** Register User */
async function register(req, res, next) {
  const {
    firstName,
    lastName,
    email,
    address,
    address2,
    city,
    state,
    phone,
    password,
  } = req.body;

  try {
    const existedUser = await db.User.findOne({
      where: { email },
    });

    if (existedUser) {
      throw new APIError('User already exists', httpStatus.BAD_REQUEST);
    }

    const hashedPassword = bcrypt.hashSync(
      password,
      bcrypt.genSaltSync(8),
      null
    );

    const user = await db.User.create({
      firstName,
      lastName,
      email,
      address,
      address2,
      city,
      state,
      phone,
      password: hashedPassword,
    });

    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      address2: user.address2,
      city: user.city,
      state: user.state,
      phone: user.phone,
    };
    const token = generateJWT(userData);

    return res.status(httpStatus.OK).json({
      success: true,
      message: 'Registered Successfully',
      token,
      user: userData,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Generates JWT for the payload
 * @param {*} payload - Payload to be signed in JWT
 */
function generateJWT(payload) {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
    algorithm: config.HASHING_ALGORITHM,
  });
}

module.exports = {
  login,
  register,
};
