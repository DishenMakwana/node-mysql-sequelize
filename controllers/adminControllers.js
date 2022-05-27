var generator = require('generate-password');
const bcrypt = require('bcryptjs');
const path = require('path');
var ejs = require('ejs');
const bcryptSalt = process.env.BCRYPT_SALT;

const {
  findUserById,
  assignAdmin,
  createUser,
  add_user_role,
  findUserByEmail,
  addUserWisePricing,
  addRemainingUserWisePricing,
  deleteUserWise,
  blockUnblockUser,
  updateUser,
  getDataForAllUsers,
  getUserPricings,
  getBrandNameById,
  getModelNameById,
  getAllAdmins,
  updateAdmin,
  getAdminById,
} = require('../dao/user.dao');
const {
  createAddress,
  updateUserAddress,
  findSingleUserAddress,
} = require('../dao/useraddress.dao');
const { sendMail } = require('../helper/mail');
const { sendMessage } = require('../helper/helpers');
const { messages } = require('../utils/messages');
const { statusCodes } = require('../utils/statusCodes');
const { catchAsync } = require('../utils/catchAsync');
const { USER_ADMIN, BRAND, MODEL, CUSTOM_PRICE } = require('../utils/constant');
const {
  addConfigData,
  getDataForAllOrders,
  findConfig,
  findConfigById,
  updateConfigData,
  deleteConfigData,
} = require('../dao/order.dao');
const { transformOrderList } = require('../transformers/orderTransformers');
const { transformUserList } = require('../transformers/userTransformers');
const {
  createOrdersExcel,
} = require('../transformers/excel/create_orders.excel');
const {
  createUsersExcel,
} = require('../transformers/excel/create_users.excel');
const { getConfigs, getAllConfigs } = require('../dao/config.dao');

const blockUnblockUsers = catchAsync(async (req, res) => {
  const userExists = await findUserById(req.params.id);

  if (!userExists) {
    return sendMessage(
      { code: statusCodes.OK.code },
      messages.ACCOUNT_DOESNOT_EXISTS,
      statusCodes.OK.code,
      res
    );
  }

  const { registeredUsers, blockStatus } = await blockUnblockUser(
    req.params.id,
    userExists
  );

  if (registeredUsers) {
    if (blockStatus) {
      return sendMessage(
        { code: statusCodes.CREATED.code },
        messages.ACCOUNT_BLOCKED,
        statusCodes.CREATED.code,
        res
      );
    } else {
      return sendMessage(
        { code: statusCodes.CREATED.code },
        messages.ACCOUNT_UNBLOCKED,
        statusCodes.CREATED.code,
        res
      );
    }
  }

  return sendMessage(
    { code: statusCodes.OK.code },
    messages.ACCOUNT_UPDATE_FAILED,
    statusCodes.OK.code,
    res
  );
});



const addConfig = catchAsync(async (req, res) => {
  const configExists = await findConfig(req.body.type);

  if (configExists) {
    return sendMessage(
      { code: statusCodes.IM_USED.code },
      messages.CONFIG_PRICE_ALREADY_ADDED,
      statusCodes.IM_USED.code,
      res
    );
  }

  const configData = await addConfigData(req.body);

  if (!configData) {
    return sendMessage(
      { code: statusCodes.NOT_FOUND.code },
      messages.CONFIG_PRICE_NOT_ADDED,
      statusCodes.NOT_FOUND.code,
      res
    );
  }

  return sendMessage(
    { code: statusCodes.CREATED.code },
    messages.CONFIG_PRICE_ADDED,
    statusCodes.CREATED.code,
    res
  );
});

const updateConfig = catchAsync(async (req, res) => {
  const configExists = await findConfigById(req.params.id);

  if (!configExists) {
    return sendMessage(
      { code: statusCodes.NOT_FOUND.code },
      messages.CONFIG_PRICE_NOT_FOUND,
      statusCodes.NOT_FOUND.code,
      res
    );
  }

  await updateConfigData(req.params.id, req.body);

  return sendMessage(
    { code: statusCodes.CREATED.code },
    messages.CONFIG_PRICE_UPDATED,
    statusCodes.CREATED.code,
    res
  );
});

const deleteConfig = catchAsync(async (req, res) => {
  const configExists = await findConfigById(req.params.id);

  if (!configExists) {
    return sendMessage(
      { code: statusCodes.NOT_FOUND.code },
      messages.CONFIG_PRICE_NOT_FOUND,
      statusCodes.NOT_FOUND.code,
      res
    );
  }

  await deleteConfigData(req.params.id);

  return sendMessage(
    { code: statusCodes.OK.code },
    messages.CONFIG_PRICE_DELETED,
    statusCodes.OK.code,
    res
  );
});

const getCSVForOrders = catchAsync(async (_req, res) => {
  let orderList = await getDataForAllOrders();

  let orders = transformOrderList(orderList.rows);

  await createOrdersExcel(orders, res);
});

const getCSVForUsers = catchAsync(async (_req, res) => {
  let userList = await getDataForAllUsers();

  for (let user of userList.rows) {
    let brand_pricing = [],
      model_pricing = [];

    brand_pricing = await getUserPricings(user.user_id, BRAND);
    model_pricing = await getUserPricings(user.user_id, MODEL);

    for (let brand of brand_pricing) {
      let result = await getBrandNameById(brand.productable_id);
      brand.name = result.name;
    }

    for (let model of model_pricing) {
      let result = await getModelNameById(model.productable_id);
      model.name = result.name;
    }

    user.brand_pricing = brand_pricing;
    user.model_pricing = model_pricing;
  }

  let users = transformUserList(userList.rows);

  await createUsersExcel(users, res);
});

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
  const registration = await createUser(req.body, passwordHash, null);

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

const getAdminDetails = catchAsync(async (req, res) => {
  let admin = await getAdminById(req.params.id);

  return sendMessage(
    { code: statusCodes.OK.code, data: admin },
    messages.ADMIN_FETCHED,
    statusCodes.OK.code,
    res
  );
});

module.exports = {
  createNewUser,
  editUser,
  blockUnblockUsers,
  addConfig,
  getConfig,
  getCSVForOrders,
  getCSVForUsers,
  updateConfig,
  getAllConfig,
  deleteConfig,
  createAdmin,
  editAdmin,
  getAdmins,
  getAdminDetails,
};
