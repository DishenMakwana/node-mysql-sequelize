const { sendMessage } = require('../helper/helpers');
const { USER, ADMIN, SUPERADMIN } = require('../utils/constant');
const { messages } = require('../utils/messages');
const { statusCodes } = require('../utils/statusCodes');

const adminAuthorization = async (req, res, next) => {
  try {
    if (req.user.role_name === ADMIN || req.user.role_name === SUPERADMIN) {
      next();
    } else {
      return sendMessage(
        { code: statusCodes.NON_AUTHORITATIVE_INFORMATION.code },
        messages.LOGIN_AS_ADMIN,
        statusCodes.NON_AUTHORITATIVE_INFORMATION.code,
        res
      );
    }
  } catch (err) {
    return sendMessage(
      { code: statusCodes.UNAUTHORIZED.code },
      statusCodes.UNAUTHORIZED.desc,
      statusCodes.UNAUTHORIZED.code,
      res
    );
  }
};

const userAuthorization = async (req, res, next) => {
  try {
    if (req.user.role_name === USER) {
      next();
    } else {
      return sendMessage(
        { code: statusCodes.NON_AUTHORITATIVE_INFORMATION.code },
        messages.LOGIN_AS_USER,
        statusCodes.NON_AUTHORITATIVE_INFORMATION.code,
        res
      );
    }
  } catch (err) {
    return sendMessage(
      { code: statusCodes.UNAUTHORIZED.code },
      statusCodes.UNAUTHORIZED.desc,
      statusCodes.UNAUTHORIZED.code,
      res
    );
  }
};

const commonAuthorization = async (req, res, next) => {
  try {
    if (
      req.user.role_name === ADMIN ||
      req.user.role_name === SUPERADMIN ||
      req.user.role_name === USER
    ) {
      next();
    } else {
      return sendMessage(
        { code: statusCodes.NON_AUTHORITATIVE_INFORMATION.code },
        messages.USER_NOT_LOGIN,
        statusCodes.NON_AUTHORITATIVE_INFORMATION.code,
        res
      );
    }
  } catch (err) {
    return sendMessage(
      { code: statusCodes.UNAUTHORIZED.code },
      statusCodes.UNAUTHORIZED.desc,
      statusCodes.UNAUTHORIZED.code,
      res
    );
  }
};

module.exports = {
  adminAuthorization,
  userAuthorization,
  commonAuthorization,
};
