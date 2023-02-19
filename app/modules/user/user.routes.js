const express = require('express');
const userCtrl = require('./user.controller');

const router = express.Router();

/** POST /api/users/current - Returns Currently Logged User */
router.route('/current').get(userCtrl.currentUser);

module.exports = router;
