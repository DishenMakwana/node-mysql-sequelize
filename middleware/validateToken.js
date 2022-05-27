const jwt = require('jsonwebtoken');
const { messages } = require('../utils/messages');
const { statusCodes } = require('../utils/statusCodes');
const { sendMessage } = require('../helper/helpers');
const { findRoleById, findUserByEmailReturnId } = require('../dao/user.dao');
const { findTokenByUserId } = require('../dao/token.dao');

const authenticate = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new Error(messages.USER_NOT_LOGIN);
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    } catch (err) {
      throw new Error(messages.SESSION_TIMEOUT);
    }

    let user = await findUserByEmailReturnId(payload.email);

    if (!user) {
      throw new Error(messages.USER_NOT_FOUND);
    }

    const allTokensOFUser = await findTokenByUserId(payload.id);

    let checkToken = false;
    for (let tk of allTokensOFUser) {
      if (tk.token === token) {
        checkToken = true;
        break;
      }
    }

    if (!checkToken) {
      throw new Error(messages.SESSION_TIMEOUT);
    }

    const user_role = await findRoleById(payload.role);

    req.token = token;
    req.user = {
      id: user.id,
      email: user.email,
      role_id: payload.role,
      role_name: user_role.name.toLowerCase(),
    };

    next();
  } catch (err) {
    return sendMessage(
      { code: statusCodes.UNAUTHORIZED.code },
      messages.UNAUTHORIZED,
      statusCodes.UNAUTHORIZED.code,
      res
    );
  }
};

module.exports = authenticate;
