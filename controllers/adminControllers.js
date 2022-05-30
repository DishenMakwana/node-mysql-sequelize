var generator = require('generate-password');
const bcrypt = require('bcryptjs');
const path = require('path');
var ejs = require('ejs');
const bcryptSalt = process.env.BCRYPT_SALT;

const {
  findUserById,
  assignAdmin,
  createUser,
  findUserByEmail,
  getAllAdmins,
  updateAdmin,
  getAdminById,
} = require('../dao/user.dao');
const { sendMail } = require('../helper/mail');
const { sendMessage } = require('../helper/helpers');
const { messages } = require('../utils/messages');
const { statusCodes } = require('../utils/statusCodes');
const { catchAsync } = require('../utils/catchAsync');

const createAdmin = catchAsync(async (req, res) => {
  const email = req.body.email;
  const userExists = await findUserByEmail(email);

  if (userExists) {
    return sendMessage(
      { code: statusCodes.IM_USED.code },
      messages.ALREADY_REGISTERED,
      statusCodes.IM_USED.code,
      res
    );
  }

  if (req.body.password !== req.body.password_confirmation) {
    return sendMessage(
      { code: statusCodes.NOT_ACCEPTABLE.code },
      messages.PASSWORD_NOT_MATCH,
      statusCodes.NOT_ACCEPTABLE.code,
      res
    );
  }

  let passwordHash = await bcrypt.hash(req.body.password, Number(bcryptSalt));

  // Creating user account
  const registration = await createUser(req.body, passwordHash);

  if (registration) {
    const user = await findUserByEmail(email);
    const user_id = user.id;

    await assignAdmin(user_id);

    const subject = 'Registered on QuiteClear';
    const logo = process.env.CDN_BASEURL + process.env.LOGO_NAME;

    ejs.renderFile(
      path.join(__dirname, '../', 'helper/email_templates/registration.ejs'),
      {
        name: req.body.name,
        username: email,
        password: req.body.password,
        logo: logo,
      },
      function (err, data) {
        if (err) {
          console.error(err);
        } else {
          sendMail(email, subject, data);
        }
      }
    );

    return sendMessage(
      { code: statusCodes.CREATED.code },
      messages.REGISTRATION_SUCCESSFUL,
      statusCodes.CREATED.code,
      res
    );
  }

  return sendMessage(
    { code: statusCodes.INTERNAL_SERVER_ERROR.code },
    messages.UNSUCCESSFUL,
    statusCodes.INTERNAL_SERVER_ERROR.code,
    res
  );
});

const editAdmin = catchAsync(async (req, res) => {
  const userExists = await findUserById(req.params.id);

  if (!userExists) {
    return sendMessage(
      { code: statusCodes.NOT_FOUND.code },
      messages.USER_NOT_FOUND,
      statusCodes.NOT_FOUND.code,
      res
    );
  }

  let passwordHash = await bcrypt.hash(req.body.password, Number(bcryptSalt));

  await updateAdmin(req.params.id, req.body, passwordHash);

  return sendMessage(
    { code: statusCodes.OK.code },
    messages.ADMIN_UPDATED,
    statusCodes.OK.code,
    res
  );
});

const getAdmins = catchAsync(async (_req, res) => {
  let admins = await getAllAdmins();

  return sendMessage(
    { code: statusCodes.OK.code, data: admins.rows },
    messages.ADMINS_FETCHED,
    statusCodes.OK.code,
    res
  );
});

const getAdminDetailById = catchAsync(async (req, res) => {
  let admin = await getAdminById(req.params.id);

  return sendMessage(
    { code: statusCodes.OK.code, data: admin },
    messages.ADMIN_FETCHED,
    statusCodes.OK.code,
    res
  );
});

module.exports = {
  createAdmin,
  editAdmin,
  getAdmins,
  getAdminDetailById,
};
