const express = require('express');
const expressJwt = require('express-jwt');
const dotenv = require('dotenv');
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/user/user.routes');
const config = require('./config');

const router = express.Router();

dotenv.config();

/** GET / - Get Started */
router.get('/', (req, res) => res.send('Service is running'));

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

// mount auth routes at /auth
router.use('/auth', authRoutes);

// Validating all the APIs with jwt token.
router.use(
  expressJwt({
    secret: config.JWT_SECRET,
    algorithms: [config.HASHING_ALGORITHM],
    resultProperty: 'user',
    getToken: function fromHeaderOrQuerystring(req) {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
      ) {
        return req.headers.authorization.split(' ')[1];
      }
      if (req.query && req.query.token) {
        return req.query.token;
      }
      return null;
    },
  })
);

/** AUTH ROUTES */
router.use('/users', userRoutes);

module.exports = router;
