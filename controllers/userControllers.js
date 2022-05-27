const { statusCodes } = require('../utils/statusCodes');
const { messages } = require('../utils/messages');
const { sendMessage, sendMetaMessage } = require('../helper/helpers');
const {
  allUsers,
  getuserpricings,
  getUser,
  getcustomuserpricing,
  getUserPaymentMethodDao,
} = require('../dao/user.dao');
const { catchAsync } = require('../utils/catchAsync');
const { BRAND, MODEL, MODELS, BRANDS } = require('../utils/constant');
const { findSingleUserAddress } = require('../dao/useraddress.dao');
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

const getPricingByUserId = catchAsync(async (req, res) => {
  const id = req.user.id;

  let userpricings;
  if (req.query.type === MODELS) {
    userpricings = await getuserpricings(id, MODEL);
  } else if (req.query.type === BRANDS) {
    userpricings = await getuserpricings(id, BRAND);
  }

  if (!userpricings) {
    return sendMessage(
      { code: statusCodes.NOT_FOUND.code },
      messages.USERPRICING_NOT_FOUND,
      statusCodes.NOT_FOUND.code,
      res
    );
  }

  return sendMessage(
    { code: statusCodes.OK.code, data: userpricings },
    messages.USERPRICING_FOUND,
    statusCodes.OK.code,
    res
  );
});

const getUserPaymentMethod = catchAsync(async (req, res) => {
  const id = req.user.id;
  const mode = await getUserPaymentMethodDao(id);

  if (mode.is_blocked) {
    return sendMessage(
      { code: statusCodes.FORBIDDEN.code },
      messages.ACCESS_FORBIDDEN,
      statusCodes.FORBIDDEN.code,
      res
    );
  }

  return sendMessage(
    { code: statusCodes.OK.code, data: mode },
    messages.USER_PAYMENT_METHOD_FOUND,
    statusCodes.OK.code,
    res
  );
});

module.exports = {
  getUsers,
  getPricingByUserId,
  getUserById,
  getUserPaymentMethod,
};
