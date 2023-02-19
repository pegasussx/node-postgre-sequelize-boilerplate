const httpStatus = require('http-status');

function currentUser(req, res) {
  return res.status(httpStatus.OK).json({
    success: true,
    message: 'Currently Logged In User',
    data: res.user,
  });
}

module.exports = {
  currentUser,
};
