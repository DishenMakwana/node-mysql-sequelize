const { statusCodes } = require('../utils/statusCodes');
const { messages } = require('../utils/messages');
const { sendMessage, sendMetaMessage } = require('../helper/helpers');
const {
  allUsers,
  getuserpricings,
  getUser,
  getcustomuserpricing,
  getUserPaymentMethodDao,
  findUserByEmail,
  createUser,
  add_user_role,
} = require('../dao/user.dao');
const { catchAsync } = require('../utils/catchAsync');
const { BRAND, MODEL, MODELS, BRANDS } = require('../utils/constant');
const {
  findSingleUserAddress,
  createAddress,
} = require('../dao/useraddress.dao');
const {
  transformAddressWithPincode,
} = require('../transformers/addressTransformers');
const { findBrandById } = require('../dao/brand.dao');
const { findModelById } = require('../dao/model.dao');

const getUsers = catchAsync(async (req, res) => {
  let page = parseInt(req.query.page) || 0;
  let size = parseInt(req.query.size) || 10;
  const term = req.query.term || '';

  const users = await allUsers(page, size, term);

  if (!users) {
    return sendMessage(
      { code: statusCodes.NOT_FOUND.code },
      messages.USER_NOT_FOUND,
      statusCodes.NOT_FOUND.code,
      res
    );
  }

  const pageCount = Math.floor(users.count / size);

  return sendMetaMessage(
    { code: statusCodes.OK.code, data: users.rows },
    messages.USERS_LIST,
    statusCodes.OK.code,
    { res, page, size, pageCount, length: users.count }
  );
});

const getUserById = catchAsync(async (req, res) => {
  const user = await getUser(req.params.id);

  if (!user) {
    return sendMessage(
      { code: statusCodes.NOT_FOUND.code },
      messages.USER_NOT_FOUND,
      statusCodes.NOT_FOUND.code,
      res
    );
  }

  let userPricing = await getcustomuserpricing(req.params.id);

  for (const userPrice of userPricing) {
    let productName;

    if (userPrice.productable_type === BRAND) {
      productName = await findBrandById(userPrice.productable_id);
    } else {
      productName = await findModelById(userPrice.productable_id);
    }

    userPrice.productable_name = productName.name;
  }

  user.userwise_pricing = userPricing;

  let addressData = await findSingleUserAddress(req.params.id);

  user.address = transformAddressWithPincode(addressData);

  return sendMessage(
    { code: statusCodes.OK.code, data: user },
    messages.USER_FOUND,
    statusCodes.OK.code,
    res
  );
});

const createNewUser = catchAsync(async (req, res) => {
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

  var password = generator.generate({
    length: 10,
    numbers: true,
  });

  let passwordHash = await bcrypt.hash(password, Number(bcryptSalt));

  // Creating user account
  const registration = await createUser(
    req.body,
    passwordHash,
    String(req.body.payment)
  );

  if (registration) {
    const user = await findUserByEmail(email);
    const user_id = user.id;

    await add_user_role(user_id);

    const subject = 'Registered on QuiteClear';
    const logo = process.env.CDN_BASEURL + process.env.LOGO_NAME;

    ejs.renderFile(
      path.join(__dirname, '../', 'helper/email_templates/registration.ejs'),
      {
        name: req.body.name,
        username: email,
        password: password,
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

const editUser = catchAsync(async (req, res) => {
  const userExists = await findUserById(req.params.id);

  if (!userExists) {
    return sendMessage(
      { code: statusCodes.NOT_FOUND.code },
      messages.ACCOUNT_DOESNOT_EXISTS,
      statusCodes.NOT_FOUND.code,
      res
    );
  }

  const addressData = await findSingleUserAddress(req.params.id);

  await updateUser(req.params.id, req.body);

  return sendMessage(
    { code: statusCodes.CREATED.code },
    messages.USER_EDITED,
    statusCodes.CREATED.code,
    res
  );
});

module.exports = {
  getUsers,
  getUserById,
  createNewUser,
  editUser,
};
