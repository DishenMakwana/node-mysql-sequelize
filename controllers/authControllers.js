const bcrypt = require('bcryptjs');
const bcryptSalt = process.env.BCRYPT_SALT;
const _ = require('lodash');
var ejs = require('ejs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { statusCodes } = require('../utils/statusCodes');
const { messages } = require('../utils/messages');
const { sendMessage } = require('../helper/helpers');
const {
  findUserByEmail,
  findRoleByUserId,
  findUserById,
  findUserPermissions,
  findRoleById,
} = require('../dao/user.dao');
const { catchAsync } = require('../utils/catchAsync');
const { generateToken } = require('../middleware/generateToken');
const { transformUserData } = require('../transformers/userTransformers');
const {
  findTokenByToken,
  createTokenByUserId,
  removeTokesByUserId,
} = require('../dao/token.dao');
const User = require('../models/user');
const { sendMail } = require('../helper/mail');
const { role } = require('../utils/constant');

const loginHandler = catchAsync(async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return sendMessage(
      { code: statusCodes.BAD_REQUEST.code },
      messages.ENTER_NECESSARY_FIELDS,
      statusCodes.BAD_REQUEST.code,
      res
    );
  }

  let userExists = await findUserByEmail(email);

  if (userExists) {
    if (!userExists.is_approved) {
      return sendMessage(
        { code: statusCodes.PROXY_AUTHENTICATION_REQUIRED.code },
        messages.APPROVAL_PENDING,
        statusCodes.PROXY_AUTHENTICATION_REQUIRED.code,
        res
      );
    }

    if (userExists.is_blocked) {
      return sendMessage(
        { code: statusCodes.FORBIDDEN.code },
        messages.ACCESS_FORBIDDEN,
        statusCodes.FORBIDDEN.code,
        res
      );
    }

    let verifyPassword = await bcrypt.compare(password, userExists.password);

    if (verifyPassword) {
      // save role in token as well
      const userRole = await findRoleByUserId(userExists.id);
      const token = await generateToken(userExists, userRole);

      await createTokenByUserId(userExists.id, token);

      // transform user data from object to required fields
      userExists = transformUserData(userExists);

      let permissions = [];
      let group_permissions;

      userExists.role_id = userRole.role_id;

      const roleName = await findRoleById(userRole.role_id);

      userExists.role = roleName.name;

      if (
        userRole.role_id === role.ADMIN ||
        userRole.role_id === role.SUPERADMIN
      ) {
        permissions = await findUserPermissions(userRole.role_id);
      }

      group_permissions = _.groupBy(permissions, 'group');
      group_permissions = _.mapValues(group_permissions, (group) =>
        _.map(group, 'name')
      );

      userExists.permissions = group_permissions;

      return sendMessage(
        {
          code: statusCodes.OK.code,
          data: { userDetails: userExists },
          token: token,
        },
        messages.LOGIN_SUCCESSFUL,
        statusCodes.OK.code,
        res
      );
    }

    return sendMessage(
      { code: statusCodes.BAD_REQUEST.code },
      messages.WRONG_CREDENTIALS,
      statusCodes.BAD_REQUEST.code,
      res
    );
  }

  return sendMessage(
    { code: statusCodes.BAD_REQUEST.code },
    messages.WRONG_CREDENTIALS,
    statusCodes.BAD_REQUEST.code,
    res
  );
});

const changePassword = catchAsync(async (req, res) => {
  const { old_password, new_password, new_password_confirmation } = req.body;

  const id = req.user.id;
  let userExists = await findUserById(id);

  if (new_password !== new_password_confirmation) {
    return sendMessage(
      { code: statusCodes.BAD_REQUEST.code },
      messages.PASSWORD_NOT_MATCH,
      statusCodes.BAD_REQUEST.code,
      res
    );
  }

  let verifyPassword = await bcrypt.compare(old_password, userExists.password);

  if (verifyPassword) {
    const passwordHash = await bcrypt.hash(new_password, Number(bcryptSalt));

    await User.update(
      { password: passwordHash },
      { where: { id: userExists.id } }
    );

    await removeTokesByUserId(userExists.id);

    const token = await generateToken(userExists, {
      role_id: req.user.role_id,
    });

    await createTokenByUserId(userExists.id, token);

    return sendMessage(
      {
        code: statusCodes.OK.code,
        token: token,
      },
      messages.PASSWORD_CHANGED,
      statusCodes.OK.code,
      res
    );
  }

  return sendMessage(
    { code: statusCodes.BAD_REQUEST.code },
    messages.OLD_PASSWORD_WRONG,
    statusCodes.BAD_REQUEST.code,
    res
  );
});

const forgotPassword = catchAsync(async (req, res) => {
  const email = req.body.email;
  const userExists = await findUserByEmail(email);

  if (!userExists) {
    return sendMessage(
      { code: statusCodes.BAD_REQUEST.code },
      messages.EMAIL_NOT_EXISTS,
      statusCodes.BAD_REQUEST.code,
      res
    );
  }

  const userRole = await findRoleByUserId(userExists.id);
  const token = await generateToken(userExists, userRole);

  await removeTokesByUserId(userExists.id);

  await createTokenByUserId(userExists.id, token);

  const link = `${process.env.USER_DOMAIN}/forgot-password/${token}`;

  const subject = 'QuiteClear | Reset Password';
  const logo = process.env.CDN_BASEURL + process.env.LOGO_NAME;

  ejs.renderFile(
    path.join(__dirname, '../', 'helper/email_templates/forgot_password.ejs'),
    {
      name: userExists.name,
      link: link,
      logo: logo,
    },
    function (err, data) {
      if (err) {
        console.error(err);
      } else {
        sendMail(userExists.email, subject, data);
      }
    }
  );

  return sendMessage(
    {
      code: statusCodes.OK.code,
    },
    messages.PASSWORD_EMAIL_SENT,
    statusCodes.OK.code,
    res
  );
});

const resetPassword = catchAsync(async (req, res) => {
  const { password, password_confirmation } = req.body;
  const token = req.body.token;

  const tokenExists = await findTokenByToken(token);

  let payload;

  payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

  if (!tokenExists) {
    return sendMessage(
      { code: statusCodes.BAD_REQUEST.code },
      messages.INVALID_TOKEN,
      statusCodes.BAD_REQUEST.code,
      res
    );
  }

  if (password !== password_confirmation) {
    return sendMessage(
      { code: statusCodes.BAD_REQUEST.code },
      messages.PASSWORD_NOT_MATCH,
      statusCodes.BAD_REQUEST.code,
      res
    );
  }

  const hash = await bcrypt.hash(password, Number(bcryptSalt));

  await User.update({ password: hash }, { where: { id: payload.id } });

  return sendMessage(
    {
      code: statusCodes.OK.code,
    },
    messages.PASSWORD_CHANGED,
    statusCodes.OK.code,
    res
  );
});

module.exports = {
  loginHandler,
  changePassword,
  forgotPassword,
  resetPassword,
};
