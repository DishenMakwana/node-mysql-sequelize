const { statusCodes } = require('../utils/statusCodes');

const handleError = (err, _req, res, _next) => {
  err.statusCodes = err.statusCodes || statusCodes.BAD_REQUEST.code;
  err.status = false;
  res.status(err.statusCodes).json({
    success: false,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

module.exports = { handleError };
